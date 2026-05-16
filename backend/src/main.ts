import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TechElectro API')
    .setDescription('REST API для интернет-магазина электронных компонентов TechElectro')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('auth', 'Аутентификация и регистрация')
    .addTag('users', 'Профиль пользователя')
    .addTag('products', 'Каталог товаров')
    .addTag('categories', 'Категории')
    .addTag('brands', 'Бренды')
    .addTag('cart', 'Корзина')
    .addTag('orders', 'Заказы')
    .addTag('ai', 'ИИ-ассистент (Gemini + Function Calling)')
    .addTag('files', 'Загрузка файлов в MinIO')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend running on :${process.env.PORT ?? 3001}`);
  console.log(`Swagger UI: http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}
bootstrap();
