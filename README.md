# TechMentor API

**Descripción**:

- **TechMentor** es una API RESTful construida con NestJS y TypeORM pensada para gestionar una plataforma de mentorías: usuarios (administradores, mentoras y aprendices), mentorías (ofertas), y reservaciones. Está preparada para ejecución en desarrollo, pruebas y despliegue en entornos gestionados (por ejemplo Aiven, RDS, Cloud SQL).

**Características principales**:

- Autenticación con JWT y contraseñas hasheadas (bcrypt).
- Control de accesos por roles (admin / mentora / aprendiz).
- Persistencia con TypeORM (MySQL) y migraciones gestionadas con la CLI de TypeORM.
- Documentación OpenAPI (Swagger).
- Tests unitarios con Jest y estructura de pruebas basada en mocks para repositorios/services.

**Roles**:

- **admin**: gestión completa de usuarios, mentorías y reservas.
- **mentora**: puede crear/editar/gestionar sus propias mentorías, ver reservas asociadas a sus mentorías y actualizar estados de reservas.
- **aprendiz**: puede buscar mentorías y crear sus propias reservas.

**Estructura del proyecto (módulos principales)**:

- `src/modules/users` — Registro, CRUD de usuarios.
- `src/modules/auth` — Login, registro, estrategia JWT.
- `src/modules/mentorships` — CRUD de mentorías.
- `src/modules/reservations` — Crear/gestionar reservas.
- `src/entities` — Entidades TypeORM (`User`, `Mentorship`, `Reservation`).
- `src/migrations` — Migraciones TypeORM (versionadas).
- `src/common/guards`, `src/common/decorators` — Guards y decoradores (RolesGuard, Roles decorator).

**Requisitos locales**:

- Node.js >= 18
- npm
- MySQL client si vas a ejecutar comandos SQL locales
- (Opcional) `ts-node` y `tsconfig-paths` para ejecutar migraciones en modo TypeScript

**Variables de entorno** (archivo `.env` en la raíz de `tech-mentor`):

- `DB_HOST` — host de la base de datos (ej: `tech-mentor-db-...aivencloud.com`).
- `DB_PORT` — puerto (ej: `3306`).
- `DB_USERNAME` — usuario DB.
- `DB_PASSWORD` — contraseña DB.
- `DB_NAME` — nombre de la base de datos.
- `DB_SSL` — `true` si la conexión requiere TLS (Aiven suele requerirlo).
- `DB_SSL_CA_PATH` o `DB_SSL_CA_BASE64` — ruta al certificado CA o el contenido en base64 (opcional/para SSL).
- `JWT_SECRET_KEY` — secret para firmar tokens JWT.
- `NODE_ENV` — `development` | `production` (afecta rutas de migraciones).

Ejemplo mínimo `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=techmentor
JWT_SECRET_KEY=changeme
NODE_ENV=development
```

**Instalación y ejecución local**:

1. Instalar dependencias:

```powershell
cd tech-mentor
npm install
```

2. Ejecutar en desarrollo:

```powershell
npm run start:dev
```

3. Compilar para producción:

```powershell
npm run build
npm run start:prod
```

**Migraciones (TypeORM)**:

- Generar migración (TypeScript):

```powershell
npm run migration:generate -- MyMigrationName
```

- Ejecutar migraciones (TypeScript / dev):

```powershell
npm run migration:run:ts
```

- Ejecutar migraciones (build -> prod):

```powershell
npm run build
npm run migration:run
```

- Revertir última migración:

```powershell
npm run migration:revert:ts
# o en prod
npm run migration:revert
```

**Swagger (documentación)**:

- La documentación Swagger se expone en `http://localhost:3000/api/docs` cuando la app está en ejecución.

**Endpoints de ejemplo** (usar `Authorization: Bearer <token>` para rutas protegidas):

