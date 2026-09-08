# Universal Dockerfile for Koyeb, Railway, Fly.io, and Cloud Platforms
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
COPY --from=builder /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
