# 🏠 Micro Real Estate Rent Tracker (AsikhRent)

This is a full-stack application designed to help small landlords or property managers track monthly rent payments for tenants. It supports user authentication, adding/viewing rent payments, and checking monthly payment status per tenant.

---

## 🚀 Features

- ✅ Login authentication
- ✅ Add rent payment for tenants
- ✅ View complete rent payment history
- ✅ View all tenants with current month's payment status (Paid / Pending)
- ✅ Auto-reset payment status at the beginning of each month

---

## 🛠️ Tech Stack Used

### 🌐 Frontend (React.js)
- **React.js** – JavaScript frontend library
- **CSS** – For styling
- **React Router** – Client-side routing for dashboard navigation

### 🧠 Backend (Flask)
- **Python (Flask)** – Lightweight backend framework
- **Flask-SQLAlchemy** – ORM for PostgreSQL
- **Flask-CORS** – Enable cross-origin requests
- **Werkzeug** – Password hashing and authentication

### 🛢️ Database
- **PostgreSQL** – Relational database to store users, tenants, and rent payments

### 📦 Others
- **Git** – Version control
- **VS Code** – Editor
- **npm / pip** – Package managers

---

## 📁 Project Structure

```

AsikhRent\_Project/
├── backend/
│   ├── backend\_app.py
└── init.sql
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Component/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddPayment.js
│   │   │   └── (Other Components...)
│   │   ├── index.js
│   └── package.json
└── README.md

````

---

## 🖼️ Screenshots

> Add screenshots in a folder like `/screenshots` and link below.

### 📌 Login Page
<img width="957" height="446" alt="for_Git1st" src="https://github.com/user-attachments/assets/782ed52e-a858-4cb8-94d2-13240bd29509" />


### 📌 Dashboard Tabs
<img width="957" height="439" alt="for_Git2nd" src="https://github.com/user-attachments/assets/786a84d4-6eb8-47ee-88e8-272d4a545e1f" />


### 📌 Add Rent Payment
<img width="953" height="434" alt="for_Git4th" src="https://github.com/user-attachments/assets/048c9dab-a0ee-498d-aa4b-6b2ea4eaf922" />


### 📌 Payment Status
<img width="956" height="434" alt="for_Git3rd" src="https://github.com/user-attachments/assets/f85e95b6-c1e2-4114-ba3d-b76d195a81af" />



---

## 💻 How to Run This Project Locally

### ✅ Backend Setup (Flask + PostgreSQL)

1. **Install Python packages**

```bash
cd backend
pip install -r requirements.txt
````

> If you don't have `requirements.txt`, install manually:

```bash
pip install flask flask_sqlalchemy flask_cors psycopg2-binary werkzeug
```

2. **Start PostgreSQL server**

Make sure PostgreSQL is running and the database `asikh_rent` exists. If not:

```sql
CREATE DATABASE asikh_rent;
```

3. **Run the backend**

```bash
python backend_app.py
```

It will run on `http://127.0.0.1:5000`

---

### ✅ Frontend Setup (React)

1. **Install frontend packages**

```bash
cd frontend
npm install
```

2. **Run the React App**

```bash
npm start
```

The app will run at `http://localhost:3000`



## 🤝 Contribution Guide

1. Fork this repo
2. Clone the forked version
3. Make your changes in a new branch
4. Submit a Pull Request 🚀


## 📬 Contact

For questions or help, feel free to reach out:

* **Developer:** Ashutosh Ranjan
* **Email:** \[[ashutosh@qsofte.com](mailto:ashutosh@qsofte.com)]

