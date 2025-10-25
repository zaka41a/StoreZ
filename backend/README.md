# StoreZ Backend (Spring Boot + PostgreSQL + Sessions)

**No JWT** — secure session-based authentication with Spring Security + Spring Session JDBC.  
**PostgreSQL via Docker** with a healthy seed dataset and role-based access (Admin, Supplier, User).

## Quick Start

```bash
# 1) Start PostgreSQL
docker compose up -d db

# 2) Build the app (requires Maven & JDK 17)
./mvnw -q -DskipTests package || mvn -q -DskipTests package

# 3) Run app in Docker alongside db
docker compose up --build app
# App => http://localhost:8080
# Swagger => http://localhost:8080/swagger-ui/index.html
```

### Dev without Docker
- Ensure Postgres running locally (`localhost:5432`, db/user/pass: `storez`)
- Run the app: `./mvnw spring-boot:run` or `mvn spring-boot:run`

## Session Auth
- `POST /api/auth/login`  body: `{ "email": "...", "password": "..." }`
- `GET  /api/auth/me`
- `POST /api/auth/logout`
> Axios must set `withCredentials: true`

## Public API
- `GET /api/public/categories`
- `GET /api/public/products?query=&category=&page=1&limit=12`
- `GET /api/public/products/{id}`

## User API (login required)
- `GET  /api/user/orders`
- `POST /api/user/orders` `{ items: [{ productId, qty }] }`
- `POST /api/user/products/{id}/comments` `{ rating, text }`

## Supplier API (ROLE_SUPPLIER)
- `GET  /api/supplier/products`
- `POST /api/supplier/products`

## Admin API (ROLE_ADMIN)
- `GET  /api/admin/users`
- `PATCH/ api/admin/users/{id}/toggle`
- `GET  /api/admin/suppliers`
- `GET  /api/admin/products`
- `GET  /api/admin/orders`
- `GET  /api/admin/stats`

## Demo Accounts
- Admin — `admin@shop.com` / `admin123`
- Supplier — `supplier@shop.com` / `sup123`
- User — `user@shop.com` / `user123`

## Notes
- CORS set to allow `http://localhost:5173` with credentials.
- CSRF disabled for ease of integration with SPA; you can enable CookieCsrfTokenRepository later.
- Schema: auto via `hibernate.ddl-auto=update` (dev-friendly).
