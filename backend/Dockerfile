# Multi-stage Dockerfile for Render Cloud Deployment
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy root pom and backend source
COPY backend/pom.xml .
COPY backend/src ./src
ENV MAVEN_OPTS="-Xmx384m -XX:+UseSerialGC"
RUN mvn clean package -DskipTests -B

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /app/target/*.jar app.jar
ENV JAVA_OPTS="-Xmx384m -Xms128m"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

