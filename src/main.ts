import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: enable CORS for local testing
  app.enableCors();

  // Swagger setup at /api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TechMentor API')
    .setDescription('API de TechMentor - documentación Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build(); 

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // Helpful log
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
