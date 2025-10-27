# Étape 1 : build du projet
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Étape 2 : image finale
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/storez-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
