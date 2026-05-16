import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const catMcu = await prisma.category.upsert({
    where: { slug: 'microcontrollers' },
    update: {},
    create: { name: 'Микроконтроллеры', slug: 'microcontrollers', isVisible: true, order: 1 },
  });
  const catSensors = await prisma.category.upsert({
    where: { slug: 'sensors' },
    update: {},
    create: { name: 'Сенсоры', slug: 'sensors', isVisible: true, order: 2 },
  });
  const catPower = await prisma.category.upsert({
    where: { slug: 'power' },
    update: {},
    create: { name: 'Питание', slug: 'power', isVisible: true, order: 3 },
  });
  const catRobotics = await prisma.category.upsert({
    where: { slug: 'robotics' },
    update: {},
    create: { name: 'Робототехника', slug: 'robotics', isVisible: true, order: 4 },
  });

  // Brands
  const espressif = await prisma.brand.upsert({
    where: { slug: 'espressif' },
    update: {},
    create: { name: 'Espressif', slug: 'espressif', country: 'CN', website: 'https://espressif.com' },
  });
  const raspberry = await prisma.brand.upsert({
    where: { slug: 'raspberry-pi' },
    update: {},
    create: { name: 'Raspberry Pi', slug: 'raspberry-pi', country: 'GB', website: 'https://raspberrypi.com' },
  });
  const arduino = await prisma.brand.upsert({
    where: { slug: 'arduino' },
    update: {},
    create: { name: 'Arduino', slug: 'arduino', country: 'IT', website: 'https://arduino.cc' },
  });
  const dfrobot = await prisma.brand.upsert({
    where: { slug: 'dfrobot' },
    update: {},
    create: { name: 'DFRobot', slug: 'dfrobot', country: 'CN', website: 'https://dfrobot.com' },
  });

  // Products
  const products = [
    {
      name: 'ESP32-S3 Dev Module',
      slug: 'esp32-s3-dev-module',
      sku: 'ESP32-S3-DEV',
      description: 'Двухъядерный микроконтроллер Espressif с Wi-Fi и BLE. Поддержка AI-ускорителя.',
      priceMinor: 129000,
      oldPriceMinor: 149000,
      stock: 42,
      status: ProductStatus.PUBLISHED,
      categoryId: catMcu.id,
      brandId: espressif.id,
      images: [],
      specs: { cpu: 'Xtensa LX7 @ 240 MHz', ram: '512 KB + 8 MB PSRAM', wifi: '802.11 b/g/n', ble: '5.0' },
      tags: ['wifi', 'ble', 'ai', 'dual-core'],
    },
    {
      name: 'ESP8266 NodeMCU v3',
      slug: 'esp8266-nodemcu-v3',
      sku: 'ESP8266-NODEMCU-V3',
      description: 'Популярный Wi-Fi микроконтроллер для IoT-проектов. Встроенный USB-UART.',
      priceMinor: 45000,
      stock: 120,
      status: ProductStatus.PUBLISHED,
      categoryId: catMcu.id,
      brandId: espressif.id,
      images: [],
      specs: { cpu: 'Tensilica L106 @ 80 MHz', ram: '80 KB', wifi: '802.11 b/g/n', flash: '4 MB' },
      tags: ['wifi', 'iot', 'lua'],
    },
    {
      name: 'Raspberry Pi Pico W',
      slug: 'raspberry-pi-pico-w',
      sku: 'RPI-PICO-W',
      description: 'Микроконтроллер RP2040 с Wi-Fi и BLE. Поддержка MicroPython и C/C++.',
      priceMinor: 89000,
      stock: 65,
      status: ProductStatus.PUBLISHED,
      categoryId: catMcu.id,
      brandId: raspberry.id,
      images: [],
      specs: { cpu: 'RP2040 @ 133 MHz', ram: '264 KB SRAM', flash: '2 MB', wifi: '802.11n', ble: '5.2' },
      tags: ['wifi', 'ble', 'micropython', 'rp2040'],
    },
    {
      name: 'Arduino Uno R3',
      slug: 'arduino-uno-r3',
      sku: 'ARD-UNO-R3',
      description: 'Классическая плата Arduino на базе ATmega328P. Идеально для обучения.',
      priceMinor: 95000,
      stock: 80,
      status: ProductStatus.PUBLISHED,
      categoryId: catMcu.id,
      brandId: arduino.id,
      images: [],
      specs: { cpu: 'ATmega328P @ 16 MHz', ram: '2 KB', flash: '32 KB', io: '14 digital, 6 analog' },
      tags: ['beginner', 'classic', 'c++'],
    },
    {
      name: 'DHT22 Датчик температуры',
      slug: 'dht22-sensor',
      sku: 'SEN-DHT22',
      description: 'Цифровой датчик температуры и влажности. Точность ±0.5°C.',
      priceMinor: 32000,
      stock: 200,
      status: ProductStatus.PUBLISHED,
      categoryId: catSensors.id,
      brandId: dfrobot.id,
      images: [],
      specs: { range_temp: '-40..+80°C', range_hum: '0..100% RH', accuracy: '±0.5°C / ±2% RH', interface: 'Single-wire' },
      tags: ['temperature', 'humidity', 'digital'],
    },
    {
      name: 'BMP280 Барометр',
      slug: 'bmp280-barometer',
      sku: 'SEN-BMP280',
      description: 'Барометрический датчик давления и температуры. I2C/SPI интерфейс.',
      priceMinor: 28000,
      stock: 150,
      status: ProductStatus.PUBLISHED,
      categoryId: catSensors.id,
      brandId: dfrobot.id,
      images: [],
      specs: { range_pressure: '300..1100 hPa', range_temp: '-40..+85°C', interface: 'I2C / SPI', size: '3.4×3.4 мм' },
      tags: ['pressure', 'barometer', 'i2c', 'spi'],
    },
    {
      name: 'Литий-ионный аккумулятор 18650',
      slug: '18650-battery-2600mah',
      sku: 'PWR-18650-2600',
      description: 'Высококачественный аккумулятор 18650 ёмкостью 2600 мАч. Защита от перезаряда.',
      priceMinor: 42000,
      stock: 300,
      status: ProductStatus.PUBLISHED,
      categoryId: catPower.id,
      brandId: dfrobot.id,
      images: [],
      specs: { capacity: '2600 mAh', voltage: '3.7V', max_charge: '4.2V', size: '18×65 мм' },
      tags: ['battery', 'lithium', '18650'],
    },
    {
      name: 'Сервопривод MG996R',
      slug: 'servo-mg996r',
      sku: 'ROB-MG996R',
      description: 'Мощный металлический сервопривод. Крутящий момент 11 кг·см. Для робототехники.',
      priceMinor: 75000,
      stock: 45,
      status: ProductStatus.PUBLISHED,
      categoryId: catRobotics.id,
      brandId: dfrobot.id,
      images: [],
      specs: { torque: '11 кг·см', speed: '0.2с/60°', voltage: '4.8-7.2V', weight: '55г' },
      tags: ['servo', 'robotics', 'motor'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p as any,
    });
  }

  // Admin user
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@techelectro.ru' },
    update: {},
    create: {
      email: 'admin@techelectro.ru',
      passwordHash: adminPass,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });

  // Test customer
  const userPass = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPass,
      name: 'Тест Пользователь',
      role: UserRole.B2C,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
