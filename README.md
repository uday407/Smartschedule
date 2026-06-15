# SmartScheduler-Plus 📅

SmartScheduler-Plus is a lightweight Full-Stack Schedule & Time-Table Management application. It solves the common college problem of class scheduling, HOD control, and workload analysis. It features automatic scheduling conflict detection and interactive workload charts for both days and subjects.

---

## 🚀 Key Features
- **HOD Admin Panel**:
  - Assign classes to professors.
  - Automatic **Conflict Checker** (alerts if a professor has a class at the same day and time).
  - Register/Add new professors dynamically.
  - Interactive **Weekly Workload Chart** (classes per day) and **Subject Workload Chart** (classes per subject).
  - Search and filter schedules.
  - Delete assigned classes.
  - **Reset Data Button** to reload standard demo datasets with one click.
- **Professor Dashboard**:
  - View personal teaching timetable.
  - Quick workload stats (classes per week).
  - Top security tips.
- **Secure Password Changes**: Both HOD and Professors can update their passwords directly from the UI.

---

## 🛠️ Tech Stack & Tools
- **Frontend**: React (Vite), Axios
- **Backend**: Spring Boot, Java 17, Maven
- **Database**: MySQL, Spring Data JPA (Hibernate)

---

## 💻 Project Setup & Installation

### Prerequisite Checklist
- **Java JDK 17** or higher installed.
- **NodeJS** (version 18 or higher) installed.
- **MySQL Server** installed and running on port 3306.

---

### Step 1: Database Setup
1. Open your MySQL client and log in.
2. The backend will automatically create the database `smartscheduler_db` if it does not exist, using the configurations in `application.properties`.
3. Default credentials configured are:
   - **URL**: `jdbc:mysql://localhost:3306/smartscheduler_db`
   - **Username**: `root`
   - **Password**: `mysql` *(If your database password is different, update it inside `backend/src/main/resources/application.properties`)*.

---

### Step 2: Start Spring Boot Backend
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Build and run the backend using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start successfully on port **`8080`**.
4. Verify by opening `http://localhost:8080/api/heartbeat` in your browser.

---

### Step 3: Start React Vite Frontend
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install all node packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server URL (usually **`http://localhost:5173`**).

---

## 🔑 Login Credentials

1. **HOD (Admin)**:
   - **Username**: `admin`
   - **Password**: `admin123`
2. **Professors**:
   - You can add/register new professors from the HOD admin panel.
   - Alternatively, use default seeded users:
     - **Username**: `uday` / **Password**: `123` (Dr. Uday Kumar)
     - **Username**: `sri` / **Password**: `123` (Prof. Srikanth)
