# StoreZ Frontend (React + Vite + Tailwind)

A beautiful, production-ready e-commerce frontend with 3 roles (Admin, Supplier, User), mock APIs (no JWT), role-based routing, and subtle animations (Framer Motion).

## Quick Start
```bash
npm install
npm run dev
# App: http://localhost:5173
```

## Demo Credentials
- Admin: `admin@shop.com` / `admin123`
- Supplier: `supplier@shop.com` / `sup123`
- User: `user@shop.com` / `user123`

## Stack
- React + TypeScript (Vite)
- TailwindCSS
- React Router DOM v6
- Axios + axios-mock-adapter
- Context API (Auth, Cart)
- Framer Motion (animations)

## Switch to Spring Boot
- Remove `import '@/services/mockServer'` in `src/main.tsx`
- Set your backend URL in `src/services/api.ts`
