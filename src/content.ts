export const APP = {
  name: 'peekle',
  tagline: "You're in a pickle. Guess the price.",
  subtext: 'One product a day. 5 tries. No mercy.',
}

export const BUTTONS = {
  start: 'Start peeking',
  guess: 'Lock it in',
  next: 'Next pickle',
  demo: 'Demo',
  help: 'How to Play',
  share: 'Share my pickle',
  close: 'Close',
}

export const STATES = {
  loading: 'Picking a pickle…',
  win: "You're out of the pickle 🥒",
  lose: (price: string) => `Still in a pickle. The price was ${price}.`,
  tooHigh: 'Too spicy 🌶️ (too high)',
  tooLow: 'Too mild 🧊 (too low)',
  invalid: "That guess won’t fit in the jar.",
}

export const HELP = {
  header: 'How to Play',
  bullets: [
    'We show you a product.',
    'Guess the price in 5 tries.',
    "We’ll tell you if you’re too high or too low.",
    'Get it right to escape the pickle.',
  ],
}

export const LABELS = {
  daily: 'Daily',
  random: 'Random',
  tries: 'Tries',
  score: 'Score',
  last: 'Last',
  remainingTries: (count: number) => `Remaining tries: ${count}`,
  feedbackHint: 'Make a guess to unlock clues.',
  historyEmpty: 'Drop a guess to start the pickle.',
  historyLabel: 'Guess history',
  top3: 'Top 3',
  results: 'Results',
  resultsClose: 'Close results',
  helpClose: 'Close help',
  shareGrid: 'Emoji grid',
  clues: 'Clues',
  clue: (index: number) => `Clue ${index}`,
  clueLocked: 'Locked',
  clueLockedAria: (label: string) => `${label} locked`,
  clueImage: 'Image revealed above.',
  guessAria: 'Set a price in dollars',
  productAlt: 'mystery product',
  gameMode: 'Game mode',
}

export const RESULTS = {
  leaderboardEmpty: 'Win a round to flex your pickle.',
}

export const SHARE_CONFIG = {
  maxTries: 5,
  thresholds: {
    close: 0.1,
    medium: 0.25,
  },
  emojis: {
    correct: '🥒',
    tooHigh: '🔼',
    tooLow: '🔽',
    close: '🟩',
    medium: '🟨',
    far: '🟥',
    locked: '🔒',
  },
}

export const WARMTH = {
  text: {
    correct: 'Correct',
    ice: 'Ice Cold',
    cold: 'Cold',
    warm: 'Warm',
    hot: 'Hot',
    scorching: 'Scorching',
  },
  emoji: {
    correct: '🎯',
    ice: '🧊',
    cold: '🥶',
    warm: '🙂',
    hot: '🔥',
    scorching: '🌋',
  },
}
