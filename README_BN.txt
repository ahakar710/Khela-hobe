KHELA HOBE — ALL-IN-ONE SOURCE BUNDLE
=====================================

এই ZIP-এ কী আছে
---------------
- Premium dark fantasy lobby UI (responsive web app)
- Login / guest entry UI
- Ludo local playable prototype (2 players, dice, token movement)
- Rummy 13-card sorting/deal prototype (not a complete validated multiplayer rules engine)
- Call Break deal/trick UI prototype (not a complete validated multiplayer rules engine)
- Offline practice mode structure
- Firebase Auth / Firestore client integration scaffold
- Firestore security rules
- Cloud Functions scaffold for admin authorization and room creation
- Admin dashboard scaffold (server-side authorization required)
- Voice chat WebRTC scaffold (TURN credentials and signaling backend required)
- Capacitor Android packaging configuration
- Android phone setup guide

গুরুত্বপূর্ণ সীমাবদ্ধতা
----------------------
এটি একটি পূর্ণাঙ্গ, production-ready multiplayer game নয়। Ludo-র local prototype-এ
প্রাথমিক চালের লজিক আছে। Rummy/Call Break-এর জন্য UI ও deal/sort scaffolding আছে;
সম্পূর্ণ নিয়ম, edge-case, matchmaking, anti-cheat, reconnection, server-authoritative
gameplay এবং load testing এখনও প্রয়োজন। Online play, secure admin, voice chat এবং
push notifications চালু করতে Firebase/hosting/TURN সেটআপ ও credentials লাগবে।
কোনো bug-free নিশ্চয়তা দেওয়া যায় না; বাস্তব ডিভাইসে পরীক্ষা করতে হবে।

কোনো real-money betting, cash-out বা cash wagering নেই। Coins শুধুই virtual points।

শুরু করার আগে
--------------
1. Node.js 20+ ও npm লাগবে (অনলাইন build service/কম্পিউটারেও করা যায়)।
2. এই ফোল্ডারের মধ্যে Terminal/Command Prompt খুলুন।
3. চালান:
   npm install
   npm run dev
4. Browser-এ দেখানো local address খুলুন।

Firebase
--------
1. Firebase Console-এ নতুন project তৈরি করুন।
2. Web app যোগ করে Firebase config নিন।
3. src/firebase.js-এ placeholder values বসান।
4. Authentication থেকে Email/Password ও Anonymous sign-in enable করুন।
5. Firestore database তৈরি করুন।
6. firebase deploy --only firestore:rules
7. Functions deploy করার আগে functions/README_BN.txt পড়ুন।

Android
-------
Capacitor config দেওয়া আছে। Android APK build করতে Android SDK/Gradle toolchain
প্রয়োজন। শুধু Android ফোন থাকলে GitHub Codespaces বা সমর্থিত cloud build environment
ব্যবহার করতে পারেন; Android Studio/SDK নিজে ফোনে চালানো সবসময় সম্ভব নয়।
npm run build
npx cap add android
npx cap sync android
এরপর Android project-টি cloud/PC build environment-এ খুলে APK তৈরি করুন।

Admin নিরাপত্তা
--------------
শুধু UI-তে Admin link লুকানো নিরাপত্তা নয়। Firebase custom claims server-side থেকে
দিতে হবে। functions/index.js-এ admin role check scaffold আছে। Owner custom claim
সেট করার জন্য trusted server/admin SDK environment প্রয়োজন; কখনো client থেকে
নিজেকে admin বানাবেন না।

Voice chat
----------
WebRTC signaling-এর scaffold দেওয়া আছে। Production voice-এর জন্য HTTPS, microphone
permission, authenticated signaling, STUN/TURN server, TURN secret management,
room membership validation, mute/leave controls এবং abuse reporting দরকার।
