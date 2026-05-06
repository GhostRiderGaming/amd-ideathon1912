# NourishAI — AI Food Intelligence Platform

> **"Eat smarter, not harder."** — AI that sees your food, understands your goals, and guides every bite.

## 🌟 What is NourishAI?

NourishAI is a smart nutrition assistant that helps individuals make better food choices and build healthier eating habits using AI-powered analysis, contextual recommendations, and personalized coaching.

## ✨ Key Features

- **📸 Food Photo Analysis** — Snap a photo of your meal, Gemini Vision instantly identifies items and calculates nutrition
- **✏️ Text-Based Logging** — Describe what you ate in natural language, AI does the rest
- **📊 Smart Dashboard** — Daily health score, macro tracking rings, streak counter
- **💬 AI Nutritionist Chat** — Personalized coaching that knows your goals, restrictions, and today's intake
- **🎯 Contextual Insights** — "You're 30g short on protein — try adding Greek yogurt"
- **👤 Personalized Goals** — Set calorie/macro targets, dietary restrictions, allergies

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Vanilla CSS (Dark glassmorphism theme) |
| Database | SQLite via Prisma ORM |
| AI Engine | **Google Gemini 2.0 Flash** (Vision + Chat) |
| Deployment | **Google Cloud Run** |
| Typography | **Google Fonts** (Inter + DM Sans) |

## 🔗 Google Services Integration

1. **Google Gemini API** — Core AI for food image analysis, nutritional text parsing, AI nutritionist chat, and contextual meal recommendations
2. **Google Cloud Run** — Production deployment with auto-scaling
3. **Google Fonts** — Premium typography (Inter, DM Sans)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API Key

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/amd-ideathon1912.git
cd amd-ideathon1912

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="file:./dev.db"
```

## 📁 Project Structure

```
├── prisma/schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── page.js               # Dashboard
│   │   ├── log/page.js           # Meal logging (photo + text)
│   │   ├── chat/page.js          # AI nutritionist
│   │   ├── history/page.js       # Meal history
│   │   ├── profile/page.js       # Profile & goals
│   │   └── api/                  # REST API endpoints
│   ├── lib/
│   │   ├── gemini.js             # Gemini API client
│   │   ├── prompts.js            # AI prompt templates
│   │   ├── prisma.js             # Database client
│   │   └── nutrition.js          # Calculation utilities
│   └── components/               # Reusable UI components
├── Dockerfile                    # Cloud Run deployment
└── README.md
```

## 🏗️ Architecture

```
User → Next.js Frontend → API Routes → Gemini AI → SQLite DB
                                    ↓
                          Food Analysis / Chat / Recommendations
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze food photo via Gemini Vision |
| POST | `/api/meals` | Log meal with AI text analysis |
| GET | `/api/dashboard` | Daily summary + AI insight |
| POST | `/api/chat` | AI nutritionist conversation |
| GET | `/api/recommendations` | Context-aware food suggestions |
| POST | `/api/user` | Create/update user profile |

## 📱 Screens

1. **Dashboard** — Health score ring, macro tracking, AI insight, today's meals
2. **Log Meal** — Photo scan or text description with AI analysis
3. **AI Chat** — Full conversational nutritionist
4. **History** — Date-grouped meal history with daily summaries
5. **Profile** — Goals, restrictions, allergies, daily targets

## ♿ Accessibility

- Semantic HTML with ARIA labels and roles
- Keyboard navigable
- Screen reader compatible
- Color contrast compliant
- Focus indicators
- Loading states for all async operations

## 🔒 Security

- API keys stored server-side only (never exposed to client)
- Input validation on all endpoints
- Parameterized database queries via Prisma
- No user authentication data stored (simplified for MVP)

## 📄 License

MIT
