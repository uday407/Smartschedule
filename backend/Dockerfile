# Standard Debian-based Multi-Stage Dockerfile for Render
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and src from backend directory context
COPY pom.xml .
COPY src ./src

# Build production jar skipping tests
RUN mvn clean package -DskipTests -B

# Runtime Stage
FROM eclipse-temurin:17-jre
WORKDIR /app
VOLUME /tmp
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS="-Xmx384m -Xms256m"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

