import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeeder } from './seed/user.seeder';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongooseExceptionFilter } from './filter/mongoose-exception.filter';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Test Alchemy')
    .setDescription('A light weight testing system')
    .setVersion('1.0')
    .addTag('alchemy')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  const seeder = app.get(UserSeeder);
  await seeder.seedAdmin();
  app.useGlobalFilters(
    new MongooseExceptionFilter(),
    new AllExceptionsFilter()
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
