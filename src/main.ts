import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Enable helmet
   */
  app.use(helmet());

  /**
   * Usar las validaciones que se describen en los dtos para todos los modulos del proyecto 
   * whitelist: true para evitar que se agreguen campos que no se estan esperando
   */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  // Se agrega el prefijo api/
  app.setGlobalPrefix('api');

  /**
   * Enable cors
   */
  app.enableCors();


  // console.log(process.env);

  await app.listen(3000);
}
bootstrap();
