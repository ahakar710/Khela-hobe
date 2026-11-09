const SUITS = ["♠", "♥", "♦", "♣"];

const RANKS = [
  "A", "2", "3", "4", "5", "6", "7",
  "8", "9", "10", "J", "Q", "K"
];

export function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank, value) => ({
      suit,
      rank,
      value: value + 1
    }))
  );
}

export function shuffle(deck, rng = Math.random) {
  const a = [...deck];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

export function dealHands(playerCount = 4, cardsEach = 13) {
  const deck = shuffle(createDeck());

  return Array.from(
    { length: playerCount },
    (_, i) => deck.slice(i * cardsEach, (i + 1) * cardsEach)
  );
}

export function sortHand(hand) {
  const order = {
    "♠": 0,
    "♥": 1,
    "♦": 2,
    "♣": 3
  };

  return [...hand].sort(
    (a, b) =>
      order[a.suit] - order[b.suit] ||
      a.value - b.value
  );
}
