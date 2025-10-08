# 🏠 WanderLodge

A full-stack Airbnb-style application built with MongoDB, Express, and Node.js, allowing users to explore, create, and manage property listings with images, reviews, and map integration.

---

## 🚀 Features

- 🏡 **Browse Listings** – View all properties with price, location, and images.
- ➕ **Add New Listing** – Authenticated users can create new listings with image upload.
- ✏️ **Edit & Delete Listings** – Manage your own properties easily.
- ⭐ **Add Reviews** – Rate and review listings with a 1-5 star system.
- 🗺️ **Map Integration** – View location using Mapbox.
- ☁️ **Cloud Image Storage** – Images stored on Cloudinary.
- 🔒 **Authentication** – Login/logout with secure sessions (Passport.js).
- 🎨 **Responsive UI** – Styled with Bootstrap and custom CSS.

---

## 🧰 Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | EJS, Bootstrap, CSS         |
| Backend         | Node.js, Express.js         |
| Database        | MongoDB (Atlas)             |
| Auth            | Passport.js                 |
| Image Upload    | Cloudinary, Multer          |
| Map Integration | Mapbox API                  |
| Deployment      | Vercel (Frontend + Backend) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/WanderLodge.git
cd WanderLodge
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` file in the root directory

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_secret
MAP_TOKEN=your_mapbox_token
MONGO_ATLAS_URL=your_mongo_connection_string
SESSION_SECRET=your_session_secret
```

### 4️⃣ Run the app locally

```bash
npm run dev
```

Then open:
👉 http://localhost:8080

---

## 🧑‍💻 Project Structure

```
WanderLodge/
│
├── init/                # MongoDB connection setup
├── models/              # Mongoose schemas
├── routes/              # Express routes (listings, reviews, users)
├── public/              # Static assets (CSS, JS, images)
├── views/               # EJS templates
│   ├── layouts/         # Boilerplate layout
│   ├── listings/        # Listing pages
│   └── users/           # Auth pages
├── app.js               # Main app configuration
├── server.js            # Server entry point
├── .env.example         # Example env file (optional)
├── .gitignore
├── package.json
└── README.md
```

---

## 🌍 Deployment (Vercel)

1. Push your project to GitHub
2. Import repo on Vercel
3. Add Environment Variables (same as in `.env`)
4. Deploy 🚀

---

## 🤝 Contributing

Pull requests are welcome!  
If you'd like to suggest improvements or add features, fork the repo and submit a PR.

---

**⭐ If you like this project, please give it a star on GitHub!**
