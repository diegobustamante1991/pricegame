## PricePeek

A housle-style price guessing game, but for Amazon-like products (local dataset only). Guess the price in USD within 5 tries; each wrong guess unlocks another clue.

### Gameplay

- **Goal**: Guess the product price in USD within **5 tries**
- **Clues**: Start with **image only**; each wrong guess reveals the next clue (up to 5)
- **Feedback**: “Higher/Lower” plus a **warmth** rating based on percent error
- **Win tolerance**: **±3% (minimum ±$1)** so it’s playable
- **Modes**:
  - **Daily**: deterministically picks the same product for a given local date
  - **Random**: picks a random product each round (use “New” to reroll)
- **Persistence**: round state is saved in `localStorage` (refresh won’t lose progress)

### Tech

- React + TypeScript + Vite (client-only)
- Vitest for unit tests

### Local dataset

Edit or add products in:

- `src/data/products.json`

Each product has:

- `id`, `price`, `image`, `clues[]`, `title`, `category`, `brand`

Images are simple category placeholder SVGs in:

- `public/images/*.svg`

### Run locally

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Tests

```bash
npm test
# or
npm run test:run
```

### Deploy (Netlify/Vercel)

This is a static Vite app:

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Assumptions

- **No real Amazon images**: placeholder category SVGs are used by default.
- **Demo “real image”**: one product uses a locally generated photo-like PNG at `public/images/demo-water-bottle.png` (safe, non-branded).
- **Daily is local-date based**: the “daily” product depends on the user’s local time zone because it uses a `YYYY-MM-DD` key derived locally.
