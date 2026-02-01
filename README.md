# Job Portal Application

A full-stack Job Portal system built using Spring Boot and React, designed to connect Job Seekers, Employers, and Admins on a single platform.

This project was developed as a college major project, following real-world enterprise architecture and best practices.

---

## 🚀 Features Overview

### 👤 Job Seeker
- User registration & login (JWT based authentication)
- Browse open jobs with filters
- Apply for jobs
- Upload & view resume (PDF)
- Track application status:
  - Applied
  - Shortlisted
  - Interviewed
  - Hired / Rejected

---

### 🏢 Employer
- Create and manage job postings
- View applicants per job
- Shortlist / Reject candidates
- Schedule interviews
- Mark interviews as completed
- Hire candidates
- Close job postings
- Automatic email notifications on status changes

---

### 🛡️ Admin
- View platform dashboard
- User management:
  - Block / Activate users
  - Delete users (non-admin only)
- Job management:
  - Delete jobs (only if no applications exist)
  - Close jobs with applications
- Analytics Dashboard:
  - User distribution
  - Jobs per employer
  - Applications per job
  - Recruitment funnel
  - Hire rate (color-coded KPI)

---

## 📊 Admin Analytics & Dashboard

### Recruitment Funnel
Applied → Shortlisted → Interviewed → Hired

### Hire Rate KPI
Hire Rate = Hired / Total Applications

### Charts Used
- Funnel Chart
- Pie Chart
- Vertical Bar Chart
- Horizontal Bar Chart

All analytics are computed server-side for accuracy and consistency.

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT Authentication)
- Spring Data JPA (Hibernate)
- MySQL
- Java Mail Sender (Email Notifications)

### Frontend
- React.js
- Axios
- React Router
- Recharts (Analytics & Graphs)

---

## 🏗️ System Architecture

Frontend (React)  
↓  
REST APIs (JWT Secured)  
↓  
Backend (Spring Boot)  
↓  
JPA / Hibernate  
↓  
Database (MySQL)

---

## 🔐 Authentication & Security
- JWT based authentication
- Role based access control:
  - ADMIN
  - EMPLOYER
  - JOB_SEEKER
- Secure API access via interceptors
- Resume access restricted to:
  - Applicant
  - Job owner (Employer)

---

## 📂 Key Modules

### Backend
- User
- Job
- JobApplication
- Admin Analytics
- Email Service
- JWT Security

### Frontend
- Home Page
- Register & Login
- Job Listings
- Employer Dashboard
- Admin Dashboard
- Admin Jobs & Users Panel

---

## 📧 Email Notifications
Automated emails are sent when:
- Application is received
- Candidate is shortlisted
- Interview is scheduled
- Candidate is hired or rejected

Email sending is asynchronous and does not block API execution.

---

## ⚠️ Important Design Decisions
- Jobs with applications cannot be deleted, only closed
- Admin cannot delete another admin
- Hiring is allowed only after interview completion
- Funnel analytics uses cumulative logic for correctness

---

## ▶️ How to Run the Project

### Backend
1. Create a MySQL database
2. Update application.properties with database and email credentials
3. Run the Spring Boot application

### Frontend
```bash
cd frontend
npm install
npm start


---

## 📌 Note
- Database tables are auto-generated using JPA + Hibernate
- No manual SQL schema is required

---

## 👨‍🎓 Author
Aryan Mehra
College Major Project  

