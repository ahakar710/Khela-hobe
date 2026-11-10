import './style.css';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('HTML root element #app was not found in index.html');
}

app.innerHTML = `
  <main class="kh-app">
    <header class="kh-header">
      <div class="kh-player">
        <div class="kh-avatar" aria-hidden="true">🎮</div>
        <div class="kh-player-info">
          <strong>Player123</strong>
          <span>LEVEL 05 · 120 XP</span>
        </div>
      </div>
      <div class="kh-brand">👑 KHELA HOBE</div>
      <div class="kh-wallet">
        <span>🪙 500</span>
        <span>💎 50</span>
      </div>
    </header>

    <section class="kh-welcome">
      <div>
        <span class="kh-eyebrow">WELCOME BACK!</span>
        <h1>খেলার মজা শুরু হোক!</h1>
        <p>বন্ধুদের সঙ্গে খেলো, আনন্দ করো।</p>
      </div>
      <div class="kh-trophy" aria-hidden="true">🏆</div>
    </section>

    <h2 class="kh-section-title">🎮 জনপ্রিয় গেম</h2>
    <section class="kh-games" aria-label="গেম নির্বাচন">
      <article class="kh-game kh-ludo">
        <div class="kh-game-art" aria-hidden="true">🎲</div>
        <div class="kh-game-copy">
          <h3>LUDO</h3>
          <p>বন্ধুদের সঙ্গে খেলো</p>
          <button type="button" data-game="Ludo">PLAY NOW <span>→</span></button>
        </div>
      </article>

      <article class="kh-game kh-rummy">
        <div class="kh-game-art" aria-hidden="true">🃏</div>
        <div class="kh-game-copy">
          <h3>13 CARD RUMMY</h3>
          <p>তোমার দক্ষতা দেখাও</p>
          <button type="button" data-game="13 Card Rummy">PLAY NOW <span>→</span></button>
        </div>
      </article>

      <article class="kh-game kh-call">
        <div class="kh-game-art" aria-hidden="true">♠️</div>
        <div class="kh-game-copy">
          <h3>CALL BREAK</h3>
          <p>বন্ধুদের সঙ্গে চ্যালেঞ্জ</p>
          <button type="button" data-game="Call Break">PLAY NOW <span>→</span></button>
        </div>
      </article>
    </section>

    <h2 class="kh-section-title">👥 বন্ধুদের সঙ্গে</h2>
    <section class="kh-rooms">
      <button type="button" data-game="Online Friends"><span>🟢</span><strong>Online Friends</strong></button>
      <button type="button" data-game="Create Room"><span>➕</span><strong>Create Room</strong></button>
      <button type="button" data-game="Join Room"><span>🚪</span><strong>Join Room</strong></button>
    </section>

    <section class="kh-extras">
      <button type="button" data-game="Leaderboard">
        <span>🏅</span><strong>লিডারবোর্ড</strong><small>সেরা খেলোয়াড়দের দেখো</small>
      </button>
      <button type="button" data-game="Daily Rewards">
        <span>🎁</span><strong>দৈনিক পুরস্কার</strong><small>ভার্চুয়াল রিওয়ার্ড</small>
      </button>
    </section>

    <nav class="kh-bottom-nav" aria-label="প্রধান মেনু">
      <button class="is-active" type="button" data-game="Home"><span>🏠</span><small>Home</small></button>
      <button type="button" data-game="Games"><span>🎮</span><small>Games</small></button>
      <button type="button" data-game="Friends"><span>👥</span><small>Friends</small></button>
      <button type="button" data-game="Rewards"><span>🎁</span><small>Rewards</small></button>
      <button type="button" data-game="Profile"><span>👤</span><small>Profile</small></button>
    </nav>
    <div class="kh-toast" role="status" aria-live="polite"></div>
  </main>
`;

const toast = app.querySelector('.kh-toast');
let toastTimer;

app.querySelectorAll('[data-game]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.game;
    toast.textContent = selected === 'Home'
      ? 'তুমি হোম স্ক্রিনে আছো।'
      : `${selected} — এই ফিচারটি পরের ধাপে তৈরি করা হবে।`;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  });
});
