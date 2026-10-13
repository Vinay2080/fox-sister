# Student Information Management System
### Three-Tier Cloud Architecture: Netlify + Render + MongoDB Atlas

This project implements a full-featured **Student Information Management System (SIMS)** built on an enterprise-grade three-tier cloud architecture:

```
              +---------------------------+
              |      CLIENT BROWSER       |
              +---------------------------+
                            | HTTPS
                            v
              +---------------------------+
              |          NETLIFY          |  Tier 1: Presentation Layer
              |    React.js + Vite SPA    |  (Static Hosting & CDN)
              +---------------------------+
                            | REST API (HTTPS)
                            | CORS Enabled
                            v
              +---------------------------+
              |          RENDER           |  Tier 2: Application Layer
              |    Node.js + Express      |  (Web Service / API)
              +---------------------------+
                            | Mongoose TLS Connection
                            | MONGODB_URI
                            v
              +---------------------------+
              |       MONGODB ATLAS       |  Tier 3: Database Layer
              |  Managed Cloud Database   |  (studentDB -> students)
              +---------------------------+
```

---

## 📁 Project Structure

```
fox-sister/
├── backend/                      # Tier 2: Application / API Layer
│   ├── config/
│   │   └── database.js           # Mongoose Atlas connection handler
│   ├── controllers/
│   │   └── studentController.js  # CRUD & statistics business logic
│   ├── models/
│   │   └── Student.js            # Mongoose Schema (studentId, name, email, etc.)
│   ├── routes/
│   │   └── studentRoutes.js      # REST API endpoints
│   ├── .env.example              # Template for backend environment variables
│   ├── package.json              # Express, Mongoose, CORS, Morgan, Dotenv
│   └── server.js                 # Express server & CORS configuration
│
├── frontend/                     # Tier 1: Presentation Layer
│   ├── public/
│   │   └── _redirects            # Netlify SPA routing rules (/* /index.html 200)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureBanner.jsx # Real-time 3-tier status monitor
│   │   │   ├── DeleteModal.jsx        # Deletion confirmation modal
│   │   │   ├── Header.jsx             # Top bar navigation
│   │   │   ├── StudentModal.jsx       # Add & Edit modal with validation
│   │   │   ├── StudentStats.jsx       # Overview statistics
│   │   │   ├── StudentTable.jsx       # Student record display & actions
│   │   │   └── Toast.jsx              # Feedback toast notifications
│   │   ├── services/
│   │   │   └── api.js                 # REST client for backend endpoints
│   │   ├── App.jsx                    # Root state coordinator
│   │   ├── index.css                  # Custom styling
│   │   └── main.jsx                   # React DOM entry
│   ├── .env.example              # Template for frontend environment variables
│   ├── index.html                # HTML entry
│   ├── package.json              # React 18, Vite, Lucide React
│   └── vite.config.js            # Vite build configuration
│
├── .gitignore                    # Prevents leaking credentials & node_modules
├── package.json                  # Root monorepo scripts
└── README.md                     # Deployment & architecture guide
```

---

## 🛠️ Step-by-Step Deployment Guide

Follow this guide to deploy each of the three tiers to their respective cloud platforms:

---

### Step 1: Database Tier Setup (MongoDB Atlas)

1. **Sign in / Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Free Cluster**:
   - Choose **M0 (Free)** tier.
   - Provider & Region: AWS / Google Cloud (pick whichever is closest, e.g. `ap-south-1` or `us-east-1`).
   - Cluster Name: `Cluster0`.
3. **Create Database User**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Enter a username (e.g. `studentAdmin`) and a strong password (save this password!).
   - Role: **Read and write to any database**.
4. **Configure Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) so that Render can connect to your database.
   - Click **Confirm**.
5. **Get Connection String**:
   - Go to **Database > Clusters** and click **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It will look like:
     ```
     mongodb+srv://studentAdmin:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<db_password>` with your actual password and add `/studentDB`:
     ```
     mongodb+srv://studentAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/studentDB?retryWrites=true&w=majority
     ```

---

### Step 2: Push Your Code to GitHub

Before deploying to Render and Netlify, push your code to your GitHub account:

```bash
git add .
git commit -m "Complete 3-tier Student Management System"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

### Step 3: Application Tier Setup (Render)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `student-api` (or any unique name)
   - **Region**: Closest to your MongoDB Atlas cluster region
   - **Root Directory**: `backend` *(Important!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Configure **Environment Variables** (under *Advanced* or *Environment* tab):
   | Key | Value | Description |
   |---|---|---|
   | `PORT` | `5000` | Port for Express server |
   | `NODE_ENV` | `production` | Production mode |
   | `MONGODB_URI` | `mongodb+srv://studentAdmin:YOUR_PASS@cluster0.../studentDB?...` | Your Atlas connection string |
   | `DB_NAME` | `studentDB` | Database name |
   | `FRONTEND_URL` | `*` *(or your Netlify URL once deployed)* | Permitted origin for CORS |
5. Click **Create Web Service**.
6. Once deployed, Render will provide your public backend URL, e.g.:
   `https://student-api.onrender.com`
7. Verify by opening `https://student-api.onrender.com/health` in your browser. You should receive:
   ```json
   { "status": "UP", "database": "connected" }
   ```

---

### Step 4: Presentation Tier Setup (Netlify)

1. Go to [Netlify Dashboard](https://app.netlify.com/) and click **Add new site > Import an existing project**.
2. Select **GitHub** and authorize your repository.
3. Configure the Build Settings:
   - **Base directory**: `frontend` *(Important!)*
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` *(or `dist`)*
4. Configure **Environment Variables**:
   - Click **Add a variable**.
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_URL` | `https://student-api.onrender.com` | Your deployed Render backend URL |
5. Click **Deploy Site**.
6. Once Netlify finishes building, you will get your public URL, e.g.:
   `https://student-management-system.netlify.app`
7. *(Optional)* Return to Render and update `FRONTEND_URL` from `*` to your exact Netlify domain (`https://student-management-system.netlify.app`) to strictly enforce CORS security.

---

## 🧪 Verification & Test Cases

Execute the test cases specified in the assignment to verify end-to-end functionality:

| Test Case | Action | Input / Request | Expected Result |
|---|---|---|---|
| **Test Case 1: Add Student** | Click **Add Student** button | • **Student ID**: `ST101`<br>• **Name**: `Rahul Sharma`<br>• **Email**: `rahul@example.com`<br>• **Department**: `CSE`<br>• **Semester**: `5`<br>• **Contact**: `9876543210` | Student is added, success toast appears, and row renders in table. |
| **Test Case 2: Display Students** | Refresh or load homepage | `GET /api/students` | Table lists all stored student records retrieved from MongoDB Atlas. |
| **Test Case 3: Update Student** | Click Edit (pencil icon) on `ST101` | Change **Semester** from `5` &rarr; `6` | Record is updated in MongoDB Atlas and immediately reflected in UI. |
| **Test Case 4: Delete Student** | Click Delete (trash icon) on `ST101` | Confirm deletion modal | Record is permanently deleted from MongoDB Atlas. |
| **Test Case 5: Database Verification** | Open MongoDB Atlas Collections | Check `studentDB.students` | Atlas document tree reflects real-time changes made from Netlify frontend. |

---

## 💻 Running Locally (Optional)

If you wish to test the entire stack on your local machine before deploying:

1. Create a `backend/.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   FRONTEND_URL=http://localhost:5173
   ```
2. Start the Backend:
   ```bash
   cd backend
   npm run dev
   ```
3. In a separate terminal, start the Frontend:
   ```bash
   cd frontend
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