- Autenticación:
  - `POST /api/auth/register` — Registrar usuario (body: `name, email, password, role`).
  - `POST /api/auth/login` — Login (body: `email, password`) → devuelve `{ accessToken }`.
  - `GET /api/auth/profile` — Perfil del usuario (JWT required).

- Users (admin):
  - `GET /api/users` — listar usuarios.
  - `POST /api/users` — crear usuario (admin).
  - `GET /api/users/:id` — obtener usuario.
  - `PUT /api/users/:id` — actualizar usuario.
  - `DELETE /api/users/:id` — eliminar usuario.

- Mentorships:
  - `GET /api/mentorships` — listar mentorías (público).
  - `GET /api/mentorships/:id` — ver mentoría.
  - `POST /api/mentorships` — crear (roles: `mentora`, `admin`). Si el creador es `mentora`, se fuerza `mentor_id` al id del usuario autenticado.
  - `PATCH /api/mentorships/:id` — actualizar (roles: `mentora`, `admin`).
  - `DELETE /api/mentorships/:id` — eliminar (roles: `mentora`, `admin`).

- Reservations:
  - `GET /api/reservations` — listar reservas (roles: `admin`, `mentora`, `aprendiz`). Filtrado por rol: admin ve todo, aprendiz solo propias, mentora solo reservas de sus mentorías.
  - `GET /api/reservations/:id` — ver reserva (mismo filtrado de acceso).
  - `POST /api/reservations` — crear reserva (roles: `aprendiz`, `admin`). Aprendiz solo puede crear para sí mismo.
  - `PATCH /api/reservations/:id/status` — actualizar estado (roles: `mentora`, `admin`).
  - `DELETE /api/reservations/:id` — eliminar (admin o propietario aprendiz).

**Ejemplos `curl`**:

- Login:

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'
```

- Listar mentorías públicas:

```bash
curl http://localhost:3000/api/mentorships
```

- Crear mentoría (mentora):

```bash
curl -X POST http://localhost:3000/api/mentorships -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"Mentoría","description":"...","slots":2}'
```

**Pruebas**:

- Unit tests: Jest (`npm test`). Se incluyen `*.spec.ts` para servicios, controladores y guards.
- Tests E2E: `npm run test:e2e` (cuando estén disponibles/activados en el proyecto).
- Cobertura: ejecutar `npm run test:cov` mostrará los porcentajes actuales de cobertura. (No se fijan porcentajes artificiales en este README — ejecuta el comando para obtener los números reales de tu entorno.)

**Buenas prácticas y recomendaciones de despliegue**:

- No usar `synchronize: true` en producción — usar migraciones.
- Guardar secretos (DB credentials, JWT secret) en un secret manager o variables de entorno del entorno de despliegue.
- Ejecutar migraciones antes de arrancar la aplicación en producción.
- Habilitar TLS/SSL para la conexión a la base de datos (Aiven lo solicita). Usa `DB_SSL_CA_PATH` o `DB_SSL_CA_BASE64` para proveer el CA al `DataSource`.

**Notas de interacción y flujo**:

- Flujo típico de reserva:
  1. Un `aprendiz` busca una `mentoría` en `GET /api/mentorships`.
  2. Crea una reserva `POST /api/reservations` con `mentorship_id` y `date`.
  3. El `mentora` puede ver la reserva y cambiar su `status` (confirmada/cancelada) via `PATCH /api/reservations/:id/status`.

**Contribuciones**:

- Si quieres contribuir: abre un issue o PR con cambios pequeños y pruebas que cubran la nueva funcionalidad.

**Contacto**:

- Documento mantenido por el equipo TechMentor. Para dudas rapidás, crea un issue en el repo o contacta al mantenedor responsable.

---

Este README resume la operativa esencial para desarrollar, probar y desplegar la API TechMentor. Si quieres, puedo:

- Añadir badges de CI/coverage.
- Generar un archivo `deploy.sh` o `docker-compose.yml` de ejemplo para producción.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
