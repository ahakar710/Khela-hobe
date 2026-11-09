export const TRACK_LENGTH = 52;
export const HOME_POSITION = 57;
export const TOKENS_PER_PLAYER = 4;

const PLAYER_CONFIG = [
  { name: "You", color: "gold" },
  { name: "Friend", color: "violet" }
];

export function newLudoState() {
  return {
    turn: 0,
    dice: null,
    status: "Roll the dice",
    players: PLAYER_CONFIG.map(player => ({
      ...player,
      tokens: Array(TOKENS_PER_PLAYER).fill(-1)
    }))
  };
}

export function rollDice(state, rng = Math.random) {
  if (!isValidState(state)) return state;
  if (state.dice !== null) return state;
  if (typeof rng !== "function") return state;

  const randomValue = rng();

  if (
    !Number.isFinite(randomValue) ||
    randomValue < 0 ||
    randomValue >= 1
  ) {
    return state;
  }

  const dice = Math.floor(randomValue * 6) + 1;

  return {
    ...state,
    dice,
    status: dice === 6
      ? "Six! Choose a token"
      : "Choose a token"
  };
}

export function moveToken(state, tokenIndex) {
  if (!isValidState(state)) return state;

  if (
    !Number.isInteger(tokenIndex) ||
    tokenIndex < 0 ||
    tokenIndex >= TOKENS_PER_PLAYER
  ) {
    return state;
  }

  if (state.dice === null) {
    return {
      ...state,
      status: "First roll the dice"
    };
  }

  const player = state.players[state.turn];
  const oldPosition = player.tokens[tokenIndex];

  if (oldPosition === HOME_POSITION) {
    return {
      ...state,
      status: "This token has already finished"
    };
  }

  if (oldPosition === -1 && state.dice !== 6) {
    return {
      ...state,
      status: "A 6 is needed to start"
    };
  }

  const nextPosition = oldPosition === -1
    ? 0
    : oldPosition + state.dice;

  if (nextPosition > HOME_POSITION) {
    return {
      ...state,
      status: "Exact roll needed to reach home"
    };
  }

  const players = state.players.map((currentPlayer, index) => {
    if (index !== state.turn) return currentPlayer;

    return {
      ...currentPlayer,
      tokens: currentPlayer.tokens.map((position, token) =>
        token === tokenIndex ? nextPosition : position
      )
    };
  });

  const finished = nextPosition === HOME_POSITION;
  const extraTurn = state.dice === 6;

  return {
    ...state,
    players,
    turn: extraTurn ? state.turn : 1 - state.turn,
    dice: null,
    status: finished
      ? "Token reached home!"
      : "Move complete"
  };
}

export function isValidState(state) {
  if (!state || typeof state !== "object") return false;

  if (![0, 1].includes(state.turn)) return false;

  if (
    state.dice !== null &&
    (!Number.isInteger(state.dice) ||
      state.dice < 1 ||
      state.dice > 6)
  ) {
    return false;
  }

  if (!Array.isArray(state.players) || state.players.length !== 2) {
    return false;
  }

  return state.players.every(player =>
    Array.isArray(player.tokens) &&
    player.tokens.length === TOKENS_PER_PLAYER &&
    player.tokens.every(position =>
      Number.isInteger(position) &&
      position >= -1 &&
      position <= HOME_POSITION
    )
  );
      }
