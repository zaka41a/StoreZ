# Guide de Déploiement - StoreZ

## 📋 Prérequis

### Backend
- Java 17 ou supérieur
- Maven 3.8+
- PostgreSQL 14+
- Minimum 512MB RAM
- 1GB espace disque

### Frontend
- Node.js 18+ et npm 9+
- Minimum 256MB RAM

---

## 🚀 Déploiement Local

### 1. Configuration de la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données et l'utilisateur
CREATE DATABASE storez;
CREATE USER storez WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE storez TO storez;
\q
```

### 2. Configuration Backend

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et configurer vos valeurs
nano .env

# Installer les dépendances et compiler
mvn clean install -DskipTests

# Lancer l'application
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

**Comptes de test pré-configurés**:
- Admin: `admin@storez.com` / `admin123`
- User: `user@storez.com` / `user123`
- Supplier: `supplier@storez.com` / `sup123`

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
echo "VITE_API_URL=http://localhost:8080/api" > .env.local

# Lancer en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 🐳 Déploiement avec Docker

### Créer un Dockerfile pour le Backend

```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Créer un Dockerfile pour le Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: storez
      POSTGRES_USER: storez
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - storez-network

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/storez
      SPRING_DATASOURCE_USERNAME: storez
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - storez-network

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:8080/api
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - storez-network

volumes:
  postgres_data:

networks:
  storez-network:
    driver: bridge
```

**Lancer avec Docker Compose**:
```bash
# Créer un fichier .env à la racine
echo "DB_PASSWORD=secure_password" > .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

---

## ☁️ Déploiement sur le Cloud

### Option 1: Heroku

#### Backend
```bash
cd backend

# Créer une app Heroku
heroku create storez-backend

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:mini

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Déployer
git push heroku main
```

#### Frontend
```bash
cd frontend

# Créer une app Heroku
heroku create storez-frontend

# Configurer l'API URL
heroku config:set VITE_API_URL=https://storez-backend.herokuapp.com/api

# Ajouter buildpack Node.js
heroku buildpacks:add heroku/nodejs

# Déployer
git push heroku main
```

### Option 2: AWS (EC2 + RDS)

#### 1. Créer une instance RDS PostgreSQL
```bash
# Dans AWS Console:
- RDS > Create Database
- PostgreSQL 14.x
- Free tier / Production selon besoins
- Notez l'endpoint et les credentials
```

#### 2. Configurer EC2
```bash
# SSH dans l'instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Installer Java et PostgreSQL client
sudo apt update
sudo apt install openjdk-17-jdk maven postgresql-client -y

# Cloner le projet
git clone https://github.com/votre-username/storez.git
cd storez/backend

# Configurer .env
nano .env
# Ajoutez vos configurations

# Compiler et lancer
mvn spring-boot:run
```

### Option 3: DigitalOcean App Platform

Créer un fichier `app.yaml`:
```yaml
name: storez
region: fra

databases:
  - name: storez-db
    engine: PG
    version: "14"

services:
  - name: backend
    github:
      repo: votre-username/storez
      branch: main
      deploy_on_push: true
    source_dir: /backend
    build_command: mvn clean package -DskipTests
    run_command: java -jar target/storez-backend-1.0.0.jar
    envs:
      - key: SPRING_DATASOURCE_URL
        scope: RUN_TIME
        value: ${storez-db.DATABASE_URL}
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
        value: your-secret-here

  - name: frontend
    github:
      repo: votre-username/storez
      branch: main
    source_dir: /frontend
    build_command: npm run build
    envs:
      - key: VITE_API_URL
        scope: BUILD_TIME
        value: ${backend.PUBLIC_URL}/api
```

---

## 🔐 Configuration de Production

### 1. Sécuriser application.yml

**NE JAMAIS** mettre de valeurs par défaut pour les secrets:
```yaml
# ❌ MAUVAIS
jwt:
  secret: ${JWT_SECRET:hardcoded-secret}

# ✅ BON
jwt:
  secret: ${JWT_SECRET}
```

### 2. Configuration HTTPS avec Nginx

```nginx
# /etc/nginx/sites-available/storez
server {
    listen 80;
    server_name storez.com www.storez.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name storez.com www.storez.com;

    ssl_certificate /etc/letsencrypt/live/storez.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/storez.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/storez/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        alias /var/www/storez/backend/uploads;
    }
}
```

### 3. Configuration Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 4. Variables d'Environnement

```bash
# /etc/environment ou ~/.bashrc
export SPRING_DATASOURCE_URL="jdbc:postgresql://db-host:5432/storez"
export SPRING_DATASOURCE_USERNAME="storez"
export SPRING_DATASOURCE_PASSWORD="super_secure_password"
export JWT_SECRET="$(openssl rand -base64 32)"
```

### 5. Systemd Service

```ini
# /etc/systemd/system/storez.service
[Unit]
Description=StoreZ Backend
After=network.target postgresql.service

[Service]
Type=simple
User=storez
WorkingDirectory=/opt/storez/backend
ExecStart=/usr/bin/java -jar /opt/storez/backend/target/storez-backend-1.0.0.jar
EnvironmentFile=/opt/storez/.env
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Activer et démarrer le service
sudo systemctl enable storez
sudo systemctl start storez
sudo systemctl status storez
```

---

## 📊 Monitoring et Logs

### 1. Activer Spring Boot Actuator

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

### 2. Configuration des Logs

```yaml
logging:
  level:
    root: INFO
    com.storez: DEBUG
  file:
    name: /var/log/storez/application.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  logback:
    rollingpolicy:
      max-file-size: 10MB
      max-history: 30
```

### 3. Monitoring avec Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'storez'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

---

## 🔄 CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy StoreZ

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Run tests
        run: cd backend && mvn test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/storez
            git pull
            cd backend
            mvn clean package -DskipTests
            sudo systemctl restart storez
```

---

## 🧪 Tests de Déploiement

Après déploiement, vérifiez:

```bash
# Backend santé
curl https://storez.com/api/categories

# Frontend chargé
curl -I https://storez.com

# Database connectée
curl https://storez.com/actuator/health

# SSL valide
curl -vI https://storez.com 2>&1 | grep "SSL certificate"
```

---

## 🆘 Dépannage

### Backend ne démarre pas
```bash
# Vérifier les logs
tail -f /var/log/storez/application.log

# Vérifier la connexion DB
psql -h localhost -U storez -d storez

# Vérifier le port
netstat -tulpn | grep 8080
```

### Frontend ne charge pas
```bash
# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Rebuild frontend
cd frontend
npm run build
```

### Problèmes de base de données
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Réinitialiser la base (ATTENTION: Perte de données!)
psql -U postgres
DROP DATABASE storez;
CREATE DATABASE storez;
```

---

## 📞 Support

Pour toute question ou problème:
- Documentation: `TEST_REPORT.md`
- Issues: GitHub Issues
- Email: zakaria.sabiri@example.com

---

*Dernière mise à jour: 2026-01-07*
