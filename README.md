# CareerTrack – Application and Certificate Management System

Live Website:https://career-track-sepia.vercel.app
Backend API:https://careertrack-1-vhdt.onrender.com/   

## 1. Project Overview

CareerTrack is a Full Stack Web Application developed to help students manage internship applications and certificates in one place.

Students can register, log in, submit internship applications, view their application records, upload certificates, and download their certificates securely.

## 2. Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML
- CSS
- React Router

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Security and File Management**
- JSON Web Token (JWT)
- bcryptjs
- Multer

## 3. Main Features

- User registration and login.
- Password hashing using bcryptjs.
- JWT-based user authentication.
- Internship application submission and tracking.
- Certificate uploading and viewing.
- Authenticated certificate downloads.
- User-specific application and certificate records.

## 4. How the Project Works

1. **Registration:** A new student creates an account with their name, email, and password.
2. **Login:** The backend verifies the user's credentials and generates a JWT token.
3. **Authentication:** The frontend sends the token with protected API requests.
4. **Application Management:** Students submit internship details such as company name, position, and application date. The backend stores the details in MongoDB with the user's ID.
5. **Certificate Management:** Students upload certificate details and files. The backend stores the certificate information in MongoDB and the uploaded file in the server's uploads folder.
6. **Certificate Download:** The backend checks the logged-in user's ownership before allowing the certificate to be downloaded.

## 5. Project Structure

```text
CareerTrack/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Application.js
│   │   ├── Certificate.js
│   │   └── User.js
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── certificateRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── App.css
│
├── .gitignore
├── package.json
└── README.md
```

## 6. How to Run the Project

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/sameera745/CareerTrack.git
cd CareerTrack
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the backend folder.

Add your own MongoDB connection string and a secure JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not upload this file to GitHub.

### Step 5: Start the Backend

From the backend folder, run:

```bash
node server.js
```

The backend runs at:

`https://careertrack-1-vhdt.onrender.com`

### Step 6: Start the Frontend

Open another terminal in the main CareerTrack folder and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 7. Database Collections

The project uses MongoDB collections for:

- **Users:** Stores student account information and hashed passwords.
- **Applications:** Stores internship application details and user ownership.
- **Certificates:** Stores certificate information, file paths, and user ownership.

## 8. Conclusion

CareerTrack provides a centralized platform for students to manage internship applications and certificates. It combines a React frontend, an Express backend, MongoDB database storage, and JWT-based authentication to provide user-specific access to records and certificate downloads.

## 9. Author

**Project:** Application and Certificate Management System  
**Project Name:** CareerTrack  
**Course:** Full Stack Development (FSD)
