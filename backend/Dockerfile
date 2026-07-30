# ===========================================================================
# Stage 1 – Build
# ===========================================================================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY pom.xml .
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -B -DskipTests

# ===========================================================================
# Stage 2 – Runtime
# ===========================================================================
FROM eclipse-temurin:21-jre

RUN groupadd --gid 1001 spring && \
    useradd --uid 1001 --gid spring --shell /bin/bash --create-home spring

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Render injects PORT; our app reads SERVER_PORT (see application.yml).
# The wrapper script bridges the two so we never hard-code a port.
COPY --chown=spring:spring docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

RUN chown spring:spring app.jar
USER spring

EXPOSE 8080

# JVM flags tuned for containers:
#   UseContainerSupport  – honour cgroup memory / CPU limits
#   MaxRAMPercentage=75  – cap heap at 75 % of the container allocation
#   java.security.egd   – faster SecureRandom (avoids /dev/random stall)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
