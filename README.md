# devhub-backend-app
Repositorio de aplicación del backend de DevHub.

## Diseño DDD
El código se organiza por *bounded contexts* dentro de `src/contexts` (por ejemplo, `auth` y `user`). Cada contexto sigue una separación por capas:

- `domain`: núcleo del dominio (entidades, value objects, reglas e interfaces).
- `application`: casos de uso y orquestación del dominio.
- `infra`: adaptadores e implementación de detalles técnicos (persistencia, HTTP, etc.).

Los elementos compartidos entre contextos viven en `src/lib` (por ejemplo, la configuración de base de datos).

## Tecnologías
- **Node.js + TypeScript** como base del runtime y el tipado.
- **NestJS** como framework principal (módulos, controladores, inyección de dependencias).
- **PostgreSQL** como base de datos relacional.
- **TypeORM** para acceso a datos y migraciones.
- **JWT + bcrypt** para autenticación y manejo de credenciales.
- **class-validator / class-transformer** para validación y transformación de DTOs.
- **dotenv** para configuración por variables de entorno.
- **Helmet** para cabeceras de seguridad HTTP.
