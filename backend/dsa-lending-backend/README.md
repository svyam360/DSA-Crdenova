# DSA Lending Backend

## Prerequisites
- Java 17+ (Java 8 will not work with Spring Boot 3)
- Docker Desktop

## Infra
```bash
docker compose up -d
```

## Run app
```bash
# from this folder
mvn spring-boot:run
```

## Health check
- http://localhost:8080/api/v1/health
- http://localhost:8080/actuator/health

## pgAdmin
- http://localhost:5050
- admin@dsa.com / admin123

## Core API (Scaffolded)
- `POST /api/v1/leads`
- `GET /api/v1/leads`
- `GET /api/v1/leads/{id}`
- `PUT /api/v1/leads/{id}`
- `PUT /api/v1/leads/{id}/status`
- `DELETE /api/v1/leads/{id}`

- `POST /api/v1/applications/eligibility`
- `POST /api/v1/applications`
- `GET /api/v1/applications`
- `GET /api/v1/applications/{id}`

- `POST /api/v1/applications/{applicationId}/documents`
- `GET /api/v1/applications/{applicationId}/documents`
- `PUT /api/v1/documents/{documentId}/verify`

- `GET /api/v1/commissions`
- `POST /api/v1/commissions/sync`
- `POST /api/v1/commissions/{id}/pay`
- `POST /api/v1/commissions/batch-payout`
- `GET /api/v1/commissions/batches`
