# 🚀 Cloud Deployment Guide for SmartScheduler-Plus

This guide details how to build, run, and deploy the **SmartScheduler-Plus** full-stack application (React, Spring Boot, MySQL) using Docker and Docker Compose.

---

## 🛠️ Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed on the target machine.
- [Docker Compose](https://docs.docker.com/compose/install/) (included in Docker Desktop).

---

## 📦 Local Deployment (Docker Compose)

To spin up the entire application locally with a containerized database:

1. Clone or pull the repository on the target server/machine.
2. Open a terminal in the root directory `smartscheduler-plus/`.
3. Run the following command:
   ```bash
   docker compose up --build -d
   ```
4. This command will:
   - Start a **MySQL 8.0** database container (port `3306`).
   - Run a health check to wait for database readiness.
   - Build the **Spring Boot backend** container (port `8080`).
   - Build the **React Vite frontend** container and host it via **Nginx** (port `80`).
   - Route all frontend `/api` requests automatically through Nginx reverse proxy to the backend.

5. Open your browser and navigate to:
   - **Web App**: `http://localhost` (or `http://localhost:80`)
   - **Backend API**: `http://localhost:8080`

---

## ☁️ Cloud Deployment Options

### 1. Deployment to a Virtual Private Server (VPS)
*(e.g., AWS EC2, DigitalOcean Droplet, Linode, Hetzner)*

1. Provision a VPS running Ubuntu (or your preferred OS).
2. Install Docker and Docker Compose on the VPS:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   ```
3. Transfer your project files to the VPS.
4. Run:
   ```bash
   sudo docker-compose up --build -d
   ```
5. Configure your VPS firewall to allow incoming traffic on port `80`.

---

### 2. Deployment to PaaS Platforms (Render / Fly.io / Heroku)

Because this app utilizes a local MySQL database, PaaS deployment requires running a separate Managed Database (like Render MySQL, AWS RDS, or Aiven MySQL) or setting it up in a multi-container platform.

#### Render.com Setup:
1. **Database**: Spin up a "New PostgreSQL/MySQL" database on Render.
2. **Backend**:
   - Create a new "Web Service" from your git repository.
   - Set the Root Directory to `backend/`.
   - Set the runtime environment to **Docker**.
   - Add Environment Variables:
     - `DB_HOST`: *Your managed DB host*
     - `DB_PORT`: *Your managed DB port*
     - `DB_NAME`: *Your managed DB name*
     - `DB_USER`: *Your managed DB user*
     - `DB_PASSWORD`: *Your managed DB password*
3. **Frontend (Render)**:
   - Create a new "Static Site" or "Web Service" from your git repository.
   - Set the Root Directory to `frontend/`.
   - Add Environment Variables:
     - `VITE_API_URL`: *URL of your deployed backend Web Service (e.g. `https://my-backend.onrender.com`)*

#### Netlify Setup (Frontend):
We have included a [netlify.toml](file:///f:/smartscheduler-plus/frontend/netlify.toml) file in `frontend/` to automatically handle build configurations and routing redirections for React Single Page Application (SPA) routing.

1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project** and link your Git repository.
3. In the Site configuration settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or just `dist` if Netlify builds within the base directory)
4. Add the following environment variable under **Site Configuration > Environment variables**:
   - `VITE_API_URL`: *Your deployed backend API URL (e.g. `https://my-backend-service.onrender.com`)*
5. Click **Deploy site**. Netlify will build the React application and route all pages correctly.

---

## ⚙️ Initializing/Seeding Application Data
Once the containers are running for the first time, you must initialize the database:

1. Visit **`http://localhost/api/setup`** (or your server domain `/api/setup`) in your browser to create the initial admin user:
   - **Username**: `admin`
   - **Password**: `admin123`
2. Alternatively, visit **`http://localhost/api/demo`** to seed full heavy demo schedules and professors.

---

## 🔍 Troubleshooting
- **Database Connection Failures**: Verify that the database credentials in `docker-compose.yml` match those configured for Spring Boot, and that the health check is healthy.
- **CORS Issues**: Ensure frontend calls `/api/...` relative path (when deployed via Nginx docker container) or set `VITE_API_URL` to point to the backend domain explicitly if hosted on different domains.
