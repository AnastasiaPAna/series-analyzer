FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/block5-email-service-1.0.0.jar app.jar

EXPOSE 3020

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
