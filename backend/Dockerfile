# Ultra-fast single-stage runtime Dockerfile for Render Cloud
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY app.jar app.jar
ENV JAVA_OPTS="-Xmx384m -Xms256m"
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx356m", "-Xms128m", "-jar", "app.jar"]

