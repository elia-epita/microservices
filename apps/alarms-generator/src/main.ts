import { NestFactory } from '@nestjs/core';
import { AlarmsGeneratorModule } from './alarms-generator.module';

async function bootstrap() {
  const app = await NestFactory.create(AlarmsGeneratorModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
