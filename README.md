# 🛒 SnapBuy – MERN Stack E-Commerce Platform

SnapBuy is a **production-ready MERN stack e-commerce application** with **role-based access control**, **secure authentication**, **cart & order management**, and **Razorpay payment integration**.

---

##  Features Implemented

### 1. Authentication & User Management
- JWT authentication using **HTTP-only cookies** (access & refresh tokens)
- **Role-Based Access Control (RBAC)** – Admin, Seller, Customer
- Email verification with OTP via **Nodemailer**
- Forgot/Reset password with OTP
- Google & Facebook social login support
- Welcome email on registration
- Logout & secure token handling

---

### 2. Product Management
- Create, update, delete products (Admin/Seller access)
- Bulk product upload via CSV
- Get all products with pagination & filters
- Image upload using **Cloudinary**

---

### 3. Cart Management
- Add to cart
- Update quantity
- Remove item
- Clear cart
- Automatic subtotal & total price calculation
- Coupon support (placeholder for now)

---

### 4. Order Management
- Create order after successful payment
- View all orders for a user
- Admin can view all orders

---

### 5. Payment Integration (Razorpay)
- Create order for payment
- Verify payment signature
- Store payment details in DB
- **Razorpay Webhook** support (for automated payment confirmation)
- Test mode support for localhost

---

### 6. Security & Middleware
- **ApiError** & **ApiResponse** for standardized error & success handling
- Authentication middleware
- Role-based access middleware
- Multer for file uploads

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Redux Toolkit + redux-persist
- Tailwind CSS
- Shadcn UI
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (image uploads)
- Nodemailer (emails)
- Razorpay (payments)
- Multer (file upload)
- JWT (authentication)

---

## 📂 Project Structure

### Backend
```plaintext
backend/
├── src/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── services/
│ └── db/
├── app.js
├── index.js
├── Dockerfile
├── docker-compose.yml
```


### Frontend
``` plaintext
frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── utils/
│ └── App.jsx
├── vite.config.js
├── package.json
```


---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sourya-6/ecommerce.git
```
```bash
cd snapbuy
```


### 2.Backend Setup

```bash
cd backend
npm install
```
Create .env file in backend folder:
```plaintext
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/snapbuy
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.yourservice.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create .env file in frontend folder:
```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_key_id
```

### 4.Running the App
Start Backend:
```bash
cd backend
npm run dev
```
Start Frontend:
```bash
cd frontend
npm run dev
```
