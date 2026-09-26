# ==========================================
# Multi-stage Dockerfile for Devpilot Backend
# Compatible with Render, Railway, Fly.io, and Docker Compose
# ==========================================

# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /workspace

# Copy maven wrapper and project definition first (for layer caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Fix Windows line endings on mvnw and make executable
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download dependencies (offline dependency cache layer)
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build production jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal, secure runtime stage
FROM eclipse-temurin:17-jre-jammy

# Create non-privileged system user for security
RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /workspace/target/*.jar /app/app.jar
RUN chown -R spring:spring /app

USER spring:spring

# Default Render port is dynamically injected into $PORT
ENV PORT=8080
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar /app/app.jar"]
