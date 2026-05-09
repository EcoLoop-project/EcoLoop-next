# 🌱 EcoLoop — Smart Recycling Platform
**A digital platform connecting households with waste collectors for recyclable materials in Jordan**

[Live Demo](https://eco-loop-eight.vercel.app/) 

---

## About

**EcoLoop** is a web platform designed to simplify the recycling process in Jordan by connecting households that want to dispose of their recyclable waste with trusted collectors in their area.

### How It Works

```
🏠 Household                        🚛 Collector
────────────                        ────────────
1. Posts a waste listing     →      2. Browses & reserves it
3. Waits for collector       ←      4. Heads over & picks up
5. Earns 15 points           ←      5. Taps "Pickup Complete"
6. Redeems points for rewards
```

---

## ✨ Features

### For Households
- 📦 Post recyclable waste listings (plastic, paper, glass, metals, electronics, organic)
- 📍 Auto-detect location via GPS
- 🔔 Real-time notifications when a collector reserves a listing
- 🏆 Points system — **+15 points per successful pickup**
- 🎁 Rewards store — redeem points for discounts and eco-friendly gifts
- ✏️ Edit or delete listings at any time

### For Collectors
- 🗺️ Browse all available listings with filtering by waste type
- ✅ Reserve a listing with a single tap
- 📞 Access household contact info after reserving
- ✔️ "Pickup Complete" button to confirm delivery and credit the household's points
- 🏭 View nearby recycling centers

### General
- 🔐 Secure login via **Phone OTP** (Firebase Phone Auth)
- 🌐 Full bilingual support: **Arabic & English**
- 📱 Fully responsive — works on mobile and desktop
- 📰 Eco guide with real environmental articles about Jordan

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **Next.js 15** | Main framework (App Router) |
| **React** | UI components |
| **Tailwind CSS** | Styling & design |
| **MongoDB + Mongoose** | Database |
| **Firebase Auth** | Phone OTP authentication |
| **Vercel** | Hosting & deployment |
| **Lucide React** | Icons |

---

## 🗂️ Project Structure

```
ecoloop/
├── app/
│   ├── api/
│   │   ├── adv/
│   │   │   ├── route.js          # GET all listings, POST new listing
│   │   │   └── [id]/
│   │   │       └── route.js      # PUT update, DELETE remove
│   │   └── auth/
│   │       ├── check/route.js    # Validate phone before sending OTP
│   │       ├── register/route.js # Register / login
│   │       └── otp/route.js      # Fetch user data
│   └── page.js                   # Main page
│
├── components/
│   ├── AppContext.js              # Global context (state + polling)
│   ├── AuthView.js               # Login / registration page
│   ├── Navbar.js                 # Navigation bar
│   ├── HouseholdView.js          # Household dashboard
│   ├── CollectorView.js          # Collector dashboard
│   └── modals/
│       ├── CancelModal.js        # Cancel reservation confirmation
│       ├── EditListingModal.js   # Edit listing
│       ├── ImpactModal.js        # Environmental impact message
│       ├── NotificationModal.js  # Notifications panel
│       ├── RedeemModal.js        # Redeem points confirmation
│       ├── ReserveModal.js       # Reserve listing confirmation
│       └── SuccessModal.js       # Success feedback
│
├── lib/
│   ├── constants.js              # Waste types, rewards, centers, articles
│   ├── Translations.js           # Arabic / English translations
│   └── firebase.js               # Firebase configuration
│
└── server/
    ├── lib/mongodb.js            # Database connection
    └── models/
        ├── advSchema.js          # Listing model
        └── userSchema.js         # User model
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project (Blaze Plan required for Phone Auth)

### 1. Clone the Repository

```bash
git clone https://github.com/EcoLoop-project/EcoLoop-next.git
cd EcoLoop-next
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env example
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecoloop

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication → Sign-in method → Phone**
3. Upgrade to the **Blaze Plan** (required for Phone OTP on real numbers)
4. Add your domain under **Authentication → Settings → Authorized domains**

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Make sure to add all `.env` variables in **Vercel Dashboard → Settings → Environment Variables**.

---

## 📊 Data Models

### Listing (Advertisement)

```js
{
  type: String,          // 'plastic' | 'paper' | 'glass' | 'metals' | 'electronics' | 'organic'
  quantity: String,      // Description of quantity
  address: String,       // Pickup address
  authorId: String,      // Household user ID
  authorName: String,
  authorPhone: String,
  status: String,        // 'متاح' (available) | 'قيد الاستلام' (reserved) | 'مكتمل' (completed)
  collectorId: String,   // Collector ID after reservation
  collectorName: String,
  collectorPhone: String,
  createdAt: Date
}
```

### User

```js
{
  name: String,
  phone: String,         // International format: +96279...
  role: String,          // 'household' | 'collector'
  points: Number,        // Starts at 50 for households, +15 per completed pickup
  createdAt: Date
}
```

---

## 🔄 Points Logic

```
New registration  →  50 free points  (household only)
Posting a listing →  0 points        (no reward on post)
Pickup confirmed  → +15 points       (added to household when collector taps "Pickup Complete")
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — free to use and modify.

---
## Team Members
 Farah Arada
 Takreet Alzyadat

---

Made with 💚 for a cleaner Jordan

**EcoLoop** — ♻️ Every piece of waste has value


