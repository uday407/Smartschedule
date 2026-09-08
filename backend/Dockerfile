# Multi-stage lightweight Dockerfile for Render 512MB Memory Limit
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source and build with low memory footprint
COPY src ./src
ENV MAVEN_OPTS="-Xmx256m -XX:+UseSerialGC -Dmaven.compiler.fork=false"
RUN mvn package -DskipTests -B

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS="-Xmx256m -Xms128m"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

