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

### Amazon live prices (optional)

Products can fetch **live prices from Amazon** via the [Rainforest API](https://www.rainforestapi.com/):

1. **Add an `asin`** to any product in `products.json`:
   ```json
   { "id": "demo-realimg-insulated-bottle", "asin": "B0BQJ8L7M8", "price": 27.0, ... }
   ```

2. **Deploy the API** (e.g. to Vercel):
   - The `api/product.ts` serverless function keeps your Rainforest API key **server-side**
   - Add `RAINFOREST_API_KEY` in your hosting env (Vercel → Settings → Environment Variables)
   - Deploy; the API will be at `https://your-app.vercel.app/api/product?asin=XXX`

3. **Point the frontend** at the API:
   - Set `VITE_API_URL=https://your-app.vercel.app` in your build env (or `.env`)
   - Products with an `asin` will fetch live prices before gameplay
   - Optional: set `VITE_AMAZON_DOMAIN=amazon.com` (or your marketplace)

4. **Live randomizer** (optional):
   - The app will pick **random real products** from `src/data/realAsins.ts` when `VITE_API_URL` is set
   - Live product info (title/brand/category/price) is pulled from Rainforest before the round starts

Without `VITE_API_URL` or `RAINFOREST_API_KEY`, the app uses static prices from `products.json`.

### Deploy (Vercel)

**Recommended** for API + frontend:

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Env**: `RAINFOREST_API_KEY` (optional, for live prices)
- **Env**: `VITE_API_URL` = your deployment URL (e.g. `https://pricepeek.vercel.app`) if using live prices

### Deploy (Amplify / static only)

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Deploy the API separately (e.g. Vercel) and set `VITE_API_URL` to that URL.

### Assumptions

- **No real Amazon images**: placeholder category SVGs are used by default.
- **Demo “real image”**: one product uses a locally generated photo-like PNG at `public/images/demo-water-bottle.png` (safe, non-branded).
- **Daily is local-date based**: the “daily” product depends on the user’s local time zone because it uses a `YYYY-MM-DD` key derived locally.
