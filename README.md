# 🌍 Tele Tourist

<div align="center">

<img src="frontend/assets/img/logo.png" alt="Tele Tourist Logo" width="90" height="90">

### *Skip the brochure. Read what travelers actually did.*

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-20556B?style=for-the-badge)](LICENSE)

[Explore Platform](#-key-features) • [Tech Stack](#%EF%B8%8F-technology-stack) • [Quick Start](#-getting-started) • [API Reference](#-api-endpoints) • [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

**Tele Tourist** is a modern, community-driven travelogue platform where explorers share authentic journeys, uncensored experiences, and hidden gems across India and beyond. Every trip on Tele Tourist is penned by travelers who actually walked the trails, booked the stays, and ate the food.

From discovering offbeat mountain routes to exchanging tips in peer-to-peer real-time messaging, **Tele Tourist** turns travel stories into actionable community inspiration.

---

## ✨ Key Features

### 🗺️ Real Storytelling & Multi-Image Travelogues
- **Rich Story Publishing**: Write rich, paragraph-structured trip reports with high-resolution image galleries.
- **Categorization & Locations**: Tag adventures with travel categories (*Mountains, Desert, Heritage, Nature, Beaches*) and precise geographical locations.
- **4-Pillar Rating System**: Comprehensive traveler rating breakdown for every place:
  - 👥 **People & Hospitality**
  - 🍲 **Food & Local Cuisine**
  - 🧼 **Cleanliness & Hygiene**
  - 🛡️ **Safety & Security**

### 💬 Peer-to-Peer Real-Time Messaging
- **100% Genuine User-to-User Chat**: No simulated bots or random canned replies. True direct messaging between travelers.
- **Navbar Unread Notifications**: Dynamic live-updating badge counter on the navbar chat icon.
- **Offcanvas Chat Drawer**: Instant sliding conversation drawer with active thread polling.
- **Persistent Message Archive**: Synchronized cross-session conversations and unread status.

### 👥 Interactive Community Hub
- **Dynamic Leaderboards**: Filter travelers by **Most Stories**, **Most Liked**, and **Newest** community members.
- **Search & Discover**: Real-time debounced search by name, bio, stories, or location.
- **Top Travelers Cards**: Visual user cards highlighting top rankings, bio snippets, and story snapshots.
- **Lagoon Brand Accents**: Stylized traveler links in signature Lagoon branding.

### 👤 Profile Customization & Author Showcase
- **Complete Profile Management**:
  - Custom profile avatar upload.
  - Custom panoramic banner/cover upload.
  - Editable **Location** field that updates across the header, about tab, and community index.
  - Personal bio and story showcase.
- **Visitor Read-Only Mode**: Clean read-only view for exploring other travelers' public profiles, with a one-click *Copy Profile* link and *Chat* button.
- **Bookmarking**: Save your favorite stories to your private *Saved* vault.

### 🧭 Exploration & Destination Marquee
- **Infinite Marquee**: Seamless carousel showcasing top iconic tourist places across Indian states.
- **Search Filter Pipeline**: Instantly filter stories by location, keywords, or categories.

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Custom modern layouts powered by CSS Variables.
- **Bootstrap 5.3 & Bootstrap Icons**: Responsive grid, modals, and offcanvas panels.
- **JavaScript (ES6+) & jQuery 3.7**: Dynamic UI manipulation, reactive drawers, and AJAX state handlers.
- **Typography**: `Bricolage Grotesque` (headings) and `DM Sans` (body prose).

### Backend
- **Node.js**: Asynchronous event-driven runtime environment.
- **Express.js**: RESTful API routing, middleware pipeline, and error handling.
- **Supabase (PostgreSQL)**: Scalable relational data storage with JSON relations.
- **JWT (JSON Web Tokens)**: Stateless authentication with authorization bearer tokens.
- **bcryptjs**: Secure password hashing with salt rounds.
- **Multer**: Multi-part file upload processing for story galleries, banners, and avatars.

---

## 🎨 Color Palette & Design System

| Token | Hex Code | Visual | Usage |
| :--- | :--- | :---: | :--- |
| `--lagoon` | `#20556B` | ![](https://via.placeholder.com/15/20556B/000000?text=+) | Primary brand color, story headers, chat bubbles |
| `--saffron` | `#E39D3C` | ![](https://via.placeholder.com/15/E39D3C/000000?text=+) | Highlights, rank badges, active navigation border |
| `--ink` | `#12263A` | ![](https://via.placeholder.com/15/12263A/000000?text=+) | High-contrast typography, hero titles, dark accents |
| `--sand-light`| `#FAF6F0` | ![](https://via.placeholder.com/15/FAF6F0/000000?text=+) | Background surfaces, input containers, offcanvas fills |

---

## 📁 Project Structure

```text
Tele-Tourist/
├── backend/
│   ├── src/
│   │   ├── config/              # Supabase & environment configuration
│   │   ├── controllers/         # Express controllers (auth, story, user, message)
│   │   ├── middleware/          # Auth, JWT, upload (multer), error handlers
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic & database service layers
│   │   ├── utils/               # ApiError, formatters, validators
│   │   └── app.js               # Express application initialization
│   ├── .env                     # Backend environment secrets
│   ├── nodemon.json             # Nodemon directory watch configuration
│   ├── package.json             # Node dependencies and scripts
│   └── server.js                # HTTP server bootstrap entrypoint
├── frontend/
│   ├── assets/
│   │   └── img/                 # Logos, icons, banners, and logout imagery
│   ├── css/
│   │   └── style.css            # Custom utility & layout styling
│   ├── js/
│   │   ├── api.js               # Unified client-side API helper
│   │   ├── auth.js              # Session & authentication helpers
│   │   ├── community.js         # Community page leaderboard & search
│   │   ├── config.js            # Frontend API base URL configuration
│   │   ├── create-story.js      # Story authoring & image handler
│   │   ├── destinations.js      # Destination directory controller
│   │   ├── explore.js           # Stories catalog & search filter logic
│   │   ├── home.js              # Homepage hero & category counts
│   │   ├── profile.js           # User profile & story management
│   │   ├── saved.js             # Saved stories collection
│   │   ├── story.js             # Detailed story viewer, ratings & comments
│   │   └── ui.js                # Global navbar, chat drawer, live badge polling
│   ├── auth.html                # Login / Registration view
│   ├── community.html           # Community travelers hub
│   ├── create-story.html        # Story composer
│   ├── destinations.html        # Destinations catalog
│   ├── explore.html             # Explore stories
│   ├── index.html               # Main homepage
│   ├── profile.html             # User profile and settings
│   ├── saved.html               # User saved stories collection
│   └── story.html               # Single story reading experience
└── uploads/                     # Storage for user avatars, banners, and messages
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Supabase Account** with an active project

---

### 2. Installation & Setup

#### Clone the repository
```bash
git clone https://github.com/Namra0001/Tele-Tourist.git
cd Tele-Tourist
```

#### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

Start the backend development server:
```bash
npm run dev
```
*The backend API will run on `http://localhost:5000`.*

---

#### Frontend Setup
Serve the `frontend/` directory using any local web server (e.g. Live Server or `serve`):
```bash
npx serve frontend -l 3000
```
*Open `http://localhost:3000` in your browser.*

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new traveler account |
| `POST` | `/api/auth/login` | Authenticate traveler and receive JWT token |

### 📖 Stories (`/api/stories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stories` | Retrieve stories with search and category filtering |
| `POST` | `/api/stories` | Publish a new story with multiple photos (Auth required) |
| `GET` | `/api/stories/:id` | Get single story with ratings and author info |
| `PUT` | `/api/stories/:id` | Update an existing story |
| `DELETE`| `/api/stories/:id` | Delete a story |
| `POST` | `/api/stories/:id/like` | Like a story |
| `POST` | `/api/stories/:id/save` | Save/Bookmark a story |
| `POST` | `/api/stories/:id/comments` | Post a comment on a story |

### 👤 Users & Community (`/api/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/community` | Get ranked community members (filter by stories/likes/newest) |
| `GET` | `/api/users/:id` | Get traveler profile by ID |
| `GET` | `/api/users/:id/stories` | Get stories authored by a user |
| `GET` | `/api/users/me/saved` | Get authenticated user's saved stories |
| `PUT` | `/api/users/me` | Update name, bio, location, avatar & banner image |

### 💬 Messaging (`/api/messages`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/messages` | Send a real message to another traveler |
| `GET` | `/api/messages/unread-count` | Fetch real-time count of unread incoming messages |
| `GET` | `/api/messages/conversations` | Retrieve all active conversations with latest message snippet |
| `GET` | `/api/messages/thread/:contactId` | Load chat history with a contact and mark as read |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">

Made with ❤️ by the **Tele Tourist** Team

</div>
