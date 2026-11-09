const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { randomBytes } = require("node:crypto");

initializeApp();
const db = getFirestore();

function requireUser(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Please sign in first.");
  }
  return request.auth.uid;
}

function requireAdmin(request) {
  const uid = requireUser(request);
  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Admin access is required.");
  }
  return uid;
}

function makeRoomCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

exports.createRoom = onCall(async (request) => {
  const uid = requireUser(request);
  const game = String(request.data?.game || "ludo").trim().toLowerCase();
  const allowedGames = new Set(["ludo", "rummy", "callbreak"]);
  if (!allowedGames.has(game)) {
    throw new HttpsError("invalid-argument", "Unsupported game type.");
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = makeRoomCode();
    const codeRef = db.collection("roomCodes").doc(code);
    const roomRef = db.collection("rooms").doc();

    const created = await db.runTransaction(async (transaction) => {
      const codeSnapshot = await transaction.get(codeRef);
      if (codeSnapshot.exists) return false;

      transaction.create(codeRef, {
        roomId: roomRef.id,
        createdAt: FieldValue.serverTimestamp(),
      });
      transaction.create(roomRef, {
        code,
        game,
        ownerUid: uid,
        members: [uid],
        maxPlayers: 4,
        status: "waiting",
        createdAt: FieldValue.serverTimestamp(),
      });
      return true;
    });

    if (created) return { roomId: roomRef.id, code };
  }

  throw new HttpsError("resource-exhausted", "Could not create a unique room. Please try again.");
});

exports.joinRoom = onCall(async (request) => {
  const uid = requireUser(request);
  const code = String(request.data?.code || "").trim().toUpperCase();
  if (!/^[A-F0-9]{8}$/.test(code)) {
    throw new HttpsError("invalid-argument", "Enter a valid 8-character room code.");
  }

  const codeRef = db.collection("roomCodes").doc(code);
  const codeSnapshot = await codeRef.get();
  if (!codeSnapshot.exists) {
    throw new HttpsError("not-found", "Room not found.");
  }

  const roomRef = db.collection("rooms").doc(codeSnapshot.get("roomId"));
  await db.runTransaction(async (transaction) => {
    const roomSnapshot = await transaction.get(roomRef);
    if (!roomSnapshot.exists) {
      throw new HttpsError("not-found", "Room no longer exists.");
    }

    const room = roomSnapshot.data();
    const members = Array.isArray(room.members) ? room.members : [];
    if (members.includes(uid)) return;
    if (room.status !== "waiting") {
      throw new HttpsError("failed-precondition", "This room is not accepting players.");
    }
    const maxPlayers = Number.isInteger(room.maxPlayers) ? room.maxPlayers : 4;
    if (members.length >= maxPlayers) {
      throw new HttpsError("resource-exhausted", "This room is full.");
    }

    transaction.update(roomRef, {
      members: [...members, uid],
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  return { roomId: roomRef.id };
});

exports.publishAnnouncement = onCall(async (request) => {
  const uid = requireAdmin(request);
  const message = typeof request.data?.message === "string"
    ? request.data.message.trim()
    : "";
  if (!message || message.length > 500) {
    throw new HttpsError("invalid-argument", "Announcement must be 1 to 500 characters.");
  }

  const announcementRef = db.collection("announcements").doc();
  const auditRef = db.collection("adminAudit").doc();
  const batch = db.batch();
  batch.create(announcementRef, {
    message,
    createdBy: uid,
    createdAt: FieldValue.serverTimestamp(),
  });
  batch.create(auditRef, {
    action: "publishAnnouncement",
    target: announcementRef.id,
    actor: uid,
    createdAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
  return { id: announcementRef.id };
});
