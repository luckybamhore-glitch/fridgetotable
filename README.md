# 🍳 Fridge to Table — Smart Recipe Generator from Fridge Photo

An AI-powered culinary companion built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Google Gemini Vision API**, and **Cloudinary**.

Turn whatever ingredients are inside your refrigerator into gourmet, restaurant-quality dinners with step-by-step editorial guides, step countdown timers, and chef advice.

---

## 🌟 Key Features

1. **Exact Editorial UI (from Design Mockup)**:
   - Warm linen and terracotta palette (`#FAF4EC`, `#D9532F`).
   - Editorial typography using Google Fonts *Playfair Display* and *Plus Jakarta Sans*.
   - Interactive **Example Ingredient Board** with live selectable pill chips (*Salmon Fillets*, *Garlic*, *Spinach*, *Heavy Cream*, *Sun-dried Tomatoes*, *Butter*).
   - Floating glassmorphism card for **"Tonight's Pick"** with match rating and cook time.

2. **Image-to-Text AI Vision Pipeline**:
   - Upload fridge photos via drag-and-drop or browse.
   - Built-in live camera capture snapshot.
   - 3 one-click preset fridge scenarios (Gourmet Mediterranean, Farmer's Market Crisper, Pan-Asian Poultry).
   - High-resolution upload to **Cloudinary CDN**.
   - **Google Gemini 1.5 / 2.5 Vision AI** inspects shelves, crisper drawers, and bottles to identify all produce, dairy, proteins, and pantry staples.

3. **The Cutting Board**:
   - Categorized live inventory (Produce, Dairy & Eggs, Meat & Seafood, Pantry & Grains, Condiments).
   - Real-time custom ingredient adder and chip remover.
   - Dietary & cooking filters: *Under 30 Mins*, *High Protein*, *Vegetarian*, *Gluten-Free*, *Low Carb*, *Keto-Friendly*.

4. **Gourmet Recipe Generator & Cooking Mode**:
   - Matches recipes against your fridge with pantry match percentage (`96% Match`).
   - Highlights ingredients you already have vs. missing pantry staples with recommended substitutions.
   - Interactive step-by-step cooking steps with **built-in step countdown timers**.
   - Chef's secret techniques & culinary science explanations (*"Why It Works"*).
   - Sommelier wine and beverage pairings.
   - Interactive **Chef Assistant AI** for questions like *"Can I replace heavy cream with milk?"*.
   - Save favorite recipes to MongoDB / persistent storage.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables (Optional)
Open `backend/.env` to configure your keys:
```env
PORT=5050
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_connection_string
```
> **Note:** The app features a **zero-setup fallback mode** that runs immediately out of the box with realistic mock vision detection, high-speed data-URIs, and in-memory recipe saving, so you can test all UI flows instantly even before setting up API keys!

### 3. Run the Development Servers
In two separate terminals:

**Backend:**
```bash
cd backend
npm run dev
```
*(Server runs on `http://localhost:5050`)*

**Frontend:**
```bash
cd frontend
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 📡 API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` — Create account `{ name, email, password }` -> `{ user, token }`
- `POST /api/auth/login` — Log in `{ email, password }` -> `{ user, token }`
- `GET /api/auth/me` — Current user (requires `Authorization: Bearer <token>`)

### Vision & Recipes
- `GET /api/health` — System status (Gemini Vision, Cloudinary, MongoDB, auth)
- `GET /api/vision/samples` — Retrieve preset fridge scenarios
- `POST /api/vision/analyze` — Multer upload -> Cloudinary CDN -> Gemini Vision ingredient detector
- `POST /api/recipes/generate` — Generate tailored recipes from ingredient list & dietary preferences
- `POST /api/recipes/chef-assistant` — Ask AI Chef about technique or substitutions
- `GET /api/recipes/saved` — Get **my** saved recipes (🔒 auth required, per-user)
- `POST /api/recipes/save` — Save recipe to **my** favorites (🔒 auth required)
- `DELETE /api/recipes/saved/:id` — Remove my recipe (🔒 auth required, ownership enforced)

## 🧭 Frontend Routes (react-router-dom)

- `/` — Home (hero, cutting board, generated recipes)
- `/login` — Log in
- `/register` — Create account
- `/saved` — My cookbook (🔒 protected, redirects to `/login` when logged out)
- `/404` — Not found (unknown paths redirect here)

Auth state lives in `frontend/src/context/AuthContext.jsx`, tokens in
`localStorage` (`ftt_token`), and every API call goes through
`frontend/src/lib/api.js` which attaches `Authorization: Bearer` automatically.

## 🏭 Production Run

```bash
# 1. Build the frontend
cd frontend && npm run build

# 2. Configure backend/.env (PORT, NODE_ENV=production, FRONTEND_URL, JWT_SECRET, keys...)

# 3. Start the production server (serves API + frontend/dist as a single app)
cd ../backend && npm start
```

Set `FRONTEND_URL` to your deployed frontend origin(s) for strict CORS, and
`VITE_API_URL` on the frontend when API and frontend are deployed separately.
