<div align="center">
  <img src="logo.png" alt="StoreZ Logo" width="200"/>

  # StoreZ - Retail Intelligence Suite

  ### Premium E-commerce Platform for Retailers & Suppliers

  [![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://www.oracle.com/java/)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

  [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About StoreZ

**StoreZ** is a modern, full-stack e-commerce platform designed to connect retailers with suppliers in a seamless marketplace experience. Built with enterprise-grade technologies, StoreZ offers a comprehensive solution for product management, order processing, and business analytics.

### 🎯 Key Highlights

- **Multi-Role Architecture**: Separate dashboards for Admin, Supplier, and User roles
- **Real-time Analytics**: Track orders, revenue, and inventory with live statistics
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Beautiful UI that works perfectly on all devices
- **Product Management**: Complete CRUD operations with image upload support
- **Order Workflow**: End-to-end order processing from cart to delivery

---

## ✨ Features

### 👥 For Users (Customers)
- 🛒 **Shopping Cart**: Add products, manage quantities, and checkout seamlessly
- 📦 **Order Tracking**: Monitor order status from pending to delivered
- 💳 **Order History**: View all past purchases with detailed information
- 🔍 **Product Search**: Browse and filter products by categories
- ❤️ **Wishlist**: Save favorite products for later
- 📊 **Dashboard**: Personal analytics showing spending and order statistics

### 🏢 For Suppliers
- 📦 **Product Management**: Add, edit, and manage your product catalog
- 📸 **Image Upload**: Support for product images with automatic optimization
- 📈 **Sales Analytics**: Track revenue, orders, and product performance
- 🔔 **Order Notifications**: Get notified when customers place orders
- ✅ **Approval Workflow**: Submit products for admin review
- 💰 **Earnings Dashboard**: Monitor your revenue and growth metrics

### 🛡️ For Administrators
- 👨‍💼 **User Management**: View and manage all platform users
- 🏪 **Supplier Approval**: Review and approve/reject supplier applications
- 📦 **Product Moderation**: Approve or reject product listings
- 📊 **Platform Analytics**: Comprehensive dashboard with marketplace metrics
- 💵 **Revenue Tracking**: Monitor total and monthly revenue
- 🚨 **System Health**: Quick actions panel for pending approvals

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.4
- **Language**: Java 17
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL 16
- **ORM**: Spring Data JPA / Hibernate
- **Validation**: Jakarta Bean Validation
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: React 18.3
- **Language**: TypeScript 5.6
- **Build Tool**: Vite
- **Routing**: React Router DOM 6.26
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11.3
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Validation**: Zod

### Infrastructure
- **Database**: PostgreSQL (Docker container)
- **Backend**: Dockerized Spring Boot application
- **Frontend**: Vite development server
- **Reverse Proxy**: Nginx (optional)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm/yarn**
- **Docker** and **Docker Compose**
- **PostgreSQL 16** (or use Docker)

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storez.git
   cd storez
   ```

2. **Start the database with Docker**
   ```bash
   docker compose up -d db
   ```

3. **Configure the backend**

   Create or update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/storez_db
       username: storez_user
       password: storez_password
     jpa:
       hibernate:
         ddl-auto: update

   jwt:
     secret: your-secret-key-here
     expiration: 86400000
   ```

4. **Run the backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will be available at: `http://localhost:8080`

5. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

6. **Run the frontend**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173`

### 🐳 Docker Deployment (Recommended)

Run the entire application stack with Docker Compose:

```bash
docker compose up -d
```

This will start:
- PostgreSQL database on port `5432`
- Backend API on port `8080`
- Frontend application on port `5173`

To rebuild and restart:
```bash
docker compose down
docker compose build
docker compose up -d
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register-user` | Register a new customer |
| POST | `/api/auth/register-supplier` | Register a new supplier |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/auth/logout` | Logout current user |
| GET | `/api/auth/me` | Get current user info |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all approved products | Public |
| GET | `/api/products/{id}` | Get product by ID | Public |
| POST | `/api/supplier/products` | Create new product | Supplier |
| PUT | `/api/supplier/products/{id}` | Update product | Supplier |
| DELETE | `/api/supplier/products/{id}` | Delete product | Supplier |
| GET | `/api/supplier/my-products` | Get supplier's products | Supplier |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/user/orders` | Create new order | User |
| GET | `/api/user/orders` | Get user's orders | User |
| GET | `/api/user/orders/{id}` | Get order details | User |
| GET | `/api/supplier/orders` | Get supplier's orders | Supplier |
| PUT | `/api/supplier/orders/{id}/status` | Update order status | Supplier |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get admin statistics |
| GET | `/api/admin/suppliers` | List all suppliers |
| PUT | `/api/admin/suppliers/{id}/approve` | Approve supplier |
| PUT | `/api/admin/suppliers/{id}/reject` | Reject supplier |
| GET | `/api/admin/products/pending` | Get pending products |
| PUT | `/api/admin/products/{id}/approve` | Approve product |
| PUT | `/api/admin/products/{id}/reject` | Reject product |

---

## 🎨 Design System

StoreZ uses a premium blue and gold color scheme:

### Color Palette

```css
/* Primary Brand Colors */
--brand-50: #eff6ff
--brand-600: #2563eb  /* Primary Blue */
--brand-700: #1d4ed8
--brand-900: #1e3a8a

/* Accent Gold Colors */
--gold-400: #fbbf24
--gold-500: #f59e0b  /* Primary Gold */
--gold-600: #d97706
```

### Components
- **Cards**: Rounded corners with hover effects and shadows
- **Buttons**: Gradient backgrounds with smooth transitions
- **Forms**: Clean inputs with validation feedback
- **Dashboards**: Modern cards with statistics and charts
- **Animations**: Smooth Framer Motion transitions

---

## 📂 Project Structure

```
StoreZ/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/storez/
│   │   │   │   ├── config/        # Security & CORS configuration
│   │   │   │   ├── controller/    # REST API endpoints
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── entity/        # JPA Entities
│   │   │   │   ├── repository/    # Data access layer
│   │   │   │   ├── service/       # Business logic
│   │   │   │   └── security/      # JWT & Auth services
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── static/uploads/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Images & static files
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React Context (Auth, Cart)
│   │   ├── pages/            # Route pages
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── supplier/    # Supplier dashboard pages
│   │   │   └── user/        # User pages
│   │   ├── services/         # API service layer
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── logo.png
└── README.md
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt hashing for user passwords
- **CORS Protection**: Configured for specific origins
- **Role-Based Access**: Admin, Supplier, and User roles with different permissions
- **CSRF Protection**: Built-in Spring Security CSRF protection
- **Input Validation**: Jakarta Bean Validation on all DTOs
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📈 Roadmap

- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Email Notifications (Order confirmations, status updates)
- [ ] Advanced Search & Filtering
- [ ] Product Reviews & Ratings
- [ ] Wishlist Functionality
- [ ] Multi-language Support (i18n)
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] Export Reports (PDF, Excel)
- [ ] Live Chat Support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow Java coding conventions
- **Frontend**: Follow React/TypeScript best practices
- **Commits**: Use conventional commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Zakaria Sabaouni**

- Email: zaksab98@gmail.com
- Phone: +49 176 20827199
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- All open-source contributors

---

<div align="center">

  **Built with ❤️ using Spring Boot & React**

  ⭐ Star this repository if you find it helpful!

</div>
