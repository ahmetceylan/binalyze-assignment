import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add global validationn
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove undefined fields
      transform: true,
      forbidNonWhitelisted: true, // return errır for undefined fiedls
    }),
  );

  // remove excluded fields from responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
