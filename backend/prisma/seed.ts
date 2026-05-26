import { PrismaClient, UserRole, ProductStatus, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding database…');

  // ── Categories ──────────────────────────────────────────────────────────────

  const catMcu = await upsertCat('microcontrollers', 'Микроконтроллеры', 1);
  const catSensors = await upsertCat('sensors', 'Сенсоры и датчики', 2);
  const catPower = await upsertCat('power', 'Питание', 3);
  const catRobotics = await upsertCat('robotics', 'Робототехника', 4);
  const catModules = await upsertCat('modules', 'Модули связи', 5);
  const catDisplays = await upsertCat('displays', 'Дисплеи', 6);
  const catTools = await upsertCat('tools', 'Инструменты и аксессуары', 7);
  const catActuators = await upsertCat('actuators', 'Исполнительные устройства', 8);
  const catLighting = await upsertCat('lighting', 'Освещение и индикация', 9);

  // sub-categories
  await upsertCat('mcu-esp', 'ESP-серия', 1, catMcu.id);
  await upsertCat('mcu-arduino', 'Arduino', 2, catMcu.id);
  await upsertCat('mcu-stm', 'STM32', 3, catMcu.id);
  await upsertCat('mcu-rpi', 'Raspberry Pi', 4, catMcu.id);
  await upsertCat('sensors-env', 'Климат и среда', 1, catSensors.id);
  await upsertCat('sensors-motion', 'Движение и расстояние', 2, catSensors.id);
  await upsertCat('sensors-light', 'Свет и цвет', 3, catSensors.id);
  await upsertCat('power-batteries', 'Аккумуляторы', 1, catPower.id);
  await upsertCat('power-converters', 'Преобразователи', 2, catPower.id);
  await upsertCat('modules-wireless', 'Беспроводные', 1, catModules.id);
  await upsertCat('modules-gps', 'GPS и навигация', 2, catModules.id);
  await upsertCat('displays-oled', 'OLED', 1, catDisplays.id);
  await upsertCat('displays-lcd', 'LCD / TFT', 2, catDisplays.id);

  // ── Brands ──────────────────────────────────────────────────────────────────

  const espressif = await upsertBrand('espressif', 'Espressif', 'CN', 'https://espressif.com');
  const raspberry = await upsertBrand('raspberry-pi', 'Raspberry Pi', 'GB', 'https://raspberrypi.com');
  const arduino = await upsertBrand('arduino', 'Arduino', 'IT', 'https://arduino.cc');
  const dfrobot = await upsertBrand('dfrobot', 'DFRobot', 'CN', 'https://dfrobot.com');
  const stmicro = await upsertBrand('st-microelectronics', 'STMicroelectronics', 'CH', 'https://st.com');
  const adafruit = await upsertBrand('adafruit', 'Adafruit', 'US', 'https://adafruit.com');
  const bosch = await upsertBrand('bosch-sensortec', 'Bosch Sensortec', 'DE', 'https://bosch-sensortec.com');
  const waveshare = await upsertBrand('waveshare', 'Waveshare', 'CN', 'https://waveshare.com');

  // ── Products ─────────────────────────────────────────────────────────────────

  const products: ProductDef[] = [
    // ── Микроконтроллеры ────────────────────────────────────────────────────
    {
      name: 'ESP32-S3 Dev Module',
      slug: 'esp32-s3-dev-module',
      sku: 'ESP32-S3-DEV',
      shortDescription: 'Двухъядерный Xtensa LX7, Wi-Fi + BLE 5, AI-ускоритель, 8 MB PSRAM',
      description: 'Флагманский модуль Espressif с двумя ядрами Xtensa LX7 @ 240 MHz и встроенным AI-ускорителем. Оснащён 8 MB PSRAM и 16 MB Flash. Идеально для задач машинного зрения, обработки аудио и IoT.',
      priceMinor: 129000, oldPriceMinor: 149000, stock: 42,
      categoryId: catMcu.id, brandId: espressif.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Xtensa LX7 dual-core @ 240 MHz' },
        { key: 'ram', label: 'RAM', value: '512 KB + 8 MB PSRAM' },
        { key: 'flash', label: 'Flash', value: '16 MB' },
        { key: 'wifi', label: 'Wi-Fi', value: '802.11 b/g/n' },
        { key: 'ble', label: 'BLE', value: '5.0' },
        { key: 'usb', label: 'USB', value: 'USB OTG Full-Speed' },
      ],
      tags: ['wifi', 'ble', 'ai', 'dual-core', 'psram', 'diy-gps-tracker', 'diy-security', 'diy-weather'],
    },
    {
      name: 'ESP32-C3 Mini',
      slug: 'esp32-c3-mini',
      sku: 'ESP32-C3-MINI',
      shortDescription: 'RISC-V, Wi-Fi + BLE 5, компактный форм-фактор',
      description: 'Компактный модуль на базе RISC-V ESP32-C3. Идеален для встраивания в IoT-устройства с ограниченным пространством.',
      priceMinor: 72000, stock: 95,
      categoryId: catMcu.id, brandId: espressif.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'RISC-V @ 160 MHz' },
        { key: 'ram', label: 'RAM', value: '400 KB' },
        { key: 'flash', label: 'Flash', value: '4 MB' },
        { key: 'wifi', label: 'Wi-Fi', value: '802.11 b/g/n' },
        { key: 'ble', label: 'BLE', value: '5.0' },
      ],
      tags: ['wifi', 'ble', 'risc-v', 'compact', 'diy-badge', 'diy-smart-home'],
    },
    {
      name: 'ESP8266 NodeMCU v3',
      slug: 'esp8266-nodemcu-v3',
      sku: 'ESP8266-NODEMCU-V3',
      shortDescription: 'Популярный Wi-Fi модуль для IoT, встроенный USB-UART',
      description: 'Классический Wi-Fi микроконтроллер для IoT-проектов. Встроенный CH340 USB-UART. Широкое сообщество, огромная библиотека Arduino.',
      priceMinor: 45000, stock: 120,
      categoryId: catMcu.id, brandId: espressif.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Tensilica L106 @ 80/160 MHz' },
        { key: 'ram', label: 'RAM', value: '80 KB' },
        { key: 'flash', label: 'Flash', value: '4 MB' },
        { key: 'wifi', label: 'Wi-Fi', value: '802.11 b/g/n' },
      ],
      tags: ['wifi', 'iot', 'lua', 'arduino', 'diy-irrigation', 'diy-air-quality', 'diy-weather'],
    },
    {
      name: 'Raspberry Pi Pico W',
      slug: 'raspberry-pi-pico-w',
      sku: 'RPI-PICO-W',
      shortDescription: 'RP2040 + Wi-Fi + BLE, MicroPython, 2 MB Flash',
      description: 'Микроконтроллер RP2040 с Wi-Fi 802.11n и BLE 5.2. Поддержка MicroPython и C/C++ SDK. 26 многофункциональных GPIO, два ядра Cortex-M0+.',
      priceMinor: 89000, stock: 65,
      categoryId: catMcu.id, brandId: raspberry.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'RP2040 dual Cortex-M0+ @ 133 MHz' },
        { key: 'ram', label: 'RAM', value: '264 KB SRAM' },
        { key: 'flash', label: 'Flash', value: '2 MB' },
        { key: 'wifi', label: 'Wi-Fi', value: '802.11n (CYW43439)' },
        { key: 'ble', label: 'BLE', value: '5.2' },
        { key: 'gpio', label: 'GPIO', value: '26 pins' },
      ],
      tags: ['wifi', 'ble', 'micropython', 'rp2040', 'diy-pulse-oximeter', 'diy-weather'],
    },
    {
      name: 'Arduino Uno R4 WiFi',
      slug: 'arduino-uno-r4-wifi',
      sku: 'ARD-UNO-R4-WIFI',
      shortDescription: 'Renesas RA4M1 + ESP32-S3 Wi-Fi, LED-матрица 12×8',
      description: 'Современная версия Arduino Uno с мощным процессором Renesas RA4M1 и встроенным Wi-Fi/BLE через ESP32-S3 MINI. Светодиодная матрица 12×8 на борту.',
      priceMinor: 189000, oldPriceMinor: 219000, stock: 28,
      categoryId: catMcu.id, brandId: arduino.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Renesas RA4M1 @ 48 MHz' },
        { key: 'ram', label: 'RAM', value: '32 KB' },
        { key: 'flash', label: 'Flash', value: '256 KB' },
        { key: 'wifi', label: 'Wi-Fi', value: '802.11 b/g/n (ESP32-S3)' },
        { key: 'ble', label: 'BLE', value: '5.0' },
        { key: 'display', label: 'Матрица', value: 'LED 12×8' },
      ],
      tags: ['wifi', 'ble', 'led-matrix', 'renesas', 'diy-robot', 'diy-smart-home'],
    },
    {
      name: 'Arduino Nano Every',
      slug: 'arduino-nano-every',
      sku: 'ARD-NANO-EVERY',
      shortDescription: 'ATMega4809, 5V, 20 МГц, совместим с Nano',
      description: 'Обновлённый Arduino Nano на базе ATMega4809. Пять раз больше Flash и в два раза больше RAM по сравнению с оригинальным Nano. Полная совместимость по распиновке.',
      priceMinor: 82000, stock: 55,
      categoryId: catMcu.id, brandId: arduino.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ATMega4809 @ 20 MHz' },
        { key: 'ram', label: 'RAM', value: '6 KB' },
        { key: 'flash', label: 'Flash', value: '48 KB' },
        { key: 'io', label: 'I/O', value: '14 digital, 8 analog' },
      ],
      tags: ['nano', 'arduino', '5v', 'diy-robot', 'diy-gimbal', 'diy-lora-sensor'],
    },
    {
      name: 'STM32 Blue Pill (STM32F103)',
      slug: 'stm32-blue-pill',
      sku: 'STM32-F103-BP',
      shortDescription: 'STM32F103C8T6, 72 МГц, USB, 64 KB Flash',
      description: 'Популярная отладочная плата на базе STM32F103C8T6 (Cortex-M3). Встроенный USB. Поддерживается STM32CubeIDE, Arduino, PlatformIO и Rust.',
      priceMinor: 68000, oldPriceMinor: 85000, stock: 87,
      categoryId: catMcu.id, brandId: stmicro.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Cortex-M3 @ 72 MHz' },
        { key: 'ram', label: 'RAM', value: '20 KB' },
        { key: 'flash', label: 'Flash', value: '64 KB' },
        { key: 'io', label: 'GPIO', value: '32 pins' },
        { key: 'usb', label: 'USB', value: 'Full-Speed' },
      ],
      tags: ['stm32', 'cortex-m3', 'usb', 'bluepill'],
    },
    {
      name: 'STM32F4 Discovery',
      slug: 'stm32f4-discovery',
      sku: 'STM32-F407-DISC',
      shortDescription: 'STM32F407, 168 МГц, DSP, FPU, отладочная плата',
      description: 'Мощная отладочная плата на STM32F407VGT6. DSP-инструкции, аппаратный FPU, 1 MB Flash, 192 KB RAM. Встроенный ST-LINK/V2 для отладки.',
      priceMinor: 245000, stock: 18,
      categoryId: catMcu.id, brandId: stmicro.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Cortex-M4 @ 168 MHz, FPU' },
        { key: 'ram', label: 'RAM', value: '192 KB' },
        { key: 'flash', label: 'Flash', value: '1 MB' },
        { key: 'debug', label: 'Отладчик', value: 'ST-LINK/V2 (встроен)' },
      ],
      tags: ['stm32', 'cortex-m4', 'dsp', 'fpu', 'discovery'],
    },

    // ── Сенсоры ──────────────────────────────────────────────────────────────
    {
      name: 'DHT22 — Температура и влажность',
      slug: 'dht22-sensor',
      sku: 'SEN-DHT22',
      shortDescription: 'Цифровой датчик T/H, точность ±0.5°C, интерфейс 1-wire',
      description: 'Прецизионный цифровой датчик температуры и влажности с однопроводным интерфейсом. Диапазон −40…+80°C, точность ±0.5°C.',
      priceMinor: 32000, stock: 200,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'range_temp', label: 'Темп. диапазон', value: '-40…+80°C' },
        { key: 'accuracy_temp', label: 'Точность T', value: '±0.5°C' },
        { key: 'range_hum', label: 'Влажность', value: '0…100% RH' },
        { key: 'accuracy_hum', label: 'Точность H', value: '±2% RH' },
        { key: 'interface', label: 'Интерфейс', value: '1-wire' },
      ],
      tags: ['temperature', 'humidity', 'digital', '1-wire', 'diy-weather', 'diy-irrigation', 'diy-smart-home'],
    },
    {
      name: 'BMP280 — Барометр и температура',
      slug: 'bmp280-barometer',
      sku: 'SEN-BMP280',
      shortDescription: 'Барометр I2C/SPI, 300–1100 hPa, ±1 hPa',
      description: 'Барометрический датчик давления и температуры от Bosch Sensortec. I2C и SPI интерфейсы. Применяется в метеостанциях, дронах и носимых устройствах.',
      priceMinor: 28000, stock: 150,
      categoryId: catSensors.id, brandId: bosch.id,
      specs: [
        { key: 'range_pressure', label: 'Давление', value: '300…1100 hPa' },
        { key: 'accuracy_pressure', label: 'Точность P', value: '±1 hPa' },
        { key: 'range_temp', label: 'Темп. диапазон', value: '-40…+85°C' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
        { key: 'size', label: 'Размер', value: '3.4×3.4 мм' },
      ],
      tags: ['pressure', 'barometer', 'i2c', 'spi', 'bosch', 'diy-weather', 'diy-lora-sensor'],
    },
    {
      name: 'BME680 — Газ, давление, влажность, температура',
      slug: 'bme680-env-sensor',
      sku: 'SEN-BME680',
      shortDescription: '4-в-1: VOC, давление, влажность, температура',
      description: 'Многофункциональный датчик окружающей среды Bosch. Измеряет концентрацию летучих органических соединений (VOC), атмосферное давление, влажность и температуру. IAQ (Indoor Air Quality) index.',
      priceMinor: 89000, oldPriceMinor: 110000, stock: 60,
      categoryId: catSensors.id, brandId: bosch.id,
      specs: [
        { key: 'sensors', label: 'Датчики', value: 'VOC, давление, влажность, температура' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
        { key: 'voc_range', label: 'VOC', value: '0…500 ppm' },
        { key: 'pressure', label: 'Давление', value: '300…1100 hPa' },
      ],
      tags: ['voc', 'iaq', 'environment', 'i2c', 'bosch', 'diy-weather', 'diy-air-quality'],
    },
    {
      name: 'MPU-6050 — Акселерометр + Гироскоп',
      slug: 'mpu6050-imu',
      sku: 'SEN-MPU6050',
      shortDescription: '6-осевой IMU, I2C, ±2/4/8/16 g, ±250…2000°/с',
      description: 'Популярный 6-осевой инерциальный датчик. Трёхосевой акселерометр и трёхосевой гироскоп на одном чипе. Встроенный DMP (Digital Motion Processor).',
      priceMinor: 35000, stock: 180,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'axes', label: 'Оси', value: '6 DOF (3 accel + 3 gyro)' },
        { key: 'accel_range', label: 'Акселерометр', value: '±2/4/8/16 g' },
        { key: 'gyro_range', label: 'Гироскоп', value: '±250/500/1000/2000 °/с' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C (до 400 кГц)' },
      ],
      tags: ['imu', 'accelerometer', 'gyroscope', 'i2c', 'dmp', 'diy-gimbal', 'diy-robot'],
    },
    {
      name: 'HC-SR04 — Ультразвуковой дальномер',
      slug: 'hcsr04-ultrasonic',
      sku: 'SEN-HCSR04',
      shortDescription: 'Дальномер 2–400 см, точность ±3 мм, 5V',
      description: 'Ультразвуковой датчик расстояния. Широко используется в роботах, охранных системах и умном доме. Два пина: Trig и Echo.',
      priceMinor: 18000, stock: 350,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'range', label: 'Дальность', value: '2…400 см' },
        { key: 'accuracy', label: 'Точность', value: '±3 мм' },
        { key: 'angle', label: 'Угол', value: '15°' },
        { key: 'voltage', label: 'Питание', value: '5V DC' },
        { key: 'freq', label: 'Частота', value: '40 кГц' },
      ],
      tags: ['ultrasonic', 'distance', 'trig', 'echo', 'diy-robot'],
    },
    {
      name: 'VL53L0X — Лазерный дальномер ToF',
      slug: 'vl53l0x-tof',
      sku: 'SEN-VL53L0X',
      shortDescription: 'ToF лазерный дальномер до 2 м, I2C, ±3%',
      description: 'Лазерный датчик расстояния на технологии Time-of-Flight от STMicro. Точнее ультразвуковых аналогов, не зависит от цвета и отражательной способности поверхности.',
      priceMinor: 52000, stock: 75,
      categoryId: catSensors.id, brandId: stmicro.id,
      specs: [
        { key: 'range', label: 'Дальность', value: '10…2000 мм' },
        { key: 'accuracy', label: 'Точность', value: '±3%' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'voltage', label: 'Питание', value: '2.6…3.5V' },
      ],
      tags: ['tof', 'laser', 'lidar', 'i2c', 'stm'],
    },
    {
      name: 'BH1750 — Датчик освещённости',
      slug: 'bh1750-light',
      sku: 'SEN-BH1750',
      shortDescription: 'Цифровой люксметр, I2C, 1–65535 lx, 16 бит',
      description: 'Цифровой датчик интенсивности света с I2C интерфейсом. Измеряет освещённость в люксах. Применяется в системах умного освещения.',
      priceMinor: 22000, stock: 230,
      categoryId: catSensors.id, brandId: adafruit.id,
      specs: [
        { key: 'range', label: 'Диапазон', value: '1…65535 lx' },
        { key: 'resolution', label: 'Разрядность', value: '16 бит' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'voltage', label: 'Питание', value: '3.3…5V' },
      ],
      tags: ['light', 'lux', 'i2c', 'illuminance'],
    },
    {
      name: 'MQ-135 — Датчик качества воздуха',
      slug: 'mq135-air-quality',
      sku: 'SEN-MQ135',
      shortDescription: 'Аналоговый датчик CO₂, NH₃, бензол, аналог',
      description: 'Электрохимический датчик качества воздуха. Реагирует на CO₂, аммиак, бензол и другие вредные газы. Аналоговый выход, питание 5V.',
      priceMinor: 25000, stock: 140,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'gases', label: 'Газы', value: 'CO₂, NH₃, NOₓ, алкоголь, бензол' },
        { key: 'output', label: 'Выход', value: 'Аналоговый 0…5V' },
        { key: 'voltage', label: 'Питание', value: '5V, 150 мА' },
        { key: 'preheat', label: 'Прогрев', value: '24 ч' },
      ],
      tags: ['gas', 'co2', 'air-quality', 'analog', 'diy-air-quality'],
    },
    {
      name: 'MAX30102 — Пульсоксиметр',
      slug: 'max30102-pulse',
      sku: 'SEN-MAX30102',
      shortDescription: 'Датчик пульса и SpO₂, I2C, для носимых устройств',
      description: 'Интегрированный модуль мониторинга сердечного ритма и насыщения крови кислородом (SpO₂). Инфракрасный и красный LED. I2C интерфейс.',
      priceMinor: 48000, stock: 90,
      categoryId: catSensors.id, brandId: adafruit.id,
      specs: [
        { key: 'measurements', label: 'Измерения', value: 'ЧСС + SpO₂' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'voltage', label: 'Питание', value: '1.8V / 3.3V' },
        { key: 'led', label: 'LED', value: 'IR + Red' },
      ],
      tags: ['pulse', 'spo2', 'health', 'wearable', 'i2c', 'diy-pulse-oximeter'],
    },

    // ── Питание ────────────────────────────────────────────────────────────────
    {
      name: 'Аккумулятор Li-Ion 18650 2600 мАч',
      slug: '18650-battery-2600mah',
      sku: 'PWR-18650-2600',
      shortDescription: 'Li-Ion 3.7V 2600 мАч, защита от перезаряда, 18×65 мм',
      description: 'Высококачественный литий-ионный аккумулятор 18650. Встроенная защита от перезаряда, переразряда и короткого замыкания.',
      priceMinor: 42000, stock: 300,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'capacity', label: 'Ёмкость', value: '2600 мАч' },
        { key: 'voltage', label: 'Напряжение', value: '3.7V (ном.), 4.2V (макс.)' },
        { key: 'discharge', label: 'Разряд', value: '2.5A макс.' },
        { key: 'size', label: 'Размер', value: '18.5×65 мм' },
        { key: 'protection', label: 'Защита', value: 'перезаряд / разряд / КЗ' },
      ],
      tags: ['battery', 'lithium', '18650', 'protection', 'diy-robot', 'diy-security', 'diy-weather', 'diy-lora-sensor', 'diy-irrigation'],
    },
    {
      name: 'LiPo аккумулятор 3.7V 1200 мАч',
      slug: 'lipo-1200mah',
      sku: 'PWR-LIPO-1200',
      shortDescription: 'Li-Po 3.7V 1200 мАч, разъём JST-PH 2мм',
      description: 'Компактный литий-полимерный аккумулятор с разъёмом JST-PH 2.0 мм. Совместим с большинством плат разработчика и Feather-форм-факторов.',
      priceMinor: 55000, stock: 180,
      categoryId: catPower.id, brandId: adafruit.id,
      specs: [
        { key: 'capacity', label: 'Ёмкость', value: '1200 мАч' },
        { key: 'voltage', label: 'Напряжение', value: '3.7V' },
        { key: 'connector', label: 'Разъём', value: 'JST-PH 2.0 мм' },
        { key: 'size', label: 'Размер', value: '50×34×6 мм' },
      ],
      tags: ['lipo', 'jst', 'battery', 'feather', 'diy-pulse-oximeter', 'diy-badge', 'diy-gimbal', 'diy-gps-tracker'],
    },
    {
      name: 'TP4056 — Зарядное устройство Li-Ion',
      slug: 'tp4056-charger',
      sku: 'PWR-TP4056',
      shortDescription: 'Модуль заряда Li-Ion 1A, micro-USB, защита',
      description: 'Модуль зарядки литий-ионных аккумуляторов на чипе TP4056 с защитой DW01. Ток заряда 1А, micro-USB вход, индикаторные светодиоды.',
      priceMinor: 15000, stock: 500,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'charge_current', label: 'Ток заряда', value: '1A' },
        { key: 'input', label: 'Вход', value: 'Micro-USB, 5V' },
        { key: 'protection', label: 'Защита', value: 'DW01 (перезаряд, разряд, КЗ)' },
        { key: 'led', label: 'Индикация', value: 'CHG (красный), STDBY (синий)' },
      ],
      tags: ['charger', 'tp4056', 'lipo', 'micro-usb', 'diy-pulse-oximeter', 'diy-badge', 'diy-gimbal', 'diy-gps-tracker', 'diy-weather', 'diy-security'],
    },
    {
      name: 'MT3608 — Повышающий DC-DC преобразователь',
      slug: 'mt3608-boost',
      sku: 'PWR-MT3608',
      shortDescription: 'Boost 2–24V → 5–28V, 2A, КПД 93%',
      description: 'Модуль повышающего преобразователя на MT3608. Регулируемое выходное напряжение подстроечным резистором. Защита от перегрева.',
      priceMinor: 12000, stock: 400,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'input', label: 'Вход', value: '2…24V' },
        { key: 'output', label: 'Выход', value: '5…28V (регул.)' },
        { key: 'current', label: 'Ток', value: '2A макс.' },
        { key: 'efficiency', label: 'КПД', value: '93%' },
      ],
      tags: ['boost', 'dc-dc', 'converter', 'adjustable'],
    },
    {
      name: 'LM2596 — Понижающий DC-DC преобразователь',
      slug: 'lm2596-buck',
      sku: 'PWR-LM2596',
      shortDescription: 'Buck 4–40V → 1.25–37V, 3A, дисплей напряжения',
      description: 'Модуль понижающего преобразователя на LM2596 с LED-дисплеем вольтметра. Регулировка выходного напряжения потенциометром.',
      priceMinor: 25000, stock: 250,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'input', label: 'Вход', value: '4…40V' },
        { key: 'output', label: 'Выход', value: '1.25…37V (регул.)' },
        { key: 'current', label: 'Ток', value: '3A макс.' },
        { key: 'display', label: 'Дисплей', value: 'LED вольтметр' },
      ],
      tags: ['buck', 'dc-dc', 'converter', 'lm2596'],
    },
    {
      name: 'Солнечная панель 5V 1W',
      slug: 'solar-panel-5v-1w',
      sku: 'PWR-SOLAR-1W',
      shortDescription: 'Монокристаллическая панель 5V 200mA, 110×60 мм',
      description: 'Небольшая монокристаллическая солнечная панель. Подходит для зарядки аккумуляторов через TP4056 или питания IoT-устройств.',
      priceMinor: 38000, stock: 85,
      categoryId: catPower.id, brandId: waveshare.id,
      specs: [
        { key: 'power', label: 'Мощность', value: '1W' },
        { key: 'voltage', label: 'Напряжение', value: '5V' },
        { key: 'current', label: 'Ток', value: '200 мА' },
        { key: 'size', label: 'Размер', value: '110×60 мм' },
      ],
      tags: ['solar', 'renewable', 'outdoor', 'iot', 'diy-weather', 'diy-lora-sensor', 'diy-irrigation'],
    },

    // ── Робототехника ─────────────────────────────────────────────────────────
    {
      name: 'Сервопривод MG996R',
      slug: 'servo-mg996r',
      sku: 'ROB-MG996R',
      shortDescription: 'Металлический серво 11 кг·см, 180°, 4.8–7.2V',
      description: 'Мощный металлический сервопривод MG996R с металлическими шестернями. Крутящий момент 11 кг·см при 6V. Применяется в роботах, шасси и манипуляторах.',
      priceMinor: 75000, stock: 45,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'torque', label: 'Крутящий момент', value: '11 кг·см @ 6V' },
        { key: 'speed', label: 'Скорость', value: '0.2с/60°' },
        { key: 'angle', label: 'Угол', value: '180°' },
        { key: 'voltage', label: 'Питание', value: '4.8…7.2V' },
        { key: 'weight', label: 'Вес', value: '55г' },
      ],
      tags: ['servo', 'robotics', 'motor', 'metal-gear', 'diy-robot', 'diy-gimbal'],
    },
    {
      name: 'Шаговый двигатель NEMA17 с драйвером A4988',
      slug: 'nema17-a4988',
      sku: 'ROB-NEMA17-A4988',
      shortDescription: 'NEMA17 1.8°/шаг + A4988 драйвер, 2A, microstepping',
      description: 'Комплект шагового двигателя NEMA17 и драйвера A4988. Поддержка микрошагов до 1/16. Применяется в 3D-принтерах, ЧПУ, принтерах.',
      priceMinor: 145000, oldPriceMinor: 168000, stock: 35,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'step_angle', label: 'Шаг', value: '1.8° (200 шагов/оборот)' },
        { key: 'current', label: 'Ток', value: '2A' },
        { key: 'torque', label: 'Удержание', value: '0.59 Н·м' },
        { key: 'driver', label: 'Драйвер', value: 'A4988, до 1/16 микрошага' },
      ],
      tags: ['stepper', 'nema17', 'a4988', '3d-printer', 'cnc'],
    },
    {
      name: 'L298N — Драйвер двигателей',
      slug: 'l298n-motor-driver',
      sku: 'ROB-L298N',
      shortDescription: 'Двойной H-мост, 2×2A, 5–35V, PWM управление',
      description: 'Модуль управления двумя коллекторными двигателями постоянного тока. Двойной H-мост L298N. Встроенный стабилизатор 5V для логики.',
      priceMinor: 22000, stock: 190,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'channels', label: 'Каналов', value: '2 (двойной H-мост)' },
        { key: 'current', label: 'Ток', value: '2A/канал (3A пик)' },
        { key: 'voltage', label: 'Питание', value: '5…35V' },
        { key: 'control', label: 'Управление', value: 'PWM + DIR' },
      ],
      tags: ['motor-driver', 'h-bridge', 'l298n', 'pwm', 'diy-robot'],
    },
    {
      name: 'Шасси для Arduino 4WD',
      slug: 'chassis-4wd',
      sku: 'ROB-CHASSIS-4WD',
      shortDescription: 'Пластиковое шасси с 4 моторами, акрил, 4WD',
      description: 'Акриловое шасси для робота с четырьмя моторами постоянного тока. Включает: 2 пластины, 4 мотора, 4 колеса, крепёж. Совместимо с Arduino, Raspberry Pi.',
      priceMinor: 185000, oldPriceMinor: 220000, stock: 20,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'wheels', label: 'Колёс', value: '4' },
        { key: 'motors', label: 'Моторов', value: '4 × DC' },
        { key: 'material', label: 'Материал', value: 'Акрил + металл' },
        { key: 'size', label: 'Размер', value: '250×180×80 мм' },
      ],
      tags: ['chassis', '4wd', 'robot', 'arduino', 'raspberry', 'diy-robot'],
    },
    {
      name: 'SG90 — Микросервопривод',
      slug: 'sg90-micro-servo',
      sku: 'ROB-SG90',
      shortDescription: 'Пластиковый серво 1.8 кг·см, 180°, 5V, 9г',
      description: 'Маленький и лёгкий сервопривод для небольших проектов. Идеален для управления рулём, захватами и шарнирами.',
      priceMinor: 28000, stock: 250,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'torque', label: 'Крутящий момент', value: '1.8 кг·см @ 5V' },
        { key: 'speed', label: 'Скорость', value: '0.1с/60°' },
        { key: 'angle', label: 'Угол', value: '180°' },
        { key: 'weight', label: 'Вес', value: '9г' },
      ],
      tags: ['servo', 'micro', 'sg90', 'lightweight', 'diy-robot', 'diy-gimbal'],
    },

    // ── Модули связи ─────────────────────────────────────────────────────────
    {
      name: 'HC-05 — Bluetooth модуль',
      slug: 'hc05-bluetooth',
      sku: 'MOD-HC05',
      shortDescription: 'Bluetooth 2.0 Serial, Master/Slave, UART, 10–30 м',
      description: 'Классический Bluetooth-модуль для создания беспроводного последовательного соединения. Режимы Master и Slave. AT-команды для настройки.',
      priceMinor: 55000, stock: 100,
      categoryId: catModules.id, brandId: dfrobot.id,
      specs: [
        { key: 'version', label: 'Bluetooth', value: '2.0 + EDR' },
        { key: 'range', label: 'Дальность', value: '10…30 м' },
        { key: 'interface', label: 'Интерфейс', value: 'UART (AT-команды)' },
        { key: 'mode', label: 'Режим', value: 'Master / Slave' },
      ],
      tags: ['bluetooth', 'serial', 'uart', 'wireless'],
    },
    {
      name: 'nRF24L01+ — Радиомодуль 2.4 GHz',
      slug: 'nrf24l01-radio',
      sku: 'MOD-NRF24L01',
      shortDescription: '2.4 GHz трансивер, SPI, до 100 м, 250 кбит/с–2 Мбит/с',
      description: 'Дальнобойный радиомодуль на чипе nRF24L01+. Поддержка 6 независимых каналов данных. Энергоэффективный режим сна. SPI интерфейс.',
      priceMinor: 38000, stock: 160,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'freq', label: 'Частота', value: '2.4 GHz ISM' },
        { key: 'range', label: 'Дальность', value: 'до 100 м (open air)' },
        { key: 'datarate', label: 'Скорость', value: '250 кбит/с, 1/2 Мбит/с' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI' },
        { key: 'channels', label: 'Каналов', value: '6 data pipes' },
      ],
      tags: ['rf', '2.4ghz', 'spi', 'wireless', 'nrf'],
    },
    {
      name: 'SIM800L — GSM/GPRS модуль',
      slug: 'sim800l-gsm',
      sku: 'MOD-SIM800L',
      shortDescription: 'GSM/GPRS quad-band, SMS, звонки, UART, SIM-карта',
      description: 'Компактный GSM/GPRS модуль. Поддержка SMS, голосовых звонков и GPRS интернета. Quad-band (850/900/1800/1900 МГц). AT-команды через UART.',
      priceMinor: 125000, stock: 50,
      categoryId: catModules.id, brandId: dfrobot.id,
      specs: [
        { key: 'bands', label: 'Диапазоны', value: 'GSM 850/900/1800/1900 МГц' },
        { key: 'data', label: 'Данные', value: 'GPRS Class 10, max 85.6 кбит/с' },
        { key: 'interface', label: 'Интерфейс', value: 'UART' },
        { key: 'voltage', label: 'Питание', value: '3.7…4.2V' },
      ],
      tags: ['gsm', 'gprs', 'sms', 'sim800l', 'cellular', 'diy-gps-tracker', 'diy-security'],
    },
    {
      name: 'NEO-6M — GPS модуль',
      slug: 'neo6m-gps',
      sku: 'MOD-NEO6M',
      shortDescription: 'GPS u-blox NEO-6M, UART, антенна, NMEA, 1 Гц',
      description: 'GPS-приёмник на чипе u-blox NEO-6M. Встроенная или внешняя антенна. UART NMEA протокол. Время до первого фикса 27с (холодный старт).',
      priceMinor: 89000, stock: 70,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'chip', label: 'Чип', value: 'u-blox NEO-6M' },
        { key: 'accuracy', label: 'Точность', value: '2.5 м CEP' },
        { key: 'interface', label: 'Интерфейс', value: 'UART 9600 baud' },
        { key: 'cold_start', label: 'Холодный старт', value: '27 с' },
        { key: 'update_rate', label: 'Частота', value: '1 Гц' },
      ],
      tags: ['gps', 'navigation', 'nmea', 'uart', 'ublox', 'diy-gps-tracker'],
    },
    {
      name: 'LoRa32 SX1276 — 433/868/915 МГц',
      slug: 'lora32-sx1276',
      sku: 'MOD-LORA32',
      shortDescription: 'LoRa модуль SX1276, дальность до 10 км, SPI',
      description: 'LoRa радиомодуль на базе SX1276/SX1278. Исключительно дальнобойный — до 10 км в прямой видимости. Для IoT в труднодоступных местах. SPI интерфейс.',
      priceMinor: 185000, stock: 30,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'chip', label: 'Чип', value: 'Semtech SX1276' },
        { key: 'freq', label: 'Частота', value: '433 / 868 / 915 МГц' },
        { key: 'range', label: 'Дальность', value: 'до 10 км (LoS)' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI' },
        { key: 'sensitivity', label: 'Чувствит.', value: '-148 дБм' },
      ],
      tags: ['lora', 'lorawan', 'long-range', 'iot', 'spi', 'diy-lora-sensor'],
    },

    // ── Дисплеи ───────────────────────────────────────────────────────────────
    {
      name: 'OLED дисплей 0.96" 128×64 I2C',
      slug: 'oled-096-128x64',
      sku: 'DIS-OLED-096',
      shortDescription: 'OLED 0.96", 128×64, I2C SSD1306, синий/белый',
      description: 'Миниатюрный OLED-дисплей с драйвером SSD1306. Отличный контраст, видимость на солнце, низкое энергопотребление. Совместим с библиотеками Adafruit и U8g2.',
      priceMinor: 32000, stock: 220,
      categoryId: catDisplays.id, brandId: adafruit.id,
      specs: [
        { key: 'size', label: 'Диагональ', value: '0.96 дюйма' },
        { key: 'resolution', label: 'Разрешение', value: '128×64 пкс' },
        { key: 'driver', label: 'Драйвер', value: 'SSD1306' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C (400 кГц)' },
        { key: 'voltage', label: 'Питание', value: '3.3…5V' },
      ],
      tags: ['oled', 'display', 'ssd1306', 'i2c', '128x64', 'diy-weather', 'diy-pulse-oximeter', 'diy-robot', 'diy-air-quality'],
    },
    {
      name: 'OLED дисплей 1.3" 128×64 I2C',
      slug: 'oled-13-128x64',
      sku: 'DIS-OLED-130',
      shortDescription: 'OLED 1.3", SH1106, I2C, более крупный экран',
      description: 'Увеличенная версия OLED-дисплея на контроллере SH1106. Чуть крупнее 0.96" аналога, подходит для интерфейсов с большим количеством текста.',
      priceMinor: 45000, stock: 130,
      categoryId: catDisplays.id, brandId: waveshare.id,
      specs: [
        { key: 'size', label: 'Диагональ', value: '1.3 дюйма' },
        { key: 'resolution', label: 'Разрешение', value: '128×64 пкс' },
        { key: 'driver', label: 'Драйвер', value: 'SH1106' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
      ],
      tags: ['oled', 'display', 'sh1106', 'i2c', '1.3inch'],
    },
    {
      name: 'TFT LCD 2.4" 320×240 SPI — ILI9341',
      slug: 'tft-24-ili9341',
      sku: 'DIS-TFT-240',
      shortDescription: 'TFT 2.4", 320×240, 16 бит, SPI, сенсор XPT2046',
      description: 'Цветной TFT-дисплей 2.4" с сенсорным экраном (резистивный). Контроллер ILI9341, 16-битный цвет (65536 цветов). Разъём SD-карты на плате.',
      priceMinor: 92000, oldPriceMinor: 115000, stock: 55,
      categoryId: catDisplays.id, brandId: waveshare.id,
      specs: [
        { key: 'size', label: 'Диагональ', value: '2.4 дюйма' },
        { key: 'resolution', label: 'Разрешение', value: '320×240 пкс' },
        { key: 'color', label: 'Цветность', value: '65K цветов (16 бит)' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI' },
        { key: 'touch', label: 'Тач', value: 'Резистивный XPT2046' },
        { key: 'extra', label: 'Доп.', value: 'SD-карта слот' },
      ],
      tags: ['tft', 'lcd', 'color', 'spi', 'touch', 'ili9341'],
    },
    {
      name: 'E-Paper дисплей 2.9" 296×128 — Waveshare',
      slug: 'epaper-29-waveshare',
      sku: 'DIS-EPAPER-29',
      shortDescription: 'E-Ink 2.9" 296×128, SPI, ультра-низкое потребление',
      description: 'Электронно-чернильный дисплей 2.9" с ультранизким энергопотреблением. Изображение сохраняется без питания. Идеально для ценников, датчиков погоды, бейджей.',
      priceMinor: 145000, stock: 35,
      categoryId: catDisplays.id, brandId: waveshare.id,
      specs: [
        { key: 'size', label: 'Диагональ', value: '2.9 дюйма' },
        { key: 'resolution', label: 'Разрешение', value: '296×128 пкс' },
        { key: 'refresh', label: 'Обновление', value: '2 с' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI' },
        { key: 'power', label: 'Потребление', value: '< 0.1 мВт (static)' },
      ],
      tags: ['epaper', 'eink', 'low-power', 'display', 'waveshare', 'diy-badge'],
    },
    {
      name: 'LCD 16×2 I2C — синяя подсветка',
      slug: 'lcd-1602-i2c',
      sku: 'DIS-LCD1602',
      shortDescription: '16×2 символов, I2C адаптер PCF8574, 5V',
      description: 'Классический символьный ЖК-дисплей 16×2 с I2C-адаптером PCF8574. Контраст регулируется потенциометром. Совместим с Arduino LiquidCrystal_I2C.',
      priceMinor: 28000, stock: 280,
      categoryId: catDisplays.id, brandId: dfrobot.id,
      specs: [
        { key: 'chars', label: 'Символов', value: '16×2' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C (PCF8574)' },
        { key: 'backlight', label: 'Подсветка', value: 'Синяя LED' },
        { key: 'voltage', label: 'Питание', value: '5V' },
        { key: 'address', label: 'I2C адрес', value: '0x27 / 0x3F' },
      ],
      tags: ['lcd', '1602', 'i2c', 'character', 'pcf8574'],
    },

    // ── Исполнительные устройства ─────────────────────────────────────────────
    {
      name: 'HC-SR501 — PIR датчик движения',
      slug: 'hcsr501-pir',
      sku: 'SEN-HCSR501',
      shortDescription: 'Пассивный ИК-датчик движения, 3–7м, 5V, регулировка чувствительности',
      description: 'Пассивный инфракрасный датчик движения HC-SR501. Угол обнаружения 120°, дальность 3–7 м. Два потенциометра: чувствительность и задержка срабатывания. Незаменим в охранных системах, умном доме и робототехнике.',
      priceMinor: 19000, stock: 280,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'range', label: 'Дальность', value: '3…7 м (регулир.)' },
        { key: 'angle', label: 'Угол', value: '120°' },
        { key: 'voltage', label: 'Питание', value: '4.5…20V' },
        { key: 'delay', label: 'Задержка', value: '5…200 с (регулир.)' },
        { key: 'output', label: 'Выход', value: 'Цифровой HIGH/LOW' },
      ],
      tags: ['pir', 'motion', 'infrared', 'security', 'diy-security', 'diy-smart-home'],
    },
    {
      name: 'Реле 5V 1-канальное',
      slug: 'relay-5v-1ch',
      sku: 'ACT-RELAY-1CH',
      shortDescription: 'Модуль реле 5V, нагрузка 10A/250VAC, активный LOW',
      description: 'Одноканальный модуль реле с опторазвязкой. Управление логическим LOW (5V Arduino, 3.3V ESP32 через опторазвязку). Контакты выдерживают 10А / 250В переменного тока. Применяется для управления насосами, лампами, вентиляторами.',
      priceMinor: 14000, stock: 380,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'channels', label: 'Каналов', value: '1' },
        { key: 'coil', label: 'Катушка', value: '5V, 70 мА' },
        { key: 'load_ac', label: 'Нагрузка AC', value: '10A / 250V' },
        { key: 'load_dc', label: 'Нагрузка DC', value: '10A / 30V' },
        { key: 'trigger', label: 'Сигнал', value: 'LOW-level (активный)' },
        { key: 'isolation', label: 'Изоляция', value: 'Оптопара PC817' },
      ],
      tags: ['relay', 'actuator', 'smart-home', 'diy-smart-home', 'diy-irrigation', 'switch'],
    },
    {
      name: 'Активный зуммер 5V',
      slug: 'buzzer-active-5v',
      sku: 'ACT-BUZZ-5V',
      shortDescription: 'Активный пьезозуммер 5V, постоянный тон, 85 дБ',
      description: 'Активный пьезоэлектрический зуммер. В отличие от пассивного, генерирует тон самостоятельно при подаче питания — не требует PWM-сигнала. Уровень звука 85 дБ. Применяется в сигнализациях, таймерах, уведомлениях.',
      priceMinor: 8000, stock: 500,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'type', label: 'Тип', value: 'Активный (постоянный тон)' },
        { key: 'voltage', label: 'Питание', value: '3.5…5.5V' },
        { key: 'current', label: 'Ток', value: '< 30 мА' },
        { key: 'spl', label: 'Уровень звука', value: '≥ 85 дБ' },
        { key: 'freq', label: 'Частота', value: '2300 ± 300 Гц' },
      ],
      tags: ['buzzer', 'alarm', 'alert', 'diy-security', 'piezo'],
    },
    {
      name: 'Датчик влажности почвы YL-69',
      slug: 'soil-moisture-yl69',
      sku: 'SEN-YL69',
      shortDescription: 'Ёмкостный датчик почвы, аналог+цифра, 3.3–5V',
      description: 'Датчик влажности почвы с компаратором и потенциометром настройки. Аналоговый выход (0–3.3/5V) и цифровой выход (HIGH/LOW). Пара электродов-щупов из нержавеющей стали. Применяется в системах автополива и умных теплицах.',
      priceMinor: 16000, stock: 320,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'output', label: 'Выход', value: 'Аналоговый + цифровой' },
        { key: 'voltage', label: 'Питание', value: '3.3…5V' },
        { key: 'probes', label: 'Щупы', value: 'Нержавеющая сталь' },
        { key: 'threshold', label: 'Порог', value: 'Регулируется потенц.' },
      ],
      tags: ['soil', 'moisture', 'garden', 'irrigation', 'analog', 'diy-irrigation'],
    },
    {
      name: 'WS2812B светодиодная лента 1м 60 LED/м',
      slug: 'ws2812b-led-strip-1m',
      sku: 'LED-WS2812B-1M',
      shortDescription: 'Адресная RGB лента WS2812B, 60 LED/м, 5V, IP30',
      description: 'Адресная RGB-лента на светодиодах WS2812B — каждый пиксель управляется независимо по однопроводному протоколу. Ширина 10 мм, клейкая основа. Совместима с библиотеками FastLED и NeoPixel для Arduino/ESP32.',
      priceMinor: 89000, oldPriceMinor: 110000, stock: 120,
      categoryId: catLighting.id, brandId: adafruit.id,
      specs: [
        { key: 'density', label: 'Плотность', value: '60 LED/м' },
        { key: 'voltage', label: 'Питание', value: '5V' },
        { key: 'current', label: 'Ток', value: 'до 3.6А/м (все белые)' },
        { key: 'protocol', label: 'Протокол', value: 'WS2812B (1-wire)' },
        { key: 'length', label: 'Длина', value: '1 м (60 пикселей)' },
        { key: 'ip', label: 'Защита', value: 'IP30 (без защиты)' },
      ],
      tags: ['led', 'rgb', 'addressable', 'neopixel', 'ws2812b', 'diy-lighting', 'fastled'],
    },
    {
      name: 'NeoPixel кольцо 12 RGB LED',
      slug: 'neopixel-ring-12',
      sku: 'LED-NEOPIX-12',
      shortDescription: 'Кольцо 12 адресных RGB LED WS2812B, 5V, d=37мм',
      description: 'Круглое кольцо из 12 адресных светодиодов WS2812B диаметром 37 мм. Удобный форм-фактор для создания световых эффектов, индикаторов прогресса, часов.',
      priceMinor: 42000, stock: 150,
      categoryId: catLighting.id, brandId: adafruit.id,
      specs: [
        { key: 'leds', label: 'LED', value: '12 × WS2812B' },
        { key: 'voltage', label: 'Питание', value: '5V' },
        { key: 'diameter', label: 'Диаметр', value: '37 мм' },
        { key: 'protocol', label: 'Протокол', value: 'WS2812B (1-wire)' },
      ],
      tags: ['led', 'neopixel', 'ring', 'rgb', 'ws2812b', 'diy-lighting'],
    },
    {
      name: 'DS3231 — RTC модуль реального времени',
      slug: 'ds3231-rtc',
      sku: 'MOD-DS3231',
      shortDescription: 'Точные часы реального времени, I2C, EEPROM, батарейка CR2032',
      description: 'Высокоточный модуль часов реального времени на DS3231 с компенсацией температуры (±2 ppm). I2C интерфейс. 32 байта EEPROM (AT24C32) на плате. Батарейка CR2032 поддерживает работу при отключении питания.',
      priceMinor: 35000, stock: 160,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'accuracy', label: 'Точность', value: '±2 ppm (0…40°C)' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'backup', label: 'Батарейка', value: 'CR2032 (в комплекте)' },
        { key: 'eeprom', label: 'EEPROM', value: '32 байт (AT24C32)' },
        { key: 'voltage', label: 'Питание', value: '3.3…5.5V' },
      ],
      tags: ['rtc', 'clock', 'time', 'i2c', 'ds3231', 'diy-clock', 'eeprom'],
    },
    {
      name: 'INA219 — Датчик тока и напряжения',
      slug: 'ina219-current-sensor',
      sku: 'SEN-INA219',
      shortDescription: 'Измеритель тока/мощности I2C, ±3.2А, 26V, 12 бит',
      description: 'Прецизионный датчик тока и мощности с I2C интерфейсом. Измеряет ток через шунт-резистор и напряжение шины. 12-битное разрешение. Применяется для мониторинга зарядки аккумуляторов, учёта энергопотребления в IoT.',
      priceMinor: 38000, stock: 110,
      categoryId: catSensors.id, brandId: adafruit.id,
      specs: [
        { key: 'current_range', label: 'Ток', value: '±3.2А' },
        { key: 'voltage_range', label: 'Напряжение', value: 'до 26V' },
        { key: 'resolution', label: 'Разрядность', value: '12 бит' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'addresses', label: 'I2C адресов', value: '4 варианта' },
      ],
      tags: ['current', 'power', 'voltage', 'i2c', 'ina219', 'energy', 'diy-monitoring'],
    },

    // ── Инструменты и аксессуары ─────────────────────────────────────────────
    {
      name: 'Макетная плата 830 точек + провода',
      slug: 'breadboard-830-kit',
      sku: 'TOOL-BB830',
      shortDescription: 'Breadboard 830 точек + 65 проводников-перемычек',
      description: 'Набор для прототипирования: беспаечная макетная плата на 830 точек и 65 гибких перемычек мужской-мужской. Цветная маркировка проводников.',
      priceMinor: 35000, stock: 400,
      categoryId: catTools.id, brandId: adafruit.id,
      specs: [
        { key: 'points', label: 'Точек', value: '830' },
        { key: 'wires', label: 'Провода', value: '65 шт. (M-M)' },
        { key: 'rails', label: 'Шины питания', value: '4 × 25 точек' },
      ],
      tags: ['breadboard', 'prototyping', 'jumper-wires'],
    },
    {
      name: 'Набор резисторов 600 шт. (1/4W, E24)',
      slug: 'resistors-kit-600',
      sku: 'TOOL-RES-KIT',
      shortDescription: '600 резисторов, 30 номиналов по 20 шт., 1/4W, E24',
      description: 'Набор металлоплёночных резисторов. 30 номиналов E24-ряда от 10 Ом до 1 МОм, по 20 штук каждого. Точность ±1%, мощность 1/4W.',
      priceMinor: 28000, stock: 300,
      categoryId: catTools.id, brandId: adafruit.id,
      specs: [
        { key: 'count', label: 'Кол-во', value: '600 шт. (30 × 20)' },
        { key: 'power', label: 'Мощность', value: '0.25 Вт' },
        { key: 'tolerance', label: 'Точность', value: '±1%' },
        { key: 'range', label: 'Диапазон', value: '10 Ом … 1 МОм (E24)' },
      ],
      tags: ['resistors', 'components', 'kit', 'e24'],
    },
    {
      name: 'Набор конденсаторов 500 шт.',
      slug: 'capacitors-kit-500',
      sku: 'TOOL-CAP-KIT',
      shortDescription: '500 конд.: 25 номиналов керамика + электролит',
      description: 'Набор конденсаторов: 250 керамических (100 пФ – 100 нФ) и 250 электролитических (1 мкФ – 1000 мкФ). Всё в сортировочном боксе.',
      priceMinor: 35000, stock: 200,
      categoryId: catTools.id, brandId: adafruit.id,
      specs: [
        { key: 'count', label: 'Кол-во', value: '500 шт.' },
        { key: 'ceramic', label: 'Керамика', value: '250 шт., 100пФ–100нФ' },
        { key: 'electrolytic', label: 'Электролит', value: '250 шт., 1мкФ–1000мкФ' },
      ],
      tags: ['capacitors', 'components', 'kit'],
    },
    {
      name: 'USB-TTL адаптер CH340 (Type-C)',
      slug: 'usb-ttl-ch340',
      sku: 'TOOL-CH340-C',
      shortDescription: 'CH340G, USB Type-C, 3.3V/5V, до 2 Мбод',
      description: 'Переходник USB–UART на чипе CH340G. Переключатель питания 3.3V/5V. Разъём USB Type-C. Незаменим для прошивки ESP8266/ESP32 и отладки.',
      priceMinor: 18000, stock: 350,
      categoryId: catTools.id, brandId: dfrobot.id,
      specs: [
        { key: 'chip', label: 'Чип', value: 'CH340G' },
        { key: 'interface', label: 'USB', value: 'Type-C' },
        { key: 'voltage', label: 'Уровни', value: '3.3V / 5V (переключ.)' },
        { key: 'baud', label: 'Скорость', value: 'до 2 Мбод' },
      ],
      tags: ['usb-uart', 'ch340', 'type-c', 'flash', 'debug'],
    },
    {
      name: 'Паяльная станция ZD-99',
      slug: 'soldering-station-zd99',
      sku: 'TOOL-ZD99',
      shortDescription: '60W цифровая паяльная станция, 150–450°C, LCD',
      description: 'Цифровая паяльная станция с LCD-дисплеем и точным контролем температуры. Керамический нагреватель, антистатическая ручка. В комплекте 5 сменных жал.',
      priceMinor: 285000, oldPriceMinor: 340000, stock: 15,
      categoryId: catTools.id, brandId: dfrobot.id,
      specs: [
        { key: 'power', label: 'Мощность', value: '60 Вт' },
        { key: 'temp', label: 'Температура', value: '150…450°C' },
        { key: 'heater', label: 'Нагреватель', value: 'Керамический' },
        { key: 'display', label: 'Дисплей', value: 'LCD цифровой' },
        { key: 'tips', label: 'Жала', value: '5 в комплекте' },
      ],
      tags: ['soldering', 'tools', 'station', '60w'],
    },
    {
      name: 'Набор проводов-перемычек M-F 40 шт.',
      slug: 'jumper-wires-mf-40',
      sku: 'TOOL-JW-MF40',
      shortDescription: '40 перемычек Male-Female, 20 см, 10 цветов',
      description: 'Набор гибких проводников-перемычек мужской-женский. 40 штук, длина 20 см, 10 цветов по 4 штуки. Удобны для соединения Arduino с датчиками на макетной плате.',
      priceMinor: 12000, stock: 600,
      categoryId: catTools.id, brandId: adafruit.id,
      specs: [
        { key: 'count', label: 'Кол-во', value: '40 шт.' },
        { key: 'length', label: 'Длина', value: '20 см' },
        { key: 'type', label: 'Тип', value: 'Male-Female (папа-мама)' },
        { key: 'colors', label: 'Цветов', value: '10' },
      ],
      tags: ['jumper-wires', 'male-female', 'dupont', 'cables'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { tags: p.tags, shortDescription: p.shortDescription ?? null },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        shortDescription: p.shortDescription ?? null,
        description: p.description,
        priceMinor: p.priceMinor,
        oldPriceMinor: p.oldPriceMinor ?? null,
        stock: p.stock,
        status: ProductStatus.PUBLISHED,
        categoryId: p.categoryId,
        brandId: p.brandId,
        images: [],
        specs: p.specs,
        tags: p.tags,
      },
    });
  }
  console.log(`  ✓ ${products.length} products`);

  // ── Users ────────────────────────────────────────────────────────────────────

  const users = [
    { email: 'admin@techelectro.ru', password: 'admin123', name: 'Admin TechElectro', role: UserRole.ADMIN, phone: '+7 (800) 555-01-01' },
    { email: 'manager@techelectro.ru', password: 'manager123', name: 'Менеджер Склад', role: UserRole.ADMIN, phone: '+7 (800) 555-01-02' },
    { email: 'ivan.petrov@mail.ru', password: 'user123', name: 'Иван Петров', role: UserRole.B2C, phone: '+7 (916) 123-45-67' },
    { email: 'anna.sidorova@yandex.ru', password: 'user123', name: 'Анна Сидорова', role: UserRole.B2C, phone: '+7 (903) 987-65-43' },
    { email: 'dmitri.volkov@gmail.com', password: 'user123', name: 'Дмитрий Волков', role: UserRole.B2C, phone: '+7 (926) 234-56-78' },
    { email: 'order@robofab.ru', password: 'b2b123', name: 'РобоФаб Закупки', role: UserRole.B2B, phone: '+7 (495) 123-00-01' },
    { email: 'purchase@pcbcraft.ru', password: 'b2b123', name: 'PCBCraft Снабжение', role: UserRole.B2B, phone: '+7 (495) 456-00-02' },
    { email: 'elena.kozlova@mail.ru', password: 'user123', name: 'Елена Козлова', role: UserRole.B2C, phone: null },
    { email: 'alexey.sorokin@ya.ru', password: 'user123', name: 'Алексей Сорокин', role: UserRole.B2C, phone: '+7 (977) 555-12-34' },
    { email: 'user@example.com', password: 'user123', name: 'Тест Пользователь', role: UserRole.B2C, phone: null },
  ];

  const createdUsers: Record<string, string> = {};
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, passwordHash: hash, name: u.name, role: u.role, phone: u.phone ?? undefined },
    });
    createdUsers[u.email] = user.id;
  }
  console.log(`  ✓ ${users.length} users`);

  // ── Orders ────────────────────────────────────────────────────────────────────

  const existingOrderCount = await prisma.order.count();
  if (existingOrderCount > 0) {
    console.log(`  ↷ orders already exist (${existingOrderCount}), skipping`);
    console.log('🎉 Seed complete!');
    return;
  }

  // Fetch some products to reference
  const allProducts = await prisma.product.findMany({ take: 80 });
  const bysku = (sku: string) => allProducts.find((p) => p.sku === sku)!;

  type OrderDef = {
    userEmail: string;
    status: OrderStatus;
    daysAgo: number;
    items: { sku: string; qty: number }[];
  };

  const orderDefs: OrderDef[] = [
    // Иван Петров
    {
      userEmail: 'ivan.petrov@mail.ru', status: OrderStatus.DELIVERED, daysAgo: 45,
      items: [{ sku: 'ESP32-S3-DEV', qty: 2 }, { sku: 'SEN-DHT22', qty: 3 }, { sku: 'TOOL-BB830', qty: 1 }],
    },
    {
      userEmail: 'ivan.petrov@mail.ru', status: OrderStatus.SHIPPED, daysAgo: 7,
      items: [{ sku: 'RPI-PICO-W', qty: 1 }, { sku: 'DIS-OLED-096', qty: 2 }],
    },
    {
      userEmail: 'ivan.petrov@mail.ru', status: OrderStatus.PENDING, daysAgo: 1,
      items: [{ sku: 'SEN-BME680', qty: 1 }, { sku: 'MOD-NEO6M', qty: 1 }],
    },
    // Анна Сидорова
    {
      userEmail: 'anna.sidorova@yandex.ru', status: OrderStatus.DELIVERED, daysAgo: 30,
      items: [{ sku: 'ARD-UNO-R4-WIFI', qty: 1 }, { sku: 'SEN-MAX30102', qty: 1 }, { sku: 'DIS-LCD1602', qty: 1 }],
    },
    {
      userEmail: 'anna.sidorova@yandex.ru', status: OrderStatus.PROCESSING, daysAgo: 3,
      items: [{ sku: 'SEN-BH1750', qty: 2 }, { sku: 'MOD-HC05', qty: 1 }, { sku: 'TOOL-JW-MF40', qty: 2 }],
    },
    // Дмитрий Волков
    {
      userEmail: 'dmitri.volkov@gmail.com', status: OrderStatus.DELIVERED, daysAgo: 60,
      items: [{ sku: 'STM32-F103-BP', qty: 5 }, { sku: 'TOOL-CH340-C', qty: 2 }],
    },
    {
      userEmail: 'dmitri.volkov@gmail.com', status: OrderStatus.PAID, daysAgo: 5,
      items: [{ sku: 'STM32-F407-DISC', qty: 1 }, { sku: 'DIS-TFT-240', qty: 1 }],
    },
    // B2B — РобоФаб
    {
      userEmail: 'order@robofab.ru', status: OrderStatus.DELIVERED, daysAgo: 20,
      items: [
        { sku: 'ROB-MG996R', qty: 20 }, { sku: 'ROB-SG90', qty: 30 },
        { sku: 'ROB-L298N', qty: 10 }, { sku: 'ROB-CHASSIS-4WD', qty: 5 },
      ],
    },
    {
      userEmail: 'order@robofab.ru', status: OrderStatus.SHIPPED, daysAgo: 2,
      items: [{ sku: 'ROB-NEMA17-A4988', qty: 15 }, { sku: 'ESP32-S3-DEV', qty: 10 }],
    },
    // B2B — PCBCraft
    {
      userEmail: 'purchase@pcbcraft.ru', status: OrderStatus.DELIVERED, daysAgo: 14,
      items: [
        { sku: 'TOOL-RES-KIT', qty: 10 }, { sku: 'TOOL-CAP-KIT', qty: 10 },
        { sku: 'TOOL-CH340-C', qty: 20 },
      ],
    },
    {
      userEmail: 'purchase@pcbcraft.ru', status: OrderStatus.PROCESSING, daysAgo: 4,
      items: [{ sku: 'SEN-VL53L0X', qty: 25 }, { sku: 'SEN-MPU6050', qty: 25 }],
    },
    // Елена Козлова
    {
      userEmail: 'elena.kozlova@mail.ru', status: OrderStatus.CANCELLED, daysAgo: 10,
      items: [{ sku: 'DIS-EPAPER-29', qty: 1 }, { sku: 'MOD-LORA32', qty: 2 }],
    },
    {
      userEmail: 'elena.kozlova@mail.ru', status: OrderStatus.DELIVERED, daysAgo: 25,
      items: [{ sku: 'PWR-18650-2600', qty: 4 }, { sku: 'PWR-TP4056', qty: 2 }],
    },
    // Алексей Сорокин
    {
      userEmail: 'alexey.sorokin@ya.ru', status: OrderStatus.DELIVERED, daysAgo: 50,
      items: [{ sku: 'ESP8266-NODEMCU-V3', qty: 3 }, { sku: 'SEN-MQ135', qty: 2 }, { sku: 'PWR-MT3608', qty: 3 }],
    },
    {
      userEmail: 'alexey.sorokin@ya.ru', status: OrderStatus.PENDING, daysAgo: 0,
      items: [{ sku: 'MOD-SIM800L', qty: 1 }, { sku: 'PWR-LIPO-1200', qty: 2 }, { sku: 'TOOL-ZD99', qty: 1 }],
    },
  ];

  let orderCount = 0;
  for (const def of orderDefs) {
    const userId = createdUsers[def.userEmail];
    if (!userId) continue;

    const validItems = def.items
      .map((i) => ({ product: bysku(i.sku), qty: i.qty }))
      .filter((i) => i.product != null);

    if (!validItems.length) continue;

    const totalMinor = validItems.reduce((sum, i) => sum + i.product.priceMinor * i.qty, 0);

    await prisma.order.create({
      data: {
        userId,
        status: def.status,
        totalMinor,
        createdAt: daysAgo(def.daysAgo),
        items: {
          create: validItems.map((i) => ({
            productId: i.product.id,
            quantity: i.qty,
            priceMinor: i.product.priceMinor,
          })),
        },
      },
    });
    orderCount++;
  }
  console.log(`  ✓ ${orderCount} orders`);

  console.log('🎉 Seed complete!');
}

// ─── utils ────────────────────────────────────────────────────────────────────

async function upsertCat(slug: string, name: string, order: number, parentId?: string) {
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug, isVisible: true, order, parentId: parentId ?? null },
  });
}

async function upsertBrand(slug: string, name: string, country: string, website: string) {
  return prisma.brand.upsert({
    where: { slug },
    update: {},
    create: { name, slug, country, website },
  });
}

interface ProductDef {
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description: string;
  priceMinor: number;
  oldPriceMinor?: number;
  stock: number;
  categoryId: string;
  brandId: string;
  specs: { key: string; label: string; value: string }[];
  tags: string[];
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
