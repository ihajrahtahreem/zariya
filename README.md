# 🌿 Zariya — Real-time Posture Monitoring Dashboard

> **Real-time posture protection for new mothers** — A full-stack web application built with Next.js, PostgreSQL, Prisma, and Socket.IO, designed to work with ESP32 + BNO055 wearable hardware.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🟢 Live Posture Status | Real-time good/warning/bad/very_bad indicator with color-coded UI |
| 🚨 Smart Alerts | Flash alerts for poor posture with severity levels (critical/warning) |
| 📊 Analytics | Daily charts, % good posture, average deviation trends |
| 🤖 Zariya AI Chat | Posture advice chatbot with predefined expert responses |
| 🔌 Hardware Integration | REST API endpoint for ESP32 → PostgreSQL data pipeline |
| ⚡ Real-time Updates | WebSocket-powered live UI via Socket.IO |
| 🎭 Demo Mode | Built-in mock data simulator (no hardware needed) |
| 🔐 Authentication | NextAuth with credentials + demo login |
| ⏱️ Session Timer | Tracks how long you've been monitoring |

---

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS with custom design system
- **Real-time**: Socket.IO
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Fonts**: Cormorant Garamond + DM Sans (Google Fonts)

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
node >= 18
PostgreSQL >= 14
npm >= 9
```

### 2. Clone & Install

```bash
git clone <your-repo>
cd zariya
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/zariya"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE zariya;"

# Push schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with mock data (optional but recommended)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login**: `demo@zariya.health` / `demo`

---

## 🔌 Hardware Integration (ESP32 + BNO055)

### API Endpoint

The ESP32 should POST to:

```
POST http://YOUR_SERVER_IP:3000/api/posture
Content-Type: application/json

{
  "posture": "bad",
  "deviation": 32.5,
  "deviceId": "esp32-001"  // optional
}
```

**Valid posture values**: `good` | `warning` | `bad` | `very_bad`

**Response**:
```json
{
  "success": true,
  "log": { "id": "...", "posture": "bad", "deviation": 32.5, "timestamp": "..." },
  "alert": { "id": "...", "message": "...", "severity": "warning" }
}
```

### Arduino Sketch

See `esp32/zariya_sensor.ino`. Update these variables:

```cpp
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_ENDPOINT  = "http://YOUR_SERVER_IP:3000/api/posture";
```

### Wiring (BNO055 → ESP32)

| BNO055 | ESP32 |
|--------|-------|
| VIN    | 3.3V  |
| GND    | GND   |
| SDA    | GPIO 21 |
| SCL    | GPIO 22 |

---

## 📁 Project Structure

```
zariya/
├── app/
│   ├── api/
│   │   ├── posture/route.ts     # Main API for ESP32
│   │   ├── alerts/route.ts      # Alerts CRUD
│   │   ├── analytics/route.ts   # Analytics data
│   │   ├── mock/simulate/       # Demo data generator
│   │   └── auth/[...nextauth]/  # Auth endpoint
│   ├── login/page.tsx           # Login page
│   ├── page.tsx                 # Dashboard (main)
│   ├── providers.tsx            # NextAuth provider
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Design system
├── components/
│   ├── Header.tsx               # App header with status
│   ├── PostureStatusCard.tsx    # Live posture display
│   ├── AlertBanner.tsx          # Flash alert system
│   ├── AnalyticsChart.tsx       # Recharts analytics
│   ├── ZariyaChat.tsx           # AI chatbot UI
│   ├── PostureHistory.tsx       # Reading history feed
│   ├── MockModePanel.tsx        # Demo mode controls
│   └── DeviceStatus.tsx         # Hardware status
├── hooks/
│   ├── useSocket.ts             # Socket.IO client hook
│   ├── usePosture.ts            # Posture state management
│   └── useSessionTimer.ts       # Session duration timer
├── lib/
│   ├── prisma.ts                # Prisma singleton
│   ├── auth.ts                  # NextAuth config
│   ├── socket-server.ts         # Socket.IO server
│   └── utils.ts                 # Helpers & posture config
├── prisma/
│   ├── schema.prisma            # DB schema
│   └── seed.ts                  # Mock data seeder
├── esp32/
│   └── zariya_sensor.ino        # Arduino sketch
└── server.ts                    # Custom Next.js + Socket.IO server
```

---

## 📊 Database Schema

```sql
-- PostureLog: every reading from the sensor
id        CUID PRIMARY KEY
posture   TEXT  -- good | warning | bad | very_bad
deviation FLOAT -- degrees from baseline
timestamp TIMESTAMP DEFAULT NOW()
deviceId  TEXT  -- optional device identifier

-- Alert: generated when posture is bad
id        CUID PRIMARY KEY
message   TEXT
severity  TEXT  -- info | warning | critical
posture   TEXT
deviation FLOAT
read      BOOLEAN DEFAULT false
createdAt TIMESTAMP DEFAULT NOW()

-- User: for authentication
id        CUID PRIMARY KEY
name      TEXT
email     TEXT UNIQUE
password  TEXT?
```

---

## 🎭 Demo Mode

No hardware? No problem. Enable **Demo Mode** on the dashboard to simulate ESP32 readings every 3 seconds. You can also click **"Send"** to trigger a single reading manually.

---

## 🚢 Production Deployment

### Environment Variables

```env
DATABASE_URL="postgresql://..."     # Use connection pooler for serverless
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="secure-random-string"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_WS_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Build

```bash
npm run build
npm start
```

> **Note**: Socket.IO requires a persistent server. Use the custom `server.ts` via `node server.js` in production, not `next start`. Deploy to a VPS (Railway, Render, DigitalOcean) rather than Vercel for WebSocket support.

---

## 🩺 Health Check

Test your API:

```bash
# Test posture endpoint
curl -X POST http://localhost:3000/api/posture \
  -H "Content-Type: application/json" \
  -d '{"posture": "bad", "deviation": 32}'

# Get latest reading
curl http://localhost:3000/api/posture

# Get analytics
curl "http://localhost:3000/api/analytics?days=7"
```

---

## 🎨 Design System

Zariya uses a custom maternal-wellness color palette:

| Token | Color | Use |
|-------|-------|-----|
| `zariya` | Terracotta/Rust | Primary brand |
| `sage` | Muted green | Good posture |
| `cream` | Warm beige | Backgrounds |
| `blush` | Soft rose | Accents |

Fonts: **Cormorant Garamond** (headings) + **DM Sans** (body)

---

## 📄 License

MIT © 2024 Zariya Health
