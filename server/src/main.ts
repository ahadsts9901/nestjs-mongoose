import "./mongodb"
import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5002
  app.enableCors()
  await app.listen(PORT);
}
bootstrap();
