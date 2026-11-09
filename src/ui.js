import { firebaseConfigured } from "./firebase.js";
import { newLudoState, rollDice, moveToken } from "./game/ludo.js";
import { dealHands, sortHand } from "./game/cards.js";

const $ = (selector, root = document) => root.querySelector(selector);

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;",
  '"': "&quot;", "'": "&#39;"
}[char]));

export function renderApp(root) {
  if (!root) throw new Error("App root element #app not found.");

  root.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="crest">♛</span>
          <div><b>KHELA HOBE</b><small>PLAY • CONNECT • CELEBRATE</small></div>
        </div>
        <div class="wallet">
          <span>🪙 <b id="coins">1,250</b></span>
          <span>💎 80</span>
          <button data-view="profile">👤</button>
        </div>
      </header>
      <main>
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow">WELCOME TO THE KINGDOM</span>
            <h1>খেলা হবে</h1>
            <p>বন্ধুদের সঙ্গে খেলো, আনন্দ ভাগ করে নাও।</p>
            <div class="hero-actions">
              <button class="primary" data-view="games">এখনই খেলো</button>
              <button class="ghost" data-view="room">রুমে যোগ দাও</button>
            </div>
          </div>
          <div class="moon">☾</div>
          <div class="castle">♜　♜　♜</div>
        </section>

        <section class="section-head">
          <div><small>YOUR ARENA</small><h2>গেম বেছে নাও</h2></div>
          <span class="online">● SYSTEM READY</span>
        </section>

        <section class="games" id="games">
          <article class="game-card ludo">
            <div class="game-icon">🎲</div><span class="tag">CLASSIC</span>
            <h3>Ludo</h3><p>বন্ধুদের সঙ্গে বোর্ডে নামো</p>
            <button data-game="ludo">খেলো →</button>
          </article>
          <article class="game-card rummy">
            <div class="game-icon">🂡</div><span class="tag">13 CARDS</span>
            <h3>13 Card Rummy</h3><p>কার্ড সাজাও, কৌশল দেখাও</p>
            <button data-game="rummy">খেলো →</button>
          </article>
          <article class="game-card call">
            <div class="game-icon">♠</div><span class="tag">TRICK GAME</span>
            <h3>Call Break</h3><p>চাল দাও, পয়েন্ট জিতো</p>
            <button data-game="callbreak">খেলো →</button>
          </article>
        </section>

        <section class="tiles">
          <button class="tile" data-view="offline">📶 <b>Offline Play</b><small>Practice locally</small></button>
          <button class="tile" data-view="online">🌐 <b>Online Play</b><small>Backend setup needed</small></button>
          <button class="tile" data-view="room">🏰 <b>Room</b><small>Create or join</small></button>
          <button class="tile" data-view="rewards">🎁 <b>Rewards</b><small>Daily bonus</small></button>
        </section>

        <section class="lower">
          <div class="panel">
            <small>COMMUNITY</small><h3>বন্ধু ও প্রতিযোগিতা</h3>
            <p>Friends · Tournaments · Leaderboard</p>
            <div class="mini-actions">
              <button data-view="friends">বন্ধু</button>
              <button data-view="tournament">Tournament</button>
              <button data-view="leaderboard">Leaderboard</button>
            </div>
          </div>
          <div class="panel">
            <small>PLAYER PROFILE</small>
            <h3>Level 05 <span class="xp">XP 620 / 1,000</span></h3>
            <div class="progress"><i></i></div>
            <p>প্র্যাকটিস করে XP বাড়াও।</p>
          </div>
        </section>

        <nav class="bottom">
          <button data-view="home">⌂<small>Home</small></button>
          <button data-view="friends">♧<small>Friends</small></button>
          <button data-view="room">♜<small>Room</small></button>
          <button data-view="rewards">✧<small>Rewards</small></button>
          <button data-view="leaderboard">♕<small>Rank</small></button>
          <button data-view="profile">☺<small>Profile</small></button>
        </nav>
      </main>
    </div>

    <div class="modal-wrap hidden" id="modal">
      <div class="modal">
        <button class="close" id="close">×</button>
        <div id="modal-content"></div>
      </div>
    </div>
  `;

  const modal = $("#modal", root);
  const content = $("#modal-content", root);

  const show = html => {
    content.innerHTML = html;
    modal.classList.remove("hidden");
  };

  $("#close", root).onclick = () => modal.classList.add("hidden");

  root.addEventListener("click", event => {
    const gameButton = event.target.closest("[data-game]");
    const viewButton = event.target.closest("[data-view]");

    if (gameButton) {
      const game = gameButton.dataset.game;
      if (game === "ludo") openLudo(show);
      else openCards(show, game);
    } else if (viewButton) {
      openView(show, viewButton.dataset.view);
    }
  });

  if (!firebaseConfigured) {
    console.info("Firebase is not configured. Offline prototype only.");
  }
}

function openView(show, view) {
  const pages = {
    home: ["স্বাগতম", "তোমার গেম লবিতে ফিরে এসেছ।"],
    games: ["গেমস", "Ludo, 13 Card Rummy এবং Call Break বেছে নাও।"],
    offline: ["Offline Practice", "এই সংস্করণে লোকাল প্রোটোটাইপ চালানো যায়।"],
    online: ["Online Play", "অনলাইন ম্যাচের জন্য Firebase ও backend setup প্রয়োজন।"],
    room: ["Room System", "অনলাইন রুম চালুর জন্য backend deploy করতে হবে।"],
    rewards: ["Rewards", "এটি ভার্চুয়াল কয়েনের demo। কোনো cash-out নেই।"],
    friends: ["Friends", "বন্ধু তালিকা ও invite-এর backend সংযোগ বাকি।"],
    tournament: ["Tournament", "টুর্নামেন্টের backend সংযোগ বাকি।"],
    leaderboard: ["Leaderboard", "র‍্যাঙ্কিং ডেটা যুক্ত করতে হবে।"],
    profile: ["Player Profile", "Avatar, XP ও match history যুক্ত করতে হবে।"]
  };

  const [title, description] = pages[view] || ["Coming soon", "এই অংশের কাজ বাকি।"];

  show(`
    <span class="eyebrow">KHELA HOBE</span>
    <h2>${esc(title)}</h2>
    <p>${esc(description)}</p>
    <p class="muted">এটি প্রাথমিক প্রোটোটাইপ।</p>
  `);
}

function openLudo(show) {
  let state = newLudoState();

  const draw = () => {
    show(`
      <span class="eyebrow">LOCAL PRACTICE</span>
      <h2>Ludo Arena</h2>
      <div class="board">
        <div class="home red">● ●<br>● ●</div>
        <div class="home green">● ●<br>● ●</div>
        <div class="path">✦　□　□　□　□　✦<br>□　□　□　□　□　□<br>□　□　◎　□　□　□<br>□　□　□　□　□　□<br>✦　□　□　□　□　✦</div>
        <div class="home blue">● ●<br>● ●</div>
        <div class="home yellow">● ●<br>● ●</div>
      </div>
      <p>${esc(state.status)} · Turn: ${esc(state.players[state.turn].name)}</p>
      <div class="dice">${state.dice ?? "🎲"}</div>
      <button class="primary" id="roll">Roll Dice</button>
      <div class="token-row">
        ${[0,1,2,3].map(i => `<button class="token" data-token="${i}">Token ${i+1}</button>`).join("")}
      </div>
      <p class="muted">Local demo only. Full Ludo rules and online play are not complete.</p>
    `);

    $("#roll", $("#modal-content")).onclick = () => {
      state = rollDice(state);
      draw();
    };

    $("#modal-content").querySelectorAll("[data-token]").forEach(button => {
      button.onclick = () => {
        state = moveToken(state, Number(button.dataset.token));
        draw();
      };
    });
  };

  draw();
}

function openCards(show, game) {
  let hand = sortHand(dealHands(4, 13)[0]);

  const draw = () => {
    const title = game === "rummy" ? "13 Card Rummy" : "Call Break";

    show(`
      <span class="eyebrow">CARD TABLE · PRACTICE</span>
      <h2>${title}</h2>
      <p>তোমার হাতে ১৩টি কার্ড</p>
      <div class="cards">
        ${hand.map(card => `
          <span class="playing-card ${["♥","♦"].includes(card.suit) ? "red-card" : ""}">
            ${esc(card.rank)}<br>${esc(card.suit)}
          </span>
        `).join("")}
      </div>
      <button class="primary" id="sort">কার্ড সাজাও</button>
      <button class="ghost" id="deal">নতুন Deal</button>
      <p class="muted">এটি শুধু card dealing ও sorting demo। সম্পূর্ণ গেমের নিয়ম এখনও যোগ করা হয়নি।</p>
    `);

    $("#sort", $("#modal-content")).onclick = () => {
      hand = sortHand(hand);
      draw();
    };

    $("#deal", $("#modal-content")).onclick = () => {
      hand = sortHand(dealHands(4, 13)[0]);
      draw();
    };
  };

  draw();
}
