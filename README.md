# SmartScheduler-Plus ⚡ (Enterprise Edition)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://react.dev/)
[![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Refresh%20Token-red.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SmartScheduler-Plus** is an enterprise-grade full-stack schedule and timetable management platform designed for universities and academic institutions. It features automated AI-assisted timetable generation, real-time conflict detection, role-based security with JWT refresh token revocation, automated email notifications, Spring Data API pagination, and interactive OpenAPI (Swagger UI) documentation.

---

## 🌟 Key Enterprise Features

### 🔐 1. Advanced JWT Authentication & Refresh Token System
- **Dual-Token Architecture**: Short-lived Access Token (JWT) + Long-lived Refresh Token (stored securely in DB with expiration tracking).
- **Session Revocation**: Full `/api/auth/logout` endpoint that revokes refresh tokens instantly upon sign-out.
- **Role-Based Access Control (RBAC)**: Enforced roles (`HOD_ADMIN`, `PROFESSOR`) across REST endpoints.

### ⚡ 2. Automated Conflict Detection Engine
- Prevents double-booking of professors, room overlaps, and group timetable clashes in real time.
- Returns clear conflict warnings before committing schedules to the database.

### 📧 3. Asynchronous Email Notifications (Spring Mail)
- Automated email dispatch via `@Async` background execution when schedules are created, approved, or rejected.

### 📊 4. API Pagination & Advanced Filtering (Spring Data Pageable)
- High-performance `GET /api/schedules/paged?page=0&size=10` endpoint supporting dynamic filtering by subject, professor, room, and group.

### 🛡️ 5. Centralized API Error Response Standard
- Unified error payload format across all controllers (`timestamp`, `status`, `error`, `message`, `path`).

### 📜 6. Interactive OpenAPI / Swagger Documentation
- Built-in Swagger UI at `/swagger-ui/index.html` for zero-setup API testing directly from the browser.

### � 7. Dockerization & CI/CD Pipeline
- Production Multi-Stage `Dockerfile`s for Backend & Frontend.
- Complete `docker-compose.yml` orchestrating MySQL 8.0, Spring Boot Backend, and Nginx React Frontend.
- Automated `Jenkinsfile` pipeline executing Maven unit tests, building Docker images, and deploying.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Backend Core** | Java 17, Spring Boot 3.2.3, Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0 / H2 In-Memory (Fail-Safe Fallback) |
| **Authentication** | JSON Web Tokens (JJWT 0.11.5), Custom Refresh Token Engine |
| **Notifications** | Spring Mail (JavaMailSender), Async Executor |
| **Documentation** | SpringDoc OpenAPI 2.3.0 (Swagger UI) |
| **Frontend Core** | React 18, Vite, Axios (with Request/Response Interceptors) |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |
| **DevOps & Deploy** | Docker, Docker Compose, Jenkins CI/CD, Nginx |

---

## 💻 Quick Start & Running Locally

### 1. Prerequisites
- **Java JDK 17** or higher
- **Node.js** (v18+)
- **Maven 3.9+**
- *(Optional)* **Docker Desktop**

---

### 2. Running with Docker Compose (Recommended)
Launch the entire containerized stack (MySQL + Backend + Frontend) in one command:
```bash
docker-compose up -d --build
```
- **React Frontend UI**: `http://localhost:5173` (or `http://localhost`)
- **Spring Boot API**: `http://localhost:8080`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui/index.html`

---

### 3. Running Manually (Development Mode)

#### Backend Setup:
```bash
cd backend
mvn spring-boot:run
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Login Credentials

| Role | Username | Password | Full Name |
| :--- | :--- | :--- | :--- |
| **HOD / Admin** | `admin` | `admin123` | Administrator |
| **Professor** | `uday` | `123` | Dr. Uday Kumar |
| **Professor** | `sri` | `123` | Prof. Srikanth |

---

## 🧪 Unit Testing
Run the automated test suite with JUnit 5 & Mockito:
```bash
cd backend
mvn test
```
- **Test Coverage**: AuthController authentication, Refresh Tokens, Conflict Engine, and Schedule Service.

---

## 📜 API Documentation & Endpoints

Swagger UI is available live at `http://localhost:8080/swagger-ui/index.html`.

Key Endpoints:
- `POST /api/auth/login` - Authenticate user & get JWT tokens
- `POST /api/auth/refreshtoken` - Obtain new access token via refresh token
- `POST /api/auth/logout` - Revoke refresh token & log out
- `GET /api/schedules/paged` - Search & paginate schedules
- `POST /api/schedules/check-conflicts` - Verify slot availability

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
