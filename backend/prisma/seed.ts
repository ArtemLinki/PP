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

  // ── Categories для компьютерных комплектующих ──────────────────────────
  const catCpu = await upsertCat('cpu', 'Процессоры', 1);
  const catGpu = await upsertCat('gpu', 'Видеокарты', 2);
  const catRam = await upsertCat('ram', 'Оперативная память', 3);
  const catSsd = await upsertCat('ssd', 'Накопители', 4);
  const catMotherboard = await upsertCat('motherboards', 'Материнские платы', 5);
  const catPsu = await upsertCat('psu', 'Блоки питания', 6);
  const catCooler = await upsertCat('cooling', 'Охлаждение', 7);
  const catCase = await upsertCat('cases', 'Корпуса', 8);
  const catPeripherals = await upsertCat('peripherals', 'Периферия', 9);
  const catCables = await upsertCat('cables-connectors', 'Кабели и коннекторы', 10);

  // ── Sub-categories для процессоров ──────────────────────────────────────
  await upsertCat('cpu-intel', 'Intel', 1, catCpu.id);
  await upsertCat('cpu-amd', 'AMD', 2, catCpu.id);
  await upsertCat('cpu-high-end', 'Высокого класса (i9/Ryzen 9)', 3, catCpu.id);
  await upsertCat('cpu-mid-range', 'Среднего класса (i7/Ryzen 7)', 4, catCpu.id);
  await upsertCat('cpu-budget', 'Бюджетные (i5/Ryzen 5)', 5, catCpu.id);

  // ── Sub-categories для видеокарт ────────────────────────────────────────
  await upsertCat('gpu-nvidia', 'NVIDIA', 1, catGpu.id);
  await upsertCat('gpu-amd', 'AMD Radeon', 2, catGpu.id);
  await upsertCat('gpu-rtx-4000', 'RTX 40-серия', 3, catGpu.id);
  await upsertCat('gpu-rx-7000', 'Radeon RX 7000', 4, catGpu.id);
  await upsertCat('gpu-high-end', 'Флагманские (RTX 4090/RX 7900)', 5, catGpu.id);
  await upsertCat('gpu-gaming', 'Для игр 1440p/4K', 6, catGpu.id);

  // ── Sub-categories для оперативной памяти ───────────────────────────────
  await upsertCat('ram-ddr5', 'DDR5', 1, catRam.id);
  await upsertCat('ram-ddr4', 'DDR4', 2, catRam.id);
  await upsertCat('ram-32gb', '32 ГБ', 3, catRam.id);
  await upsertCat('ram-64gb', '64 ГБ и выше', 4, catRam.id);
  await upsertCat('ram-gaming', 'Для игр', 5, catRam.id);
  await upsertCat('ram-professional', 'Для работы', 6, catRam.id);

  // ── Sub-categories для накопителей ──────────────────────────────────────
  await upsertCat('ssd-nvme', 'NVMe M.2', 1, catSsd.id);
  await upsertCat('ssd-sata', 'SATA 2.5"', 2, catSsd.id);
  await upsertCat('ssd-pcie4', 'PCIe 4.0', 3, catSsd.id);
  await upsertCat('ssd-pcie5', 'PCIe 5.0', 4, catSsd.id);
  await upsertCat('ssd-1tb', '1 ТБ', 5, catSsd.id);
  await upsertCat('ssd-2tb', '2-4 ТБ', 6, catSsd.id);
  await upsertCat('hdd-storage', 'HDD архивное хранилище', 7, catSsd.id);

  // ── Sub-categories для материнских плат ──────────────────────────────────
  await upsertCat('mb-intel', 'Intel (LGA1700)', 1, catMotherboard.id);
  await upsertCat('mb-amd', 'AMD (Socket AM5)', 2, catMotherboard.id);
  await upsertCat('mb-z890', 'Z890 чипсет', 3, catMotherboard.id);
  await upsertCat('mb-x870e', 'X870E чипсет', 4, catMotherboard.id);
  await upsertCat('mb-b850', 'B850/B850E чипсет', 5, catMotherboard.id);
  await upsertCat('mb-atx', 'ATX формат', 6, catMotherboard.id);
  await upsertCat('mb-micro-atx', 'Micro-ATX', 7, catMotherboard.id);

  // ── Sub-categories для блоков питания ────────────────────────────────────
  await upsertCat('psu-titanium', '80+ Titanium', 1, catPsu.id);
  await upsertCat('psu-platinum', '80+ Platinum', 2, catPsu.id);
  await upsertCat('psu-gold', '80+ Gold', 3, catPsu.id);
  await upsertCat('psu-bronze', '80+ Bronze', 4, catPsu.id);
  await upsertCat('psu-1000w-plus', '1000W+', 5, catPsu.id);
  await upsertCat('psu-750-850w', '750-850W', 6, catPsu.id);
  await upsertCat('psu-modular', 'Модульные', 7, catPsu.id);

  // ── Sub-categories для охлаждения ───────────────────────────────────────
  await upsertCat('cooler-air', 'Воздушное охлаждение', 1, catCooler.id);
  await upsertCat('cooler-aio', 'Жидкостное AIO', 2, catCooler.id);
  await upsertCat('cooler-premium', 'Премиум класс', 3, catCooler.id);
  await upsertCat('cooler-budget', 'Бюджетные', 4, catCooler.id);
  await upsertCat('cooler-360mm', 'Радиаторы 360мм', 5, catCooler.id);
  await upsertCat('cooler-240mm', 'Радиаторы 240мм', 6, catCooler.id);
  await upsertCat('cooler-noctua', 'Noctua', 7, catCooler.id);

  // ── Sub-categories для корпусов ─────────────────────────────────────────
  await upsertCat('case-atx', 'ATX полноразмерные', 1, catCase.id);
  await upsertCat('case-micro-atx', 'Micro-ATX компактные', 2, catCase.id);
  await upsertCat('case-gaming', 'Игровые с RGB', 3, catCase.id);
  await upsertCat('case-professional', 'Профессиональные', 4, catCase.id);
  await upsertCat('case-silent', 'Для бесшумной работы', 5, catCase.id);
  await upsertCat('case-budget', 'Бюджетные', 6, catCase.id);
  await upsertCat('case-open-design', 'Открытой архитектуры', 7, catCase.id);

  // ── Sub-categories для периферии ────────────────────────────────────────
  await upsertCat('peripherals-mouse', 'Мыши', 1, catPeripherals.id);
  await upsertCat('peripherals-keyboard', 'Клавиатуры', 2, catPeripherals.id);
  await upsertCat('peripherals-monitor', 'Мониторы', 3, catPeripherals.id);
  await upsertCat('peripherals-gaming', 'Игровая периферия', 4, catPeripherals.id);
  await upsertCat('peripherals-professional', 'Профессиональная', 5, catPeripherals.id);
  await upsertCat('mouse-wireless', 'Беспроводные мыши', 6, catPeripherals.id);
  await upsertCat('keyboard-mechanical', 'Механические клавиатуры', 7, catPeripherals.id);
  await upsertCat('monitor-4k', 'Мониторы 4K', 8, catPeripherals.id);
  await upsertCat('monitor-gaming', 'Игровые мониторы', 9, catPeripherals.id);
  await upsertCat('monitor-ultrawide', 'Сверхширокие мониторы', 10, catPeripherals.id);

  // ── Sub-categories для кабелей и коннекторов ────────────────────────────
  await upsertCat('cables-power', 'Силовые кабели', 1, catCables.id);
  await upsertCat('cables-pcie', 'PCIe адаптеры и кабели', 2, catCables.id);
  await upsertCat('cables-usb', 'USB кабели', 3, catCables.id);
  await upsertCat('cables-video', 'Видео кабели', 4, catCables.id);
  await upsertCat('cables-sata', 'SATA кабели', 5, catCables.id);
  await upsertCat('cables-connectors', 'Разъёмы и адаптеры', 6, catCables.id);
  await upsertCat('thermal-paste', 'Термопаста', 7, catCables.id);
  await upsertCat('thermal-pads', 'Термопрокладки', 8, catCables.id); 

  // ── Новые категории для встроенных систем ──────────────────────────────
  const catEmbedded = await upsertCat('embedded-systems', 'Встроенные системы', 11);
  const catIoT = await upsertCat('iot-modules', 'IoT и связь', 12);
  const catActuatorsMotors = await upsertCat('motors-actuators', 'Моторы и исполнители', 13);
  const catExpansion = await upsertCat('expansion-shields', 'Расширители и шилды', 14);
  const catDevelopment = await upsertCat('dev-kits', 'Наборы для разработки', 15);
  const catSingle = await upsertCat('single-board-computer', 'Однопланатные компьютеры', 16);
  const catEdge = await upsertCat('edge-computing', 'Edge Computing', 17);

  // ── Sub-categories для встроенных систем ────────────────────────────────
  await upsertCat('embedded-esp32', 'ESP32 и ESP8266', 1, catEmbedded.id);
  await upsertCat('embedded-stm32', 'STM32 микроконтроллеры', 2, catEmbedded.id);
  await upsertCat('embedded-arm-cortex', 'ARM Cortex процессоры', 3, catEmbedded.id);
  await upsertCat('embedded-teensy', 'Teensy платы', 4, catEmbedded.id);
  await upsertCat('embedded-riscv', 'RISC-V платы', 5, catEmbedded.id);
  await upsertCat('embedded-development-boards', 'Отладочные платы', 6, catEmbedded.id);

  // ── Sub-categories для IoT ──────────────────────────────────────────────
  await upsertCat('iot-wifi', 'WiFi модули', 1, catIoT.id);
  await upsertCat('iot-bluetooth', 'Bluetooth/BLE', 2, catIoT.id);
  await upsertCat('iot-lora', 'LoRa и NB-IoT', 3, catIoT.id);
  await upsertCat('iot-zigbee', 'Zigbee модули', 4, catIoT.id);
  await upsertCat('iot-nfc-rfid', 'NFC / RFID', 5, catIoT.id);
  await upsertCat('iot-gps-gnss', 'GPS / GNSS модули', 6, catIoT.id);

  // ── Sub-categories для моторов и исполнителей ───────────────────────────
  await upsertCat('motors-dc', 'DC моторы', 1, catActuatorsMotors.id);
  await upsertCat('motors-servo', 'Сервомоторы', 2, catActuatorsMotors.id);
  await upsertCat('motors-stepper', 'Шаговые моторы', 3, catActuatorsMotors.id);
  await upsertCat('motors-drivers', 'Драйверы моторов', 4, catActuatorsMotors.id);
  await upsertCat('relays-solenoids', 'Реле и электромагниты', 5, catActuatorsMotors.id);

  // ── Sub-categories для расширений ───────────────────────────────────────
  await upsertCat('shields-arduino', 'Arduino шилды', 1, catExpansion.id);
  await upsertCat('shields-raspberry', 'Raspberry Pi HAT', 2, catExpansion.id);
  await upsertCat('shields-grove', 'Grove модули', 3, catExpansion.id);
  await upsertCat('shields-audio', 'Аудио шилды', 4, catExpansion.id);
  await upsertCat('shields-communication', 'Коммуникационные', 5, catExpansion.id);

  // ── Sub-categories для наборов ──────────────────────────────────────────
  await upsertCat('kits-beginners', 'Для начинающих', 1, catDevelopment.id);
  await upsertCat('kits-robotics', 'Робототехнические наборы', 2, catDevelopment.id);
  await upsertCat('kits-iot', 'IoT наборы', 3, catDevelopment.id);
  await upsertCat('kits-ai-ml', 'AI/ML наборы', 4, catDevelopment.id);
  await upsertCat('kits-complete', 'Полные стартовые наборы', 5, catDevelopment.id);

  // ── Sub-categories для однопланатных ────────────────────────────────────
  await upsertCat('sbc-raspberry', 'Raspberry Pi', 1, catSingle.id);
  await upsertCat('sbc-jetson', 'NVIDIA Jetson', 2, catSingle.id);
  await upsertCat('sbc-orange', 'Orange Pi', 3, catSingle.id);
  await upsertCat('sbc-rock', 'ROCK Pi', 4, catSingle.id);
  await upsertCat('sbc-compact', 'Компактные SBC', 5, catSingle.id);

  // ── Sub-categories для Edge Computing ────────────────────────────────────
  await upsertCat('edge-ai-inference', 'AI вычисления', 1, catEdge.id);
  await upsertCat('edge-industrial', 'Промышленные IoT', 2, catEdge.id);
  await upsertCat('edge-vision', 'Компьютерное зрение', 3, catEdge.id);

  // ── Brands ──────────────────────────────────────────────────────────────────

  const espressif = await upsertBrand('espressif', 'Espressif', 'CN', 'https://espressif.com');
  const raspberry = await upsertBrand('raspberry-pi', 'Raspberry Pi', 'GB', 'https://raspberrypi.com');
  const arduino = await upsertBrand('arduino', 'Arduino', 'IT', 'https://arduino.cc');
  const dfrobot = await upsertBrand('dfrobot', 'DFRobot', 'CN', 'https://dfrobot.com');
  const stmicro = await upsertBrand('st-microelectronics', 'STMicroelectronics', 'CH', 'https://st.com');
  const adafruit = await upsertBrand('adafruit', 'Adafruit', 'US', 'https://adafruit.com');
  const bosch = await upsertBrand('bosch-sensortec', 'Bosch Sensortec', 'DE', 'https://bosch-sensortec.com');
  const waveshare = await upsertBrand('waveshare', 'Waveshare', 'CN', 'https://waveshare.com');

  const sparkfun = await upsertBrand('sparkfun', 'SparkFun', 'US', 'https://sparkfun.com');
  const meanwell = await upsertBrand('meanwell', 'Mean Well', 'TW', 'https://meanwell.com');

  const intel = await upsertBrand('intel', 'Intel', 'US', 'https://intel.com');
  const amd = await upsertBrand('amd', 'AMD', 'US', 'https://amd.com');
  const nvidia = await upsertBrand('nvidia', 'NVIDIA', 'US', 'https://nvidia.com');
  const corsair = await upsertBrand('corsair', 'Corsair', 'US', 'https://corsair.com');
  const kingston = await upsertBrand('kingston', 'Kingston', 'US', 'https://kingston.com');
  const samsung = await upsertBrand('samsung', 'Samsung', 'KR', 'https://samsung.com');
  const western_digital = await upsertBrand('western-digital', 'Western Digital', 'US', 'https://westerndigital.com');
  const seagate = await upsertBrand('seagate', 'Seagate', 'US', 'https://seagate.com');
  const asus = await upsertBrand('asus', 'ASUS', 'TW', 'https://asus.com');
  const gigabyte = await upsertBrand('gigabyte', 'Gigabyte', 'TW', 'https://gigabyte.com');
  const msi = await upsertBrand('msi', 'MSI', 'TW', 'https://msi.com');
  const noctua = await upsertBrand('noctua', 'Noctua', 'AT', 'https://noctua.at');
  const evga = await upsertBrand('evga', 'EVGA', 'US', 'https://evga.com');
  const crucial = await upsertBrand('crucial', 'Crucial', 'US', 'https://crucial.com');
  const gskill = await upsertBrand('gskill', 'G.Skill', 'TW', 'https://gskill.com');
  const logitech = await upsertBrand('logitech', 'Logitech', 'CH', 'https://logitech.com');
  const razer = await upsertBrand('razer', 'Razer', 'SG', 'https://razer.com');
  const benq = await upsertBrand('benq', 'BenQ', 'TW', 'https://benq.com');
  const lg = await upsertBrand('lg', 'LG', 'KR', 'https://lg.com');
  const nzxt = await upsertBrand('nzxt', 'NZXT', 'US', 'https://nzxt.com');
  const thermaltake = await upsertBrand('thermaltake', 'Thermaltake', 'TW', 'https://thermaltake.com');
  const be_quiet = await upsertBrand('be-quiet', 'Be Quiet!', 'DE', 'https://bequiet.com');
  const seasonic = await upsertBrand('seasonic', 'Seasonic', 'TW', 'https://seasonic.com');
  const treelabs = await upsertBrand('treelabs', 'TreeLabs', 'CN', 'https://treelabs.com');
  const gigabye = await upsertBrand('gigabye-tech', 'Gigabyte Tech', 'TW', 'https://gigabyte-tech.com');
  const hyperx = await upsertBrand('hyperx', 'HyperX', 'US', 'https://hyperx.com');
  const lexar = await upsertBrand('lexar', 'Lexar', 'US', 'https://lexar.com');
  const mushkin = await upsertBrand('mushkin', 'Mushkin', 'US', 'https://mushkin.com');
  const patriot = await upsertBrand('patriot', 'Patriot', 'US', 'https://patriot.cc');
  const pny = await upsertBrand('pny', 'PNY', 'US', 'https://pny.com');

  const teensy = await upsertBrand('teensy', 'Teensy', 'US', 'https://www.pjrc.com/teensy/');
  const seeed = await upsertBrand('seeed-studio', 'Seeed Studio', 'CN', 'https://www.seeedstudio.com');
  const pimoroni = await upsertBrand('pimoroni', 'Pimoroni', 'GB', 'https://pimoroni.com');
  const jetson = await upsertBrand('nvidia-jetson', 'NVIDIA Jetson', 'US', 'https://developer.nvidia.com/jetson');
  const tinymicrocontrollers = await upsertBrand('tiny-circuits', 'TinyCircuits', 'US', 'https://tinycircuits.com');
  const sparkfun2 = await upsertBrand('sparkfun-kits', 'SparkFun Kits', 'US', 'https://sparkfun.com');
  const grove = await upsertBrand('grove-sensors', 'Grove Ecosystem', 'CN', 'https://www.seeedstudio.com/grove');
  const bluefruit = await upsertBrand('bluefruit', 'Bluefruit', 'US', 'https://adafruit.com/category/534');
  const pico = await upsertBrand('raspberry-pico', 'Raspberry Pi Pico', 'GB', 'https://raspberrypi.com/products/raspberry-pi-pico/');
  const openmv = await upsertBrand('openmv', 'OpenMV', 'US', 'https://openmv.io');
  const nucleo = await upsertBrand('st-nucleo', 'STM32 Nucleo', 'CH', 'https://www.st.com/en/evaluation-tools/nucleo-boards.html');
  const lora = await upsertBrand('dragino-lora', 'Dragino LoRa', 'CN', 'https://www.dragino.com');
  const m5stack = await upsertBrand('m5stack', 'M5Stack', 'CN', 'https://m5stack.com');
  const lilypad = await upsertBrand('lilypad-arduino', 'LilyPad Arduino', 'US', 'https://arduino.cc/en/guide/lilypad');

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
    // ── Дополнительные Микроконтроллеры (catMcu.id) ──────────────────────────
    {
      name: 'ESP32-CAM модуль с камерой OV2640',
      slug: 'esp32-cam-ov2640',
      sku: 'MCU-ESP32-CAM',
      shortDescription: 'Wi-Fi + Bluetooth плата разработки с камерой 2Мп и слотом MicroSD',
      description: 'Отладочная плата на базе чипа ESP32 со съёмной камерой OV2640. Поддерживает передачу видео по Wi-Fi, распознавание лиц и чтение/запись на TF-карты памяти. Отличное решение для систем видеонаблюдения и умного дома.',
      priceMinor: 95000, oldPriceMinor: 120000, stock: 65,
      categoryId: catMcu.id, brandId: espressif.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Xtensa dual-core @ 160 MHz' },
        { key: 'camera', label: 'Камера', value: 'OV2640 (2 Мегапикселя)' },
        { key: 'psram', label: 'PSRAM', value: '4 MB' },
        { key: 'storage', label: 'Слот карты', value: 'MicroSD до 4 ГБ' },
      ],
      tags: ['wifi', 'bluetooth', 'camera', 'video', 'diy-security'],
    },
    {
      name: 'Teensy 4.1 Высокопроизводительный контроллер',
      slug: 'teensy-41-mcu',
      sku: 'MCU-TEENSY-41',
      shortDescription: 'ARM Cortex-M7 @ 600 MHz, Ethernet-порт, high-speed USB',
      description: 'Монструозная отладочная плата на базе ядра ARM Cortex-M7. Развивает невероятную тактовую частоту в 600 МГц. На борту слот MicroSD, поддержка расширения оперативной памяти и выделенные пины под Ethernet.',
      priceMinor: 485000, stock: 15,
      categoryId: catMcu.id, brandId: sparkfun.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M7 @ 600 MHz' },
        { key: 'ram', label: 'RAM', value: '1024 KB' },
        { key: 'flash', label: 'Flash', value: '8 MB' },
        { key: 'fpu', label: 'Аппаратный FPU', value: '64-bit & 32-bit' },
      ],
      tags: ['arm', 'cortex-m7', 'high-speed', 'teensy', 'dsp'],
    },
    {
      name: 'Digispark ATtiny85 USB плата',
      slug: 'digispark-attiny85',
      sku: 'MCU-DIGISPARK',
      shortDescription: 'Сверхкомпактная плата Arduino со встроенным USB-штекером',
      description: 'Миниатюрный контроллер на базе чипа ATtiny85. Напрямую вставляется в USB-порт компьютера для прошивки. Идеален для простейших автоматизаций, эмуляторов клавиатуры (HID) и компактных поделок.',
      priceMinor: 29000, stock: 410,
      categoryId: catMcu.id, brandId: arduino.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ATtiny85 @ 16.5 MHz' },
        { key: 'flash', label: 'Flash', value: '8 KB' },
        { key: 'pins', label: 'GPIO', value: '6 пинов (2 разделены с USB)' },
        { key: 'interface', label: 'Интерфейсы', value: 'I2C / SPI' },
      ],
      tags: ['attiny', 'usb', 'hid', 'compact', 'arduino', 'diy-badge'],
    },
    {
      name: 'Seeeduino XIAO SAMD21',
      slug: 'seeeduino-xiao-samd21',
      sku: 'MCU-XIAO-SAMD21',
      shortDescription: 'Самый маленький контроллер в семействе Seeduino, USB Type-C',
      description: 'Микроплатформа размером с почтовую марку, несущая на себе мощный 32-битный ARM Cortex-M0+. Имеет современный разъём USB-C, 14 пинов в уникальном исполнении и совместимость с экосистемой Arduino.',
      priceMinor: 82000, stock: 95,
      categoryId: catMcu.id, brandId: dfrobot.id, // В отсутствие seeed.id
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M0+ @ 48 MHz' },
        { key: 'ram', label: 'RAM', value: '32 KB' },
        { key: 'interface', label: 'Питание', value: 'USB Type-C (5V)' },
        { key: 'dac', label: 'ЦАП выход', value: 'True DAC 10-bit' },
      ],
      tags: ['arm', 'cortex-m0', 'type-c', 'mini', 'wearable'],
    },
    {
      name: 'Raspberry Pi Zero 2 W',
      slug: 'raspberry-pi-zero-2-w',
      sku: 'MCU-RPI-ZERO2W',
      shortDescription: 'Четырехъядерный 64-битный мини-компьютер с Wi-Fi и Bluetooth',
      description: 'Полноценный одноплатный компьютер в ультракомпактном форм-факторе. Оснащен процессором от RPi 3, беспроводными интерфейсами и 40-пиновым разъемом GPIO. Запускает полноценный дистрибутив Linux.',
      priceMinor: 299000, oldPriceMinor: 350000, stock: 24,
      categoryId: catMcu.id, brandId: raspberry.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'Broadcom BCM2710A1 4-core 64-bit' },
        { key: 'ram', label: 'RAM', value: '512 MB LPDDR2' },
        { key: 'wifi', label: 'Wi-Fi', value: '2.4 GHz 802.11 b/g/n' },
        { key: 'ble', label: 'Bluetooth', value: 'BLE 4.2' },
      ],
      tags: ['linux', 'raspberry', 'zero', 'quad-core', 'wifi', 'diy-smart-home'],
    },

    // ── Дополнительные Сенсоры и датчики (catSensors.id) ─────────────────────
    {
      name: 'DS18B20 Герметичный датчик температуры',
      slug: 'ds18b20-waterproof',
      sku: 'SEN-DS18B20-WP',
      shortDescription: 'Влагозащищенный термодатчик в гильзе из нержавеющей стали',
      description: 'Цифровой термометр по интерфейсу 1-Wire, помещённый в защитный влагостойкий зонд. Длина кабеля — 1 метр. Превосходно подходит для измерения температуры жидкостей, почвы или уличных систем.',
      priceMinor: 29000, stock: 180,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'range', label: 'Диапазон', value: '-55°C…+125°C' },
        { key: 'accuracy', label: 'Точность', value: '±0.5°C' },
        { key: 'cable', label: 'Длина кабеля', value: '1 метр' },
        { key: 'interface', label: 'Интерфейс', value: '1-Wire' },
      ],
      tags: ['temperature', 'waterproof', '1-wire', 'diy-irrigation', 'diy-weather'],
    },
    {
      name: 'MPU-9250 9-осевой инерциальный модуль',
      slug: 'mpu9250-9dof',
      sku: 'SEN-MPU9250',
      shortDescription: 'Акселерометр + гироскоп + компас (магнитометр), I2C/SPI',
      description: 'Расширенная версия популярного IMU-сенсора. Включает в себя трёхосевой акселерометр, трёхосевой гироскоп и высокоточный трёхосевой магнитометр AK8963. Необходим для автопилотов и трекеров ориентации.',
      priceMinor: 78000, stock: 85,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'dof', label: 'Степени свободы', value: '9 DOF' },
        { key: 'compass', label: 'Магнитометр', value: 'AK8963 трёхосевой' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
      ],
      tags: ['imu', 'accelerometer', 'gyro', 'magnetometer', 'compass', 'diy-gimbal', 'diy-robot'],
    },
    {
      name: 'TCS34725 Датчик цвета и освещенности',
      slug: 'tcs34725-color-sensor',
      sku: 'SEN-TCS34725',
      shortDescription: 'RGB датчик цвета с ИК-фильтром и белым светодиодом подсветки',
      description: 'Высокоточный цифровой датчик цвета, возвращающий точные значения составляющих Red, Green, Blue, а также Clear (общую освещенность). Встроенный ИК-фильтр минимизирует искажения от фонового света.',
      priceMinor: 62000, stock: 92,
      categoryId: catSensors.id, brandId: adafruit.id,
      specs: [
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'led', label: 'Подсветка', value: 'Нейтральный белый LED' },
        { key: 'filter', label: 'ИК отсечение', value: 'Интегрировано в кристалл' },
      ],
      tags: ['color', 'rgb', 'i2c', 'light', 'diy-robot'],
    },
    {
      name: 'CCS811 Датчик газов и экологии',
      slug: 'ccs811-gas-sensor',
      sku: 'SEN-CCS811',
      shortDescription: 'Цифровой металлооксидный датчик TVOC и эквивалента CO2',
      description: 'Умный датчик качества воздуха в помещении. Рассчитывает уровень летучих органических соединений (TVOC) и эквивалент диоксида углерода (eCO2). Имеет встроенный микроконтроллер для калибровки.',
      priceMinor: 115000, oldPriceMinor: 139000, stock: 45,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'eco2_range', label: 'Диапазон eCO2', value: '400…8192 ppm' },
        { key: 'tvoc_range', label: 'Диапазон TVOC', value: '0…1187 ppb' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
      ],
      tags: ['air-quality', 'co2', 'tvoc', 'gas', 'i2c', 'diy-air-quality'],
    },
    {
      name: 'Емкостный датчик влажности почвы v1.2',
      slug: 'capacitive-soil-moisture',
      sku: 'SEN-SOIL-CAP',
      shortDescription: 'Устойчивый к коррозии влагомер почвы с аналоговым выходом',
      description: 'В отличие от резистивных датчиков, данный модуль измеряет емкость почвы, благодаря чему его контакты не подвержены электролитической коррозии. Идеально для долговременных систем автополива.',
      priceMinor: 25000, stock: 240,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'output', label: 'Выходной сигнал', value: 'Аналоговый вольтаж' },
        { key: 'voltage', label: 'Питание', value: '3.3V / 5V DC' },
        { key: 'material', label: 'Покрытие', value: 'Влагозащитная ламинация' },
      ],
      tags: ['soil', 'moisture', 'capacitive', 'analog', 'diy-irrigation'],
    },
    {
      name: 'Аналоговый датчик звука с микрофоном',
      slug: 'sound-microphone-sensor',
      sku: 'SEN-SOUND-MIC',
      shortDescription: 'Датчик шума на базе ОУ LM393 с аналоговым и цифровым выходами',
      description: 'Модуль улавливания звуковых колебаний. Имеет регулировку чувствительности потенциометром. Выдает аналоговую волну звука и логический сигнал (0/1) при превышении заданного порога громкости.',
      priceMinor: 19000, stock: 190,
      categoryId: catSensors.id, brandId: dfrobot.id,
      specs: [
        { key: 'opamp', label: 'Компаратор', value: 'LM393' },
        { key: 'outputs', label: 'Выходы', value: '1 × AO, 1 × DO' },
        { key: 'mic', label: 'Тип микрофона', value: 'Электретный капсюль' },
      ],
      tags: ['sound', 'noise', 'microphone', 'analog', 'digital', 'diy-security'],
    },
    {
      name: 'Pulse Sensor Датчик пульса на палец',
      slug: 'pulse-sensor-heartrate',
      sku: 'SEN-PULSE-HEART',
      shortDescription: 'Оптический фотоплетизмограф для измерения ЧСС',
      description: 'Простой в использовании датчик частоты сердечных сокращений, закрепляемый на пальце или мочке уха. Клипса содержит фотодиод и светодиод зеленого спектра. Аналоговый выход легко считывается любым АЦП.',
      priceMinor: 49000, stock: 78,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'type', label: 'Тип датчика', value: 'Оптический ППГ' },
        { key: 'diameter', label: 'Диаметр диска', value: '16 мм' },
        { key: 'output', label: 'Интерфейс', value: 'Аналоговый сигнал' },
      ],
      tags: ['pulse', 'heartrate', 'biomedical', 'analog', 'diy-pulse-oximeter'],
    },
    {
      name: 'VL53L1X Лазерный дальномер ToF нового поколения',
      slug: 'vl53l1x-long-range-tof',
      sku: 'SEN-VL53L1X',
      shortDescription: 'Лазерный сенсор расстояния FlightSense до 4 метров, I2C',
      description: 'Улучшенная версия дальномера от STMicroelectronics. Дальность измерения возросла до 400 сантиметров. Высокая помехозащищенность, невосприимчивость к фоновому свету благодаря невидимому лазеру 940 нм.',
      priceMinor: 98000, stock: 54,
      categoryId: catSensors.id, brandId: stmicro.id,
      specs: [
        { key: 'range', label: 'Макс. дистанция', value: '400 см' },
        { key: 'laser', label: 'Длина волны', value: '940 нм (VCSEL)' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C (программируемый)' },
      ],
      tags: ['laser', 'tof', 'distance', 'lidar', 'i2c', 'diy-robot'],
    },

    // ── Дополнительное Питание (catPower.id) ─────────────────────────────────
    {
      name: 'Импульсный блок питания Mean Well 5V 10A LRS-50-5',
      slug: 'mean-well-lrs-50-5',
      sku: 'PWR-MW-5V10A',
      shortDescription: 'Промышленный источник питания 50 Вт, перфорированный корпус',
      description: 'Надежный блок питания переменного тока (AC-DC) от мирового лидера Mean Well. Идеален для питания больших массивов адресных светодиодных лент WS2812B, мощных сервоприводов и сложных стендов автоматики.',
      priceMinor: 165000, stock: 45,
      categoryId: catPower.id, brandId: meanwell.id,
      specs: [
        { key: 'vin', label: 'Входное AC', value: '85…264 V' },
        { key: 'vout', label: 'Выходное DC', value: '5 V (подстраиваемое)' },
        { key: 'iout', label: 'Ток нагрузки', value: '10 A' },
        { key: 'efficiency', label: 'Эффективность', value: '83%' },
      ],
      tags: ['power-supply', 'meanwell', '5v', 'high-power', 'industrial'],
    },
    {
      name: 'Двойной батарейный отсек 18650 с проводами',
      slug: 'holder-18650-double',
      sku: 'PWR-18650-HOLDER-X2',
      shortDescription: 'Пластиковый холдер для двух аккумуляторов 18650, последовательный',
      description: 'Прочный пластиковый отсек для жесткой фиксации двух литий-ионных аккумуляторов формата 18650. Выдает суммарное напряжение ~7.4V на выведенные зачищенные провода.',
      priceMinor: 15000, stock: 320,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'slots', label: 'Кол-во слотов', value: '2 батареи' },
        { key: 'connection', label: 'Соединение', value: 'Последовательное' },
        { key: 'material', label: 'Материал корпуса', value: 'ABS пластик' },
      ],
      tags: ['battery-holder', '18650', 'accessory', 'diy-robot'],
    },
    {
      name: 'Плата повербанка 5V 2A на чипе IP5306',
      slug: 'powerbank-module-ip5306',
      sku: 'PWR-IP5306-MOD',
      shortDescription: 'Контроллер заряда-разряда Li-Ion с USB-A и Type-C, LED индикация',
      description: 'Готовый компактный модуль для сборки собственного портативного аккумулятора. Поддерживает одновременную зарядку и отдачу энергии. Снабжен четырьмя светодиодами уровня остатка заряда.',
      priceMinor: 28000, stock: 150,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'out_current', label: 'Выходной ток', value: '2.1 A максимум' },
        { key: 'ports', label: 'Разъёмы', value: 'USB-A (выход), Type-C (вход)' },
        { key: 'protection', label: 'Защиты', value: 'От перегрева, КЗ, перегрузки' },
      ],
      tags: ['charger', 'powerbank', 'module', 'type-c', 'diy-smart-home'],
    },
    {
      name: 'Автоматический Buck-Boost преобразователь XL6009',
      slug: 'xl6009-buck-boost',
      sku: 'PWR-XL6009-BB',
      shortDescription: 'Повышающе-понижающий регулятор напряжения 3-32V в 5-35V',
      description: 'Универсальный инвертирующий модуль. Независимо от того, входное напряжение выше или ниже требуемого, плата стабильно удерживает заданный вольтаж на выходе. Прекрасно для работы от батарей.',
      priceMinor: 34000, stock: 175,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'vin', label: 'Входное напряжение', value: '3.5…32 V' },
        { key: 'vout', label: 'Выходное напряжение', value: '1.25…35 V (регул.)' },
        { key: 'freq', label: 'Частота перекл.', value: '400 kHz' },
      ],
      tags: ['buck-boost', 'converter', 'adjustable', 'power'],
    },
    {
      name: 'ИБП Плата бесперебойного питания для Raspberry Pi',
      slug: 'ups-hat-raspberry-pi',
      sku: 'PWR-UPS-HAT-RPI',
      shortDescription: 'Плата расширения UPS HAT, I2C мониторинг батареи через малинку',
      description: 'Умный модуль резервного питания для одноплатников Raspberry Pi 3/4. Обеспечивает непрерывную работу при отключении сети. Передает данные о токе и проценте заряда по I2C.',
      priceMinor: 249000, oldPriceMinor: 289000, stock: 19,
      categoryId: catPower.id, brandId: waveshare.id,
      specs: [
        { key: 'out_v', label: 'Выходное питание', value: '5 V, до 3 A' },
        { key: 'battery_supp', label: 'Тип АКБ', value: '2 × 18650 Li-Ion' },
        { key: 'chip', label: 'Чип мониторинга', value: 'MAX17043' },
      ],
      tags: ['ups', 'hat', 'raspberry', 'backup-power', 'i2c'],
    },
    {
      name: 'Аккумулятор LiFePO4 32700 6500 мАч',
      slug: 'lifepo4-32700-battery',
      sku: 'PWR-LIFEPO4-32700',
      shortDescription: 'Литий-железо-фосфатный элемент повышенной безопасности, 3.2V',
      description: 'Тяговый элемент питания, обладающий огромным ресурсом циклов (свыше 2000) и стабильностью при экстремальных температурах. Не взрывается при физических повреждениях. Идеален для уличных IoT-станций.',
      priceMinor: 85000, stock: 64,
      categoryId: catPower.id, brandId: dfrobot.id,
      specs: [
        { key: 'capacity', label: 'Ёмкость', value: '6500 мАч' },
        { key: 'voltage', label: 'Напряжение', value: '3.2 V номинал' },
        { key: 'max_disc', label: 'Макс. ток отдачи', value: '30 A (6C)' },
      ],
      tags: ['lifepo4', 'battery', 'heavy-duty', 'outdoor', 'diy-weather'],
    },

    // ── Дополнительная Робототехника (catRobotics.id) ────────────────────────
    {
      name: 'Драйвер шагового двигателя TB6600 промышленый',
      slug: 'tb6600-stepper-driver',
      sku: 'ROB-TB6600',
      shortDescription: 'Профессиональный драйвер ШД до 4A, 9-42V DC, оптоизоляция',
      description: 'Мощный блок управления шаговыми моторами (например, NEMA23/17). Защищен металлическим кожухом-радиатором. Поддерживает деление шага до 1/32 и снабжен гальванической развязкой управляющих сигналов.',
      priceMinor: 110000, oldPriceMinor: 135000, stock: 40,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'current', label: 'Выходной ток', value: '0.5…4.0 A' },
        { key: 'voltage', label: 'Напряжение питания', value: '9…42 V DC' },
        { key: 'microstep', label: 'Микрошаг', value: '1, 1/2, 1/4, 1/8, 1/16, 1/32' },
      ],
      tags: ['stepper', 'driver', 'tb6600', 'cnc', 'industrial'],
    },
    {
      name: 'CNC Shield v3 плата расширения для Arduino',
      slug: 'cnc-shield-v3-arduino',
      sku: 'ROB-CNC-SHIELD',
      shortDescription: 'Плата управления ЧПУ станком / 3D принтером под драйверы A4988',
      description: 'Легендарный шилд расширения для контроллеров Arduino Uno. Позволяет легко развести управление четырьмя шаговыми двигателями, концевыми выключателями, кнопками E-Stop и подачей охлаждения.',
      priceMinor: 29000, stock: 110,
      categoryId: catRobotics.id, brandId: arduino.id,
      specs: [
        { key: 'version', label: 'Версия платы', value: 'v3.00 GRBL совместимая' },
        { key: 'drivers_slots', label: 'Слоты драйверов', value: '4 × под А4988 / DRV8825' },
        { key: 'voltage', label: 'Внешнее питание', value: '12…36 V' },
      ],
      tags: ['cnc', 'shield', 'grbl', 'arduino', '3d-printer'],
    },
    {
      name: 'Колесо Меканума 60 мм (Комплект 4 шт)',
      slug: 'mecanum-wheels-60mm',
      sku: 'ROB-MECANUM-60',
      shortDescription: 'Всенаправленные колеса (Mecanum Wheels) для omni-роботов',
      description: 'Набор из четырех колес (2 левых, 2 правых) со свободными роликами, расположенными под углом 45 градусов. Позволяют роботу двигаться боком, по диагонали и вращаться на месте без изменения направления колес.',
      priceMinor: 175000, stock: 22,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'diameter', label: 'Диаметр колеса', value: '60 мм' },
        { key: 'rollers', label: 'Кол-во роликов', value: '9 шт на колесо' },
        { key: 'hub', label: 'Посадочный вал', value: 'Под шестигранник 4 мм / ТТ мотор' },
      ],
      tags: ['mecanum', 'wheels', 'omni', 'robotics', 'diy-robot'],
    },
    {
      name: 'Роботизированная рука-манипулятор 4 DOF (Акрил)',
      slug: 'robot-arm-4dof-kit',
      sku: 'ROB-ARM-KIT',
      shortDescription: 'Конструктор манипулятора для самостоятельной сборки (без серво)',
      description: 'Набор деталей из прочного черного акрила для создания настольного четырехосевого робота-манипулятора. Разработан под установку распространенных сервоприводов SG90 или MG90S.',
      priceMinor: 119000, oldPriceMinor: 145000, stock: 35,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'dof', label: 'Оси движения', value: '4 Степени свободы' },
        { key: 'material', label: 'Материал деталей', value: 'Листовой акрил 3мм' },
        { key: 'compatibility', label: 'Подходящие серво', value: 'SG90 / MG90S (4 штуки)' },
      ],
      tags: ['robot-arm', 'gripper', 'kit', 'acrylic', 'diy-robot'],
    },
    {
      name: 'Мотор-редуктор TT желтый с энкодером',
      slug: 'tt-motor-with-encoder',
      sku: 'ROB-TT-MOTOR-ENC',
      shortDescription: 'DC мотор 3-6V с редуктором 1:48 и диском обратной связи',
      description: 'Традиционный ходовая машинка для колесных роботов, дополненная оптическим колесом-энкодером и датчиком Холла. Позволяет точно измерять пройденное колесом расстояние и скорость вращения.',
      priceMinor: 48000, stock: 125,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'ratio', label: 'Коэффициент редукции', value: '1:48' },
        { key: 'encoder', label: 'Тип энкодера', value: 'Оптический двухканальный' },
        { key: 'speed', label: 'Обороты (6V)', value: '200 об/мин без нагрузки' },
      ],
      tags: ['motor', 'gearbox', 'encoder', 'feedback', 'diy-robot'],
    },
    {
      name: 'Электромагнитный соленоидный замок 12V',
      slug: 'solenoid-lock-12v',
      sku: 'ROB-SOLENOID-LOCK',
      shortDescription: 'Электронный защелкивающийся замок для шкафчиков и сейфов',
      description: 'Исполнительный механизм. При подаче питания 12В металлический язычок мгновенно втягивается внутрь, отпирая дверь. При снятии напряжения пружина возвращает защелку обратно. Для систем СКУД.',
      priceMinor: 65000, stock: 88,
      categoryId: catRobotics.id, brandId: dfrobot.id,
      specs: [
        { key: 'voltage', label: 'Питание катушки', value: '12 V DC' },
        { key: 'current', label: 'Потребляемый ток', value: '0.6 A' },
        { key: 'stroke', label: 'Ход защелки', value: '10 мм' },
      ],
      tags: ['solenoid', 'lock', 'actuator', 'security', 'diy-security'],
    },

    // ── Дополнительные Модули связи (catModules.id) ──────────────────────────
    {
      name: 'ESP-01S Модуль Wi-Fi (Обновленный)',
      slug: 'esp01s-wifi-module',
      sku: 'MOD-ESP01S',
      shortDescription: 'Ультрабюджетный приемопередатчик Wi-Fi с поддержкой АТ-команд',
      description: 'Микро-модуль на базе чипа ESP8266. Часто используется в качестве беспроводного моста для плат Arduino через сериал-интерфейс (UART), превращая любую плату в элемент Интернета Вещей.',
      priceMinor: 22000, stock: 340,
      categoryId: catModules.id, brandId: espressif.id,
      specs: [
        { key: 'flash', label: 'Объем Flash', value: '1 MB' },
        { key: 'protocol', label: 'Стандарт Wi-Fi', value: '802.11 b/g/n (Wi-Fi Direct)' },
        { key: 'pins', label: 'Интерфейс', value: '2 × GPIO, UART' },
      ],
      tags: ['wifi', 'esp8266', 'serial', 'iot', 'diy-smart-home'],
    },
    {
      name: 'W5500 Ethernet модуль сетевой',
      slug: 'w5500-ethernet-spi',
      sku: 'MOD-W5500-LAN',
      shortDescription: 'Аппаратный TCP/IP стек, разъем RJ45, интерфейс SPI',
      description: 'Сетевой адаптер проводного интернета. В отличие от старых чипов, W5500 аппаратно обрабатывает протоколы TCP, UDP, IPv4, ICMP, ARP. Подключается к любому микроконтроллеру по SPI.',
      priceMinor: 94000, stock: 72,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'speed', label: 'Скорость линка', value: '10/100 Мбит/с' },
        { key: 'buffer', label: 'Внутренний буфер', value: '32 КБ памяти' },
        { key: 'socket', label: 'Разъем подключения', value: 'RJ-45 с трансформатором' },
      ],
      tags: ['ethernet', 'lan', 'spi', 'hardware-tcp', 'industrial'],
    },
    {
      name: 'nRF24L01+ PA + LNA с внешней антенной',
      slug: 'nrf24l01-pa-lna-antenna',
      sku: 'MOD-NRF24-LONG',
      shortDescription: 'Радиомодуль 2.4ГГц со встроенным усилителем, дальность до 1 км',
      description: 'Модификация радиомодуля nRF24L01, оснащенная усилителем мощности (PA) и малошумящим усилителем сигнала (LNA). Комплектуется внешней SMA-антенной, увеличивая радиус стабильной связи до 1000 метров.',
      priceMinor: 69000, stock: 112,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'range', label: 'Предельная дальность', value: 'до 1100 метров' },
        { key: 'antenna', label: 'Тип коннектора', value: 'SMA съемная антенна' },
        { key: 'freq_range', label: 'Частотная сетка', value: '125 каналов связи' },
      ],
      tags: ['radio', '2.4ghz', 'long-range', 'spi', 'wireless'],
    },
    {
      name: 'GPS/ГЛОНАСС Модуль NEO-M8N High Precision',
      slug: 'neo-m8n-gps-glonass',
      sku: 'MOD-NEO-M8N',
      shortDescription: 'Навигационный модуль, одновременный прием GPS, GLONASS, Galileo',
      description: 'Продвинутый спутниковый приемник u-blox 8-го поколения. Обладает великолепной чувствительностью, быстро находит спутники в городской застройке за счет параллельного сканирования разных систем позиционирования.',
      priceMinor: 189000, oldPriceMinor: 230000, stock: 43,
      categoryId: catModules.id, brandId: adafruit.id,
      specs: [
        { key: 'constellations', label: 'Системы', value: 'GPS / GLONASS / BeiDou / Galileo' },
        { key: 'eeprom', label: 'Хранение настроек', value: 'Встроенная флеш-память' },
        { key: 'rate', label: 'Частота обновления', value: 'До 10 Гц' },
      ],
      tags: ['gps', 'glonass', 'navigation', 'telemetry', 'diy-gps-tracker'],
    },
    {
      name: 'SIM900 GSM GPRS Shield для Arduino',
      slug: 'sim900-gsm-shield',
      sku: 'MOD-SIM900-SHIELD',
      shortDescription: 'Полноразмерная плата расширения сотовой связи под Arduino Uno/Mega',
      description: 'Полноценный шилд связи, устанавливаемый бутербродом на контроллер. Включает аудиоразъемы для наушников/микрофона и стандартный держатель SIM. Позволяет автоматике отправлять отчеты по SMS.',
      priceMinor: 142000, stock: 27,
      categoryId: catModules.id, brandId: arduino.id,
      specs: [
        { key: 'chip', label: 'Основной чип', value: 'SIMCom SIM900' },
        { key: 'audio', label: 'Звук', value: '3.5 мм Jack разъемы' },
        { key: 'pins_select', label: 'Управляющие пины', value: 'Выбор перемычками (D7/D8)' },
      ],
      tags: ['gsm', 'shield', 'sms', 'gprs', 'arduino', 'diy-security'],
    },

    // ── Дополнительные Дисплеи (catDisplays.id) ──────────────────────────────
    {
      name: 'Символьный дисплей LCD1602 с модулем I2C',
      slug: 'lcd1602-i2c-display',
      sku: 'DIS-LCD1602-I2C',
      shortDescription: 'Жидкокристаллический экран 2 строки по 16 символов, синяя подсветка',
      description: 'Базовый знакосинтезирующий ЖК-дисплей. Задняя часть оборудована платой-переходником на PCF8574, благодаря чему для вывода текста требуется задействовать всего 2 провода (SDA/SCL) вместо 6.',
      priceMinor: 38000, stock: 290,
      categoryId: catDisplays.id, brandId: dfrobot.id,
      specs: [
        { key: 'format', label: 'Емкость экрана', value: '16 знаков × 2 строки' },
        { key: 'interface', label: 'Адрес по умолчанию', value: 'I2C (0x27 / 0x3F)' },
        { key: 'contrast', label: 'Контрастность', value: 'Регулируется подстроечником' },
      ],
      tags: ['lcd', 'character', 'i2c', '1602', 'diy-weather', 'diy-air-quality'],
    },
    {
      name: 'Знакосинтезирующий дисплей LCD2004 I2C',
      slug: 'lcd2004-i2c-display',
      sku: 'DIS-LCD2004-I2C',
      shortDescription: 'Крупный текстовый экран, 4 строки по 20 символов, I2C',
      description: 'Расширенная версия текстового экрана. Позволяет выводить развернутую телеметрию: показания нескольких датчиков одновременно, пункты конфигурационного меню или статус работы системы.',
      priceMinor: 58000, stock: 140,
      categoryId: catDisplays.id, brandId: dfrobot.id,
      specs: [
        { key: 'format', label: 'Емкость экрана', value: '20 знаков × 4 строки' },
        { key: 'backlight', label: 'Цвет подсветки', value: 'Изумрудно-зеленый' },
        { key: 'interface', label: 'Связь', value: 'I2C (2 провода)' },
      ],
      tags: ['lcd', 'character', '2004', 'i2c', 'diy-weather'],
    },
    {
      name: 'Сенсорная панель Nextion Basic 3.2" HMI',
      slug: 'nextion-basic-32',
      sku: 'DIS-NEXTION-32',
      shortDescription: 'Интеллектуальный ЖК-экран со своим процессором и редактором интерфейсов',
      description: 'Умный дисплей человека-машинного интерфейса (HMI). Графические элементы, кнопки и шрифты верстаются заранее в бесплатной утилите Nextion Editor и загружаются в память дисплея. Общение с MCU идет по UART.',
      priceMinor: 395000, oldPriceMinor: 460000, stock: 14,
      categoryId: catDisplays.id, brandId: waveshare.id,
      specs: [
        { key: 'diagonal', label: 'Диагональ экрана', value: '3.2 дюйма' },
        { key: 'res', label: 'Разрешение', value: '400×240 пикселей' },
        { key: 'mcu', label: 'Собственное ядро', value: 'ARM Cortex-M0 48MHz' },
        { key: 'flash', label: 'Встроенный Flash', value: '4 MB' },
      ],
      tags: ['nextion', 'hmi', 'touch', 'smart-display', 'uart'],
    },
    {
      name: 'Цветной IPS дисплей 1.54" ST7789 SPI',
      slug: 'st7789-ips-154',
      sku: 'DIS-ST7789-IPS',
      shortDescription: 'Яркая квадратная IPS матрица 240×240, широкие углы обзора',
      description: 'Потрясающий миниатюрный цветной экран. Благодаря технологии IPS картинка остается сочной и читаемой под любым углом наклона. Управляется по высокоскоростному аппаратному SPI шине.',
      priceMinor: 65000, stock: 95,
      categoryId: catDisplays.id, brandId: waveshare.id,
      specs: [
        { key: 'resolution', label: 'Разрешение', value: '240×240 точек' },
        { key: 'driver', label: 'Контроллер матрицы', value: 'ST7789' },
        { key: 'colors', label: 'Глубина цвета', value: 'RGB 65K полноцветный' },
      ],
      tags: ['ips', 'st7789', 'spi', 'color', 'mini', 'diy-badge'],
    },
    {
      name: 'Матричный светодиодный модуль MAX7219 4-в-1',
      slug: 'max7219-led-matrix-4in1',
      sku: 'DIS-MAX7219-4X',
      shortDescription: 'Блок из 4 светодиодных матриц 8×8, бегущая строка, SPI',
      description: 'Готовая сборка из 32 ультраярких светодиодных пикселей. Управляется каскадом микросхем MAX7219. Модули можно соединять друг с другом последовательно для построения длинных информационных табло.',
      priceMinor: 52000, stock: 160,
      categoryId: catDisplays.id, brandId: dfrobot.id,
      specs: [
        { key: 'pixels', label: 'Размерность', value: '32×8 светодиодных точек' },
        { key: 'color', label: 'Цвет диодов', value: 'Ярко-красный свечение' },
        { key: 'interface', label: 'Шина', value: 'SPI (3 пина данных)' },
      ],
      tags: ['led-matrix', 'max7219', 'display', 'spi', 'ticker'],
    },

    // ── Инструменты и аксессуары (catTools.id) ───────────────────────────────
    {
      name: 'Умный программируемый паяльник TS101',
      slug: 'ts101-smart-soldering-iron',
      sku: 'TLS-TS101-IRON',
      shortDescription: 'Паяльник с OLED-экраном, регулировкой температуры и питанием Type-C PD',
      description: 'Флагманский портативный паяльник от Miniware. Работает от блоков питания Power Delivery (Type-C) или DC-разъема. Имеет спящий режим, калибровку, мгновенный разогрев за 9 секунд и сменные жала типа TS.',
      priceMinor: 590000, oldPriceMinor: 680000, stock: 18,
      categoryId: catTools.id, brandId: sparkfun.id,
      specs: [
        { key: 'power', label: 'Макс. мощность', value: '65 Вт (DC) / 45 Вт (PD)' },
        { key: 'temp_range', label: 'Нагрев', value: '100°C…400°C' },
        { key: 'display', label: 'Экран', value: 'OLED монохромный' },
      ],
      tags: ['soldering', 'tools', 'type-c', 'premium'],
    },
    {
      name: 'Цифровой мультиметр RM102 с автодиапазоном',
      slug: 'richmeters-rm102-multimeter',
      sku: 'TLS-RM102',
      shortDescription: '6000 отсчетов, True RMS, измерение емкости и температуры',
      description: 'Компактный и точный измерительный прибор, обязательный для каждого электронщика. Автоматически определяет диапазоны измерений. Имеет подсветку дисплея и режим прозвонки цепей со звуковым сигналом.',
      priceMinor: 145000, stock: 55,
      categoryId: catTools.id, brandId: dfrobot.id,
      specs: [
        { key: 'counts', label: 'Разрядность АЦП', value: '6000 отсчетов' },
        { key: 'features', label: 'Измерения', value: 'V/A (AC/DC), R, C, Hz, Temp' },
        { key: 'battery', label: 'Питание', value: '2 × AAA батарейки' },
      ],
      tags: ['multimeter', 'tools', 'measurement', 'tester'],
    },
    {
      name: 'Макетная плата Breadboard на 830 точек',
      slug: 'breadboard-830-points',
      sku: 'TLS-BREADBOARD-830',
      shortDescription: 'Плата беспаечного макетирования схем с шинами питания',
      description: 'Полноразмерная беспаечная макетная плата. Позволяет оперативно собирать, проверять и модифицировать схемы прототипов устройств без использования паяльника. На обратной стороне — двухсторонний скотч.',
      priceMinor: 25000, stock: 500,
      categoryId: catTools.id, brandId: dfrobot.id,
      specs: [
        { key: 'points', label: 'Всего контактов', value: '830 точек' },
        { key: 'rails', label: 'Шины распределения', value: '2 линии питания сверху и снизу' },
        { key: 'pitch', label: 'Шаг сетки', value: '2.54 мм (стандарт)' },
      ],
      tags: ['breadboard', 'prototyping', 'accessory', 'essentials'],
    },
    {
      name: 'Набор соединительных проводов Дюпон (120 штук)',
      slug: 'dupon-jumper-wires-kit',
      sku: 'TLS-DUPON-120',
      shortDescription: 'Гибкие перемычки 20 см трех типов: M-M, F-F, M-F',
      description: 'Комплект шлейфов из медных проводов, разделяемых поштучно. Содержит по 40 штук соединителей каждого типа: Папа-Папа, Мама-Мама, Папа-Мама. Разноцветная изоляция упрощает трассировку на макетке.',
      priceMinor: 18000, stock: 450,
      categoryId: catTools.id, brandId: dfrobot.id,
      specs: [
        { key: 'length', label: 'Длина кабелей', value: '20 сантиметров' },
        { key: 'quantity', label: 'Общее количество', value: '3 шлейфа по 40 жил' },
        { key: 'pitch', label: 'Разъем разъема', value: '2.54 мм однопиновые' },
      ],
      tags: ['jumpers', 'wires', 'dupont', 'accessory'],
    },
    {
      name: 'USB Логический анализатор 24МГц 8 каналов',
      slug: 'usb-logic-analyzer-8ch',
      sku: 'TLS-LOGIC-ANALYZER',
      shortDescription: 'Устройство захвата цифровых сигналов, совместимо с ПО Saleae Logic',
      description: 'Незаменимый прибор для отладки протоколов передачи данных (I2C, SPI, UART, 1-Wire). Позволяет "увидеть" глазами, какие байты бегут по проводам и обнаружить программные ошибки в коде контроллеров.',
      priceMinor: 99000, oldPriceMinor: 125000, stock: 32,
      categoryId: catTools.id, brandId: stmicro.id,
      specs: [
        { key: 'channels', label: 'Каналы ввода', value: '8 независимых линий' },
        { key: 'sample_rate', label: 'Частота дискрет.', value: 'До 24 МГц' },
        { key: 'interface', label: 'Связь с ПК', value: 'Mini-USB' },
      ],
      tags: ['logic-analyzer', 'debugging', 'tools', 'spi', 'i2c', 'uart'],
    },

    // ── Инструменты: Исполнительные устройства (catActuators.id) ────────────
    {
      name: 'Модуль реле 4-канальный с опторазвязкой 5V',
      slug: 'relay-module-4ch-5v',
      sku: 'ACT-RELAY-4CH',
      shortDescription: 'Плата силовых электромагнитных реле коммутации нагрузок до 250V 10A',
      description: 'Четырехканальный модуль для управления бытовыми приборами высокого напряжения (лампы, насосы, обогреватели). Оптическая изоляция на оптопарах PC817 защищает микроконтроллер от сетевых наводок.',
      priceMinor: 58000, stock: 165,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'channels', label: 'Кол-во каналов', value: '4 изолированных реле' },
        { key: 'load_ac', label: 'Переменный ток', value: 'До 10A @ 250VAC' },
        { key: 'trigger', label: 'Управляющий сигнал', value: 'Низкий уровень (Low Level)' },
      ],
      tags: ['relay', 'actuator', 'high-voltage', 'opto-isolated', 'diy-smart-home'],
    },
    {
      name: 'Пьезоизлучатель бузер активный 5V',
      slug: 'active-piezo-buzzer-5v',
      sku: 'ACT-BUZZER-ACTIVE',
      shortDescription: 'Активный звуковой излучатель (пищалка), встроенный генератор',
      description: 'Простейший звуковой индикатор. В отличие от пассивных бузеров, активный имеет внутренний генератор частоты. Для подачи сигнала достаточно подать на него постоянное напряжение 5 вольт.',
      priceMinor: 12000, stock: 600,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'type', label: 'Тип излучателя', value: 'Активный со встроенным генератором' },
        { key: 'sound_p', label: 'Громкость звука', value: '85 дБ на расстоянии 10 см' },
        { key: 'freq', label: 'Резонансная частота', value: '2300 ± 300 Гц' },
      ],
      tags: ['buzzer', 'sound', 'beeper', 'indicator'],
    },
    {
      name: 'Удерживающий электромагнит 5 кг (P25/20)',
      slug: 'electromagnet-5kg-p25',
      sku: 'ACT-ELECTROMAGNET-5KG',
      shortDescription: 'Силовой постоянный магнит управляемый напряжением 12V',
      description: 'Электромагнит со сквозным монтажным отверстием. При пропускании тока создает мощное магнитное поле, способное удерживать металлические объекты весом до 5 кг. Без питания сила притяжения исчезает.',
      priceMinor: 89000, stock: 48,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'force', label: 'Сила удержания', value: '50 Н (~5 кг)' },
        { key: 'voltage', label: 'Напряжение', value: '12 V DC' },
        { key: 'power', label: 'Потребление', value: '4 Вт' },
      ],
      tags: ['electromagnet', 'magnet', 'actuator', 'robotics', 'diy-robot'],
    },
    {
      name: 'Термоэлектрический элемент Пельтье TEC1-12706',
      slug: 'peltier-element-tec1-12706',
      sku: 'ACT-PELTIER-12706',
      shortDescription: 'Модуль охлаждения и генерации тепла, 12V 6A, 40×40 мм',
      description: 'Полупроводниковый элемент, создающий значительный перепад температур на противоположных гранях при протекании тока. Применяется в портативных автомобильных холодильниках или для охлаждения мощных лазеров.',
      priceMinor: 95000, oldPriceMinor: 110000, stock: 89,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'dimensions', label: 'Габариты плиты', value: '40 × 40 × 3.8 мм' },
        { key: 'power_max', label: 'Мощность охлажд.', value: 'До 60 Вт' },
        { key: 'delta_t', label: 'Макс. разность T', value: 'dT макс = 66°C' },
      ],
      tags: ['peltier', 'cooling', 'heating', 'thermal'],
    },
    {
      name: 'Миниатюрный вибромотор-таблетка 3V',
      slug: 'vibration-motor-coin',
      sku: 'ACT-VIBRO-COIN',
      shortDescription: 'Плоский вибрационный мотор для тактильной отдачи (Haptic Feedback)',
      description: 'Ультратонкий виброгенератор эксцентрикового типа. Наклеивается на корпус устройства за счет липкого слоя. Создает отчетливую вибрацию при подаче логической единицы. Для носимой электроники.',
      priceMinor: 15000, stock: 310,
      categoryId: catActuators.id, brandId: dfrobot.id,
      specs: [
        { key: 'diameter', label: 'Диаметр диска', value: '10 мм' },
        { key: 'voltage', label: 'Рабочий вольтаж', value: '2.5…4.0 V DC' },
        { key: 'current', label: 'Ток при старте', value: '90 мА максимум' },
      ],
      tags: ['vibration', 'motor', 'haptic', 'wearable', 'diy-badge'],
    },

    // ── Дополнительное Освещение и индикация (catLighting.id) ───────────────
    {
      name: 'Адресная светодиодная лента WS2812B (1 метр, 60 LED)',
      slug: 'ws2812b-led-strip-60',
      sku: 'LGT-WS2812B-1M',
      shortDescription: 'Умная RGB лента, индивидуальное управление каждым пикселем, IP30',
      description: 'Популярнейшая светодиодная лента со встроенными в каждый диод контроллерами WS2812B. Позволяет задавать любой из 16 миллионов цветов для каждой точки отдельно по одному общему сигнальному проводу.',
      priceMinor: 125000, oldPriceMinor: 150000, stock: 140,
      categoryId: catLighting.id, brandId: adafruit.id, // В отсутствие специфического бренда для лент
      specs: [
        { key: 'density', label: 'Плотность диодов', value: '60 светодиодов на метр' },
        { key: 'voltage', label: 'Напряжение питания', value: '5 V DC (строго!)' },
        { key: 'prot', label: 'Степень защиты', value: 'IP30 (интерьерная без силикона)' },
      ],
      tags: ['led-strip', 'ws2812b', 'rgb', 'addressable', 'neopixel'],
    },
    {
      name: 'Светодиодное кольцо NeoPixel 12 RGB LED',
      slug: 'neopixel-ring-12-led',
      sku: 'LGT-NEO-RING-12',
      shortDescription: 'Круглая плата с 12 адресными полноцветными диодами WS2812B',
      description: 'Жесткое кольцо внешним диаметром 50 мм со светодиодами NeoPixel. Кольца можно каскадировать (соединять выход OUT со входом IN следующего), создавая сложные световые эффекты для индикации или подсветки линз.',
      priceMinor: 68000, stock: 95,
      categoryId: catLighting.id, brandId: adafruit.id,
      specs: [
        { key: 'count', label: 'Кол-во пикселей', value: '12 штук RGB LED' },
        { key: 'diameters', label: 'Диаметры кольца', value: 'Внутренний 36мм, Внешний 50мм' },
        { key: 'control', label: 'Интерфейс', value: 'Однопроводной протокол' },
      ],
      tags: ['led-ring', 'neopixel', 'rgb', 'addressable'],
    },
    {
      name: 'Семисегментный индикатор 4 знака на чипе TM1637',
      slug: 'tm1637-4digit-display',
      sku: 'LGT-TM1637-DISPLAY',
      shortDescription: 'Цифровой индикатор с двоеточием, идеален для электронных часов, DIO/CLK',
      description: 'Готовый модуль для вывода времени, таймеров или простых кодов ошибок. Драйвер TM1637 берет на себя всю рутину по динамическому сканированию и обновлению регистров, общаясь с MCU всего по двум линиям.',
      priceMinor: 24000, stock: 220,
      categoryId: catLighting.id, brandId: dfrobot.id,
      specs: [
        { key: 'digits', label: 'Количество разрядов', value: '4 знака с разделителем двоеточие' },
        { key: 'color', label: 'Цвет свечения', value: 'Ярко-красный сегменты' },
        { key: 'interface', label: 'Интерфейс', value: '2-wire (CLK, DIO)' },
      ],
      tags: ['7segment', 'display', 'tm1637', 'clock', 'indicator'],
    },
    {
      name: 'Лазерный диодный модуль 5mW 650nm',
      slug: 'laser-diode-module-red',
      sku: 'LGT-LASER-RED',
      shortDescription: 'Точечный лазерный излучатель красного цвета, медная головка',
      description: 'Специфический индикаторный лазер малой мощности. Корпус выполнен в виде медного цилиндра, фокусирующая линза позволяет получить четкую точку на большом расстоянии. Для охранных лазерных барьеров.',
      priceMinor: 15000, stock: 350,
      categoryId: catLighting.id, brandId: dfrobot.id,
      specs: [
        { key: 'power', label: 'Выходная мощность', value: '5 мВт' },
        { key: 'wavelength', label: 'Длина волны', value: '650 нм (красный спектр)' },
        { key: 'voltage', label: 'Питание', value: '5 V DC' },
      ],
      tags: ['laser', 'diode', 'optics', 'actuator', 'diy-security'],
    },
    {
      name: 'Модуль трехцветного светодиода RGB SMD',
      slug: 'rgb-led-smd-module',
      sku: 'LGT-RGB-SMD-MOD',
      shortDescription: 'Полноцветный светодиод 5050 на плате с токоограничительными резисторами',
      description: 'Простая платка с RGB SMD светодиодом, имеющая общие выводы R, G, B и минус (GND). Резисторы уже распаяны на текстолите, модуль можно напрямую подключать к ШИМ-выводам (PWM) плат Arduino.',
      priceMinor: 14000, stock: 540,
      categoryId: catLighting.id, brandId: dfrobot.id,
      specs: [
        { key: 'led_type', label: 'Тип диода', value: 'SMD 5050 RGB' },
        { key: 'resistors', label: 'Резисторы на плате', value: '3 × 150 Ом интегрированы' },
        { key: 'connection', label: 'Тип подключения', value: 'Общий катод (GND)' },
      ],
      tags: ['led', 'rgb', 'smd', 'pwm', 'indicator'],
    },
     {
      name: 'Intel Core i9-14900KS',
      slug: 'intel-core-i9-14900ks',
      sku: 'CPU-INTEL-I9-14900KS',
      shortDescription: 'Процессор 24-ядра на 8P+16E, базовая частота 3.6 ГГц, Raptor Lake Refresh',
      description: 'Флагманский процессор Intel с максимальной производительностью. 24 ядра (8 производительных + 16 эффективных), встроенная видеокарта Iris Xe. Идеален для игр и профессиональной работы.',
      priceMinor: 98500000, stock: 8,
      categoryId: catCpu.id, brandId: intel.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '24 (8P + 16E)' },
        { key: 'threads', label: 'Потоки', value: '32' },
        { key: 'base_freq', label: 'Базовая частота', value: '3.6 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '6.2 ГГц' },
        { key: 'cache', label: 'Кэш', value: '36 МБ (8MB L2 + 28MB L3)' },
        { key: 'tdp', label: 'TDP', value: '125 Вт' },
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
      ],
      tags: ['cpu', 'processor', 'intel', 'gaming', 'professional', 'high-performance'],
    },
    {
      name: 'AMD Ryzen 9 7950X3D',
      slug: 'amd-ryzen-9-7950x3d',
      sku: 'CPU-AMD-R9-7950X3D',
      shortDescription: 'Процессор 16-ядра с 3D V-Cache, Zen 4, LGA1718',
      description: 'Мощнейший процессор от AMD с технологией 3D V-Cache, добавляющей 96 МБ L3 кэша. 16 ядер, 32 потока, идеален для игр и рендеринга.',
      priceMinor: 89000000, stock: 12,
      categoryId: catCpu.id, brandId: amd.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '16' },
        { key: 'threads', label: 'Потоки', value: '32' },
        { key: 'base_freq', label: 'Базовая частота', value: '4.2 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '5.7 ГГц' },
        { key: 'cache', label: 'Кэш L3', value: '96 МБ (3D V-Cache)' },
        { key: 'tdp', label: 'TDP', value: '120 Вт' },
        { key: 'socket', label: 'Сокет', value: 'AM5' },
      ],
      tags: ['cpu', 'processor', 'amd', 'gaming', 'high-performance', 'vcache'],
    },
    {
      name: 'Intel Core i7-14700K',
      slug: 'intel-core-i7-14700k',
      sku: 'CPU-INTEL-I7-14700K',
      shortDescription: 'Процессор 20-ядра (8P+12E), 3.4 ГГц, Socket LGA1700',
      description: 'Мощный процессор среднего ценового диапазона с отличной производительностью. 20 ядер, поддержка DDR5, встроенная видеокарта Iris Xe.',
      priceMinor: 42000000, stock: 25,
      categoryId: catCpu.id, brandId: intel.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '20 (8P + 12E)' },
        { key: 'threads', label: 'Потоки', value: '28' },
        { key: 'base_freq', label: 'Базовая частота', value: '3.4 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '5.6 ГГц' },
        { key: 'cache', label: 'Кэш', value: '33 МБ' },
        { key: 'tdp', label: 'TDP', value: '125 Вт' },
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
      ],
      tags: ['cpu', 'processor', 'intel', 'gaming', 'professional'],
    },
    {
      name: 'AMD Ryzen 7 7700X',
      slug: 'amd-ryzen-7-7700x',
      sku: 'CPU-AMD-R7-7700X',
      shortDescription: '8-ядерный процессор, 4.5 ГГц базовая, Socket AM5',
      description: 'Отличный процессор для игроков и работы. 8 ядер Zen 4, высокая тактовая частота, поддержка DDR5.',
      priceMinor: 29000000, stock: 35,
      categoryId: catCpu.id, brandId: amd.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '8' },
        { key: 'threads', label: 'Потоки', value: '16' },
        { key: 'base_freq', label: 'Базовая частота', value: '4.5 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '5.4 ГГц' },
        { key: 'cache', label: 'Кэш', value: '32 МБ L3' },
        { key: 'tdp', label: 'TDP', value: '105 Вт' },
        { key: 'socket', label: 'Сокет', value: 'AM5' },
      ],
      tags: ['cpu', 'processor', 'amd', 'gaming'],
    },
    {
      name: 'Intel Core i5-14600K',
      slug: 'intel-core-i5-14600k',
      sku: 'CPU-INTEL-I5-14600K',
      shortDescription: '14-ядерный процессор (6P+8E), 3.5 ГГц, LGA1700',
      description: 'Доступный процессор с хорошей производительностью для игр и повседневной работы. 14 ядер, 20 потоков.',
      priceMinor: 22000000, stock: 45,
      categoryId: catCpu.id, brandId: intel.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '14 (6P + 8E)' },
        { key: 'threads', label: 'Потоки', value: '20' },
        { key: 'base_freq', label: 'Базовая частота', value: '3.5 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '5.3 ГГц' },
        { key: 'cache', label: 'Кэш', value: '24 МБ' },
        { key: 'tdp', label: 'TDP', value: '125 Вт' },
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
      ],
      tags: ['cpu', 'processor', 'intel', 'gaming', 'entry-level'],
    },
    {
      name: 'AMD Ryzen 5 7600X',
      slug: 'amd-ryzen-5-7600x',
      sku: 'CPU-AMD-R5-7600X',
      shortDescription: '6-ядерный Zen 4 процессор, 4.7 ГГц, AM5',
      description: 'Бюджетный вариант высокой производительности. 6 ядер, частота 4.7 ГГц, отличный выбор для 1080p и 1440p игр.',
      priceMinor: 16000000, stock: 60,
      categoryId: catCpu.id, brandId: amd.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '6' },
        { key: 'threads', label: 'Потоки', value: '12' },
        { key: 'base_freq', label: 'Базовая частота', value: '4.7 ГГц' },
        { key: 'boost_freq', label: 'Макс. частота', value: '5.3 ГГц' },
        { key: 'cache', label: 'Кэш', value: '32 МБ L3' },
        { key: 'tdp', label: 'TDP', value: '105 Вт' },
        { key: 'socket', label: 'Сокет', value: 'AM5' },
      ],
      tags: ['cpu', 'processor', 'amd', 'budget', 'gaming'],
    },

// ── GPU (Видеокарты) ────────────────────────────────────────────────────
    {
      name: 'NVIDIA GeForce RTX 4090',
      slug: 'nvidia-geforce-rtx-4090',
      sku: 'GPU-NVIDIA-RTX-4090',
      shortDescription: 'Флагманская видеокарта, 24 ГБ GDDR6X, 384-бит шина',
      description: 'Самая мощная потребительская видеокарта на рынке. 16,384 CUDA ядер, 24 ГБ памяти, отличная для игр 4K и AI вычислений.',
      priceMinor: 220000000, stock: 5,
      categoryId: catGpu.id, brandId: nvidia.id,
      specs: [
        { key: 'memory', label: 'Память', value: '24 ГБ GDDR6X' },
        { key: 'memory_bus', label: 'Шина памяти', value: '384-бит' },
        { key: 'cuda_cores', label: 'CUDA ядра', value: '16384' },
        { key: 'power', label: 'Требуемая мощность', value: '450 Вт' },
        { key: 'interface', label: 'Интерфейс', value: 'PCIe 4.0 x16' },
        { key: 'connectors', label: 'Питание', value: '3 × 8-pin PCIe' },
      ],
      tags: ['gpu', 'nvidia', 'rtx', 'gaming', 'ai', 'professional', 'flagship'],
    },
    {
      name: 'NVIDIA GeForce RTX 4080 Super',
      slug: 'nvidia-geforce-rtx-4080-super',
      sku: 'GPU-NVIDIA-RTX-4080-SUPER',
      shortDescription: 'Видеокарта 16 ГБ GDDR6X, 10,240 CUDA ядер',
      description: 'Мощная видеокарта для 4K игр и профессиональной работы. Хороший баланс цены и производительности.',
      priceMinor: 125000000, stock: 12,
      categoryId: catGpu.id, brandId: nvidia.id,
      specs: [
        { key: 'memory', label: 'Память', value: '16 ГБ GDDR6X' },
        { key: 'memory_bus', label: 'Шина памяти', value: '256-бит' },
        { key: 'cuda_cores', label: 'CUDA ядра', value: '10240' },
        { key: 'power', label: 'Требуемая мощность', value: '320 Вт' },
      ],
      tags: ['gpu', 'nvidia', 'rtx', '4k', 'gaming', 'professional'],
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Ti Super',
      slug: 'nvidia-geforce-rtx-4070-ti-super',
      sku: 'GPU-NVIDIA-RTX-4070-TI-SUPER',
      shortDescription: '12 ГБ GDDR6X, 7680 CUDA ядер, 192-бит шина',
      description: 'Отличный баланс цены и производительности для 1440p и 4K. 12 ГБ памяти достаточно для большинства игр.',
      priceMinor: 75000000, stock: 18,
      categoryId: catGpu.id, brandId: nvidia.id,
      specs: [
        { key: 'memory', label: 'Память', value: '12 ГБ GDDR6X' },
        { key: 'memory_bus', label: 'Шина памяти', value: '192-бит' },
        { key: 'cuda_cores', label: 'CUDA ядра', value: '7680' },
        { key: 'power', label: 'Требуемая мощность', value: '285 Вт' },
      ],
      tags: ['gpu', 'nvidia', 'rtx', '1440p', '4k', 'gaming'],
    },
    {
      name: 'NVIDIA GeForce RTX 4070',
      slug: 'nvidia-geforce-rtx-4070',
      sku: 'GPU-NVIDIA-RTX-4070',
      shortDescription: '12 ГБ GDDR6 памяти, 5888 CUDA ядер',
      description: 'Отличный выбор для 1440p при максимальных настройках. Хороший выход для цены.',
      priceMinor: 55000000, stock: 25,
      categoryId: catGpu.id, brandId: nvidia.id,
      specs: [
        { key: 'memory', label: 'Память', value: '12 ГБ GDDR6' },
        { key: 'memory_bus', label: 'Шина памяти', value: '192-бит' },
        { key: 'cuda_cores', label: 'CUDA ядра', value: '5888' },
        { key: 'power', label: 'Требуемая мощность', value: '200 Вт' },
      ],
      tags: ['gpu', 'nvidia', 'rtx', '1440p', 'gaming', 'mid-range'],
    },
    {
      name: 'NVIDIA GeForce RTX 4060 Ti',
      slug: 'nvidia-geforce-rtx-4060-ti',
      sku: 'GPU-NVIDIA-RTX-4060-TI',
      shortDescription: '8 ГБ GDDR6 памяти, 4352 CUDA ядра',
      description: 'Компактная видеокарта для 1080p и 1440p. Потребляет мало электроэнергии.',
      priceMinor: 35000000, stock: 40,
      categoryId: catGpu.id, brandId: nvidia.id,
      specs: [
        { key: 'memory', label: 'Память', value: '8 ГБ GDDR6' },
        { key: 'memory_bus', label: 'Шина памяти', value: '128-бит' },
        { key: 'cuda_cores', label: 'CUDA ядра', value: '4352' },
        { key: 'power', label: 'Требуемая мощность', value: '150 Вт' },
      ],
      tags: ['gpu', 'nvidia', 'rtx', '1080p', 'compact', 'budget'],
    },
    {
      name: 'AMD Radeon RX 7900 XTX',
      slug: 'amd-radeon-rx-7900-xtx',
      sku: 'GPU-AMD-RX-7900-XTX',
      shortDescription: '24 ГБ GDDR6 памяти, 60 ядер вычисления',
      description: 'Конкурент RTX 4090 от AMD. Отличная производительность в играх с поддержкой DirectX 12.',
      priceMinor: 200000000, stock: 8,
      categoryId: catGpu.id, brandId: amd.id,
      specs: [
        { key: 'memory', label: 'Память', value: '24 ГБ GDDR6' },
        { key: 'memory_bus', label: 'Шина памяти', value: '384-бит' },
        { key: 'stream_processors', label: 'Stream процессоры', value: '6144' },
        { key: 'power', label: 'Требуемая мощность', value: '420 Вт' },
      ],
      tags: ['gpu', 'amd', 'radeon', 'gaming', '4k', 'flagship'],
    },
    {
      name: 'AMD Radeon RX 7800 XT',
      slug: 'amd-radeon-rx-7800-xt',
      sku: 'GPU-AMD-RX-7800-XT',
      shortDescription: '16 ГБ GDDR6 памяти, 60 ядер вычисления',
      description: 'Мощная видеокарта для 1440p и 4K. Хороший выбор для игроков на AMD платформе.',
      priceMinor: 95000000, stock: 15,
      categoryId: catGpu.id, brandId: amd.id,
      specs: [
        { key: 'memory', label: 'Память', value: '16 ГБ GDDR6' },
        { key: 'memory_bus', label: 'Шина памяти', value: '256-бит' },
        { key: 'stream_processors', label: 'Stream процессоры', value: '3840' },
        { key: 'power', label: 'Требуемая мощность', value: '310 Вт' },
      ],
      tags: ['gpu', 'amd', 'radeon', '1440p', '4k', 'gaming'],
    },

// ── RAM (Оперативная память) ────────────────────────────────────────────
    {
      name: 'Corsair Dominator Platinum RGB DDR5 6000MHz 32GB (2x16GB)',
      slug: 'corsair-dominator-platinum-rgb-ddr5-6000-32gb',
      sku: 'RAM-CORSAIR-DOM-DDR5-6000-32',
      shortDescription: 'Комплект 32 ГБ DDR5, частота 6000 МГц, RGB подсветка',
      description: 'Премиум память для высокопроизводительных сборок. Частота 6000 МГц, латентность CAS 30, красивая RGB подсветка.',
      priceMinor: 18000000, stock: 20,
      categoryId: catRam.id, brandId: corsair.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '32 ГБ (2×16 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '6000 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '30' },
        { key: 'voltage', label: 'Напряжение', value: '1.40V' },
        { key: 'type', label: 'Тип', value: 'DDR5 UDIMM' },
      ],
      tags: ['ram', 'memory', 'ddr5', 'corsair', 'rgb', 'high-performance'],
    },
    {
      name: 'Kingston Fury Beast DDR5 5600MHz 32GB (2x16GB)',
      slug: 'kingston-fury-beast-ddr5-5600-32gb',
      sku: 'RAM-KINGSTON-FURY-DDR5-5600-32',
      shortDescription: '32 ГБ DDR5 5600 МГц, без RGB, доступная цена',
      description: 'Хорошее соотношение цены и качества. Частота 5600 МГц, стабильная работа во всех системах.',
      priceMinor: 14000000, stock: 35,
      categoryId: catRam.id, brandId: kingston.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '32 ГБ (2×16 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '5600 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '28' },
        { key: 'voltage', label: 'Напряжение', value: '1.25V' },
        { key: 'type', label: 'Тип', value: 'DDR5 UDIMM' },
      ],
      tags: ['ram', 'memory', 'ddr5', 'kingston', 'budget-friendly'],
    },
    {
      name: 'G.Skill Trident Z5 RGB DDR5 6400MHz 32GB',
      slug: 'gskill-trident-z5-rgb-ddr5-6400-32gb',
      sku: 'RAM-GSKILL-TRIDENT-Z5-6400-32',
      shortDescription: '32 ГБ DDR5 6400 МГц, RGB, высокая частота',
      description: 'Быстрая и красивая память. Частота 6400 МГц обеспечивает максимальную производительность.',
      priceMinor: 19000000, stock: 18,
      categoryId: catRam.id, brandId: gskill.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '32 ГБ (2×16 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '6400 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '32' },
        { key: 'type', label: 'Тип', value: 'DDR5 UDIMM' },
      ],
      tags: ['ram', 'memory', 'ddr5', 'gskill', 'rgb', 'high-speed'],
    },
    {
      name: 'Crucial Pro DDR5 5600MHz 32GB',
      slug: 'crucial-pro-ddr5-5600-32gb',
      sku: 'RAM-CRUCIAL-PRO-DDR5-5600-32',
      shortDescription: '32 ГБ DDR5 5600 МГц, низкий профиль',
      description: 'Надёжная память от Crucial. Низкий профиль подходит даже с большими кулерами.',
      priceMinor: 13500000, stock: 42,
      categoryId: catRam.id, brandId: crucial.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '32 ГБ (2×16 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '5600 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '28' },
        { key: 'height', label: 'Высота', value: 'Low-profile' },
      ],
      tags: ['ram', 'memory', 'ddr5', 'crucial', 'budget'],
    },
    {
      name: 'HyperX Fury Beast DDR4 3200MHz 32GB',
      slug: 'hyperx-fury-beast-ddr4-3200-32gb',
      sku: 'RAM-HYPERX-FURY-DDR4-3200-32',
      shortDescription: '32 ГБ DDR4 3200 МГц для старых платформ',
      description: 'Хорошая память для более старых систем на LGA1200/AM4 с DDR4.',
      priceMinor: 9000000, stock: 50,
      categoryId: catRam.id, brandId: hyperx.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '32 ГБ (2×16 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '3200 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '16' },
        { key: 'type', label: 'Тип', value: 'DDR4 UDIMM' },
      ],
      tags: ['ram', 'memory', 'ddr4', 'hyperx', 'budget'],
    },
    {
      name: 'Samsung DDR5 5600MHz 48GB (2x24GB)',
      slug: 'samsung-ddr5-5600-48gb',
      sku: 'RAM-SAMSUNG-DDR5-5600-48',
      shortDescription: '48 ГБ DDR5 5600 МГц для профессионалов',
      description: 'Большой объём памяти для работы с тяжёлыми приложениями и вирутализацией.',
      priceMinor: 21000000, stock: 12,
      categoryId: catRam.id, brandId: samsung.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '48 ГБ (2×24 ГБ)' },
        { key: 'frequency', label: 'Частота', value: '5600 МГц' },
        { key: 'cas_latency', label: 'CAS Latency', value: '28' },
        { key: 'type', label: 'Тип', value: 'DDR5 UDIMM' },
      ],
      tags: ['ram', 'memory', 'ddr5', 'samsung', 'professional', 'large-capacity'],
    },

// ── SSD (Твёрдотельные накопители) ──────────────────────────────────────
    {
      name: 'Samsung 990 Pro NVMe 4TB',
      slug: 'samsung-990-pro-nvme-4tb',
      sku: 'SSD-SAMSUNG-990PRO-4TB',
      shortDescription: '4 ТБ NVMe M.2 PCIe 4.0, скорость чтения до 7450 МБ/с',
      description: 'Флагманский NVMe накопитель. Огромная скорость чтения-записи, отличное качество построения.',
      priceMinor: 35000000, stock: 16,
      categoryId: catSsd.id, brandId: samsung.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '4 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: 'NVMe M.2 PCIe 4.0' },
        { key: 'read_speed', label: 'Скорость чтения', value: 'до 7450 МБ/с' },
        { key: 'write_speed', label: 'Скорость записи', value: 'до 6900 МБ/с' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'M.2 2280' },
      ],
      tags: ['ssd', 'nvme', 'samsung', 'pcie4', 'high-speed'],
    },
    {
      name: 'Western Digital Black SN850X 2TB',
      slug: 'western-digital-black-sn850x-2tb',
      sku: 'SSD-WD-BLACK-SN850X-2TB',
      shortDescription: '2 ТБ NVMe PCIe 4.0, скорость до 7100 МБ/с',
      description: 'Хороший выбор для игр и работы. Хорошее соотношение цены и производительности.',
      priceMinor: 18000000, stock: 28,
      categoryId: catSsd.id, brandId: western_digital.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '2 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: 'NVMe M.2 PCIe 4.0' },
        { key: 'read_speed', label: 'Скорость чтения', value: 'до 7100 МБ/с' },
        { key: 'write_speed', label: 'Скорость записи', value: 'до 5300 МБ/с' },
        { key: 'warranty', label: 'Гарантия', value: '5 лет' },
      ],
      tags: ['ssd', 'nvme', 'wd', 'pcie4', 'gaming'],
    },
    {
      name: 'Crucial P5 Plus 1TB',
      slug: 'crucial-p5-plus-1tb',
      sku: 'SSD-CRUCIAL-P5-PLUS-1TB',
      shortDescription: '1 ТБ NVMe PCIe 4.0, доступная цена',
      description: 'Отличный бюджетный вариант. Скорость вполне достаточна для большинства задач.',
      priceMinor: 8500000, stock: 45,
      categoryId: catSsd.id, brandId: crucial.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '1 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: 'NVMe M.2 PCIe 4.0' },
        { key: 'read_speed', label: 'Скорость чтения', value: 'до 6600 МБ/с' },
        { key: 'write_speed', label: 'Скорость записи', value: 'до 5100 МБ/с' },
      ],
      tags: ['ssd', 'nvme', 'crucial', 'pcie4', 'budget'],
    },
    {
      name: 'Kingston A3000 1TB SATA SSD',
      slug: 'kingston-a3000-1tb-sata',
      sku: 'SSD-KINGSTON-A3000-1TB',
      shortDescription: '1 ТБ SATA SSD, бюджетный вариант',
      description: 'Доступная цена для расширения хранилища. Скорость SATA (560 МБ/с).',
      priceMinor: 4500000, stock: 65,
      categoryId: catSsd.id, brandId: kingston.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '1 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: '2.5" SATA SSD' },
        { key: 'read_speed', label: 'Скорость чтения', value: 'до 560 МБ/с' },
        { key: 'form_factor', label: 'Форм-фактор', value: '2.5 дюйма' },
      ],
      tags: ['ssd', 'sata', 'kingston', 'budget', 'storage'],
    },
    {
      name: 'Seagate Barracuda Pro HDD 4TB',
      slug: 'seagate-barracuda-pro-4tb',
      sku: 'HDD-SEAGATE-BARRACUDA-4TB',
      shortDescription: '4 ТБ жесткий диск для хранения',
      description: 'Традиционный жесткий диск для больших объёмов хранения данных. Хорошее соотношение цены за ГБ.',
      priceMinor: 8000000, stock: 35,
      categoryId: catSsd.id, brandId: seagate.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '4 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: 'SATA 6Gb/s' },
        { key: 'rpm', label: 'Скорость вращения', value: '7200 RPM' },
        { key: 'cache', label: 'Кэш', value: '256 МБ' },
      ],
      tags: ['hdd', 'storage', 'seagate', 'bulk-storage'],
    },
    {
      name: 'Lexar NM790 4TB NVMe',
      slug: 'lexar-nm790-4tb-nvme',
      sku: 'SSD-LEXAR-NM790-4TB',
      shortDescription: '4 ТБ NVMe PCIe 5.0 Ultra-High Speed',
      description: 'Сверхбыстрый NVMe диск следующего поколения. Для максимально современных систем.',
      priceMinor: 40000000, stock: 10,
      categoryId: catSsd.id, brandId: lexar.id,
      specs: [
        { key: 'capacity', label: 'Объём', value: '4 ТБ' },
        { key: 'interface', label: 'Интерфейс', value: 'NVMe M.2 PCIe 5.0' },
        { key: 'read_speed', label: 'Скорость чтения', value: 'до 12,400 МБ/с' },
        { key: 'write_speed', label: 'Скорость записи', value: 'до 9,500 МБ/с' },
      ],
      tags: ['ssd', 'nvme', 'lexar', 'pcie5', 'ultra-fast'],
    },

// ── Motherboards (Материнские платы) ────────────────────────────────────
    {
      name: 'ASUS ROG MAXIMUS Z890-HERO',
      slug: 'asus-rog-maximus-z890-hero',
      sku: 'MB-ASUS-Z890-HERO',
      shortDescription: 'LGA1700 Z890 чипсет, PCIe 5.0, максимум разъёмов M.2',
      description: 'Флагманская материнская плата ASUS. Полная поддержка новых процессоров Intel, множество расширений.',
      priceMinor: 55000000, stock: 8,
      categoryId: catMotherboard.id, brandId: asus.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
        { key: 'chipset', label: 'Чипсет', value: 'Intel Z890' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '4 × DIMM DDR5' },
        { key: 'pcie', label: 'PCIe', value: '5.0 x16 + x8' },
        { key: 'm2_slots', label: 'Слоты M.2', value: '5 × M.2 (PCIe 5.0 + 4.0)' },
      ],
      tags: ['motherboard', 'asus', 'lga1700', 'z890', 'intel', 'high-end'],
    },
    {
      name: 'MSI MEG Z890 ACE',
      slug: 'msi-meg-z890-ace',
      sku: 'MB-MSI-Z890-ACE',
      shortDescription: 'Z890 для Intel, максимальная производительность памяти',
      description: 'Оверклокерская плата от MSI с экстремальными возможностями настройки памяти.',
      priceMinor: 48000000, stock: 10,
      categoryId: catMotherboard.id, brandId: msi.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
        { key: 'chipset', label: 'Чипсет', value: 'Intel Z890' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '4 × DIMM DDR5' },
      ],
      tags: ['motherboard', 'msi', 'z890', 'intel', 'overclocking', 'high-end'],
    },
    {
      name: 'Gigabyte Z890 MASTER',
      slug: 'gigabyte-z890-master',
      sku: 'MB-GIGABYTE-Z890-MASTER',
      shortDescription: 'Z890 ATX для Intel с хорошим соотношением цены и функционала',
      description: 'Качественная плата Gigabyte с надёжной системой питания.',
      priceMinor: 38000000, stock: 15,
      categoryId: catMotherboard.id, brandId: gigabyte.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'LGA1700' },
        { key: 'chipset', label: 'Чипсет', value: 'Intel Z890' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '4 × DIMM DDR5' },
      ],
      tags: ['motherboard', 'gigabyte', 'z890', 'intel', 'mid-range'],
    },
    {
      name: 'ASUS ROG CROSSHAIR X870-E-E GAMING WIFI',
      slug: 'asus-rog-crosshair-x870e-gaming',
      sku: 'MB-ASUS-X870E-GAMING',
      shortDescription: 'Socket AM5 X870E для AMD Ryzen, WiFi 7',
      description: 'Премиум плата для Ryzen 9000. Поддержка WiFi 7 и множество разъёмов.',
      priceMinor: 52000000, stock: 12,
      categoryId: catMotherboard.id, brandId: asus.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'Socket AM5' },
        { key: 'chipset', label: 'Чипсет', value: 'AMD X870E' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '2 × DIMM DDR5' },
        { key: 'wifi', label: 'WiFi', value: 'WiFi 7 (BE19000)' },
      ],
      tags: ['motherboard', 'asus', 'am5', 'x870e', 'amd', 'wifi7', 'premium'],
    },
    {
      name: 'MSI MPG B850E EDGE WIFI',
      slug: 'msi-mpg-b850e-edge-wifi',
      sku: 'MB-MSI-B850E-EDGE',
      shortDescription: 'B850E Socket AM5, хорошее соотношение цены',
      description: 'Качественная плата для Ryzen среднего ценового диапазона.',
      priceMinor: 28000000, stock: 22,
      categoryId: catMotherboard.id, brandId: msi.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'Socket AM5' },
        { key: 'chipset', label: 'Чипсет', value: 'AMD B850E' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '2 × DIMM DDR5' },
      ],
      tags: ['motherboard', 'msi', 'b850e', 'amd', 'mid-range'],
    },
    {
      name: 'Gigabyte B850 GAMING X',
      slug: 'gigabyte-b850-gaming-x',
      sku: 'MB-GIGABYTE-B850-GAMING-X',
      shortDescription: 'B850 Socket AM5, доступный вариант',
      description: 'Бюджетная плата для Ryzen с необходимым функционалом.',
      priceMinor: 18000000, stock: 30,
      categoryId: catMotherboard.id, brandId: gigabyte.id,
      specs: [
        { key: 'socket', label: 'Сокет', value: 'Socket AM5' },
        { key: 'chipset', label: 'Чипсет', value: 'AMD B850' },
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'memory_slots', label: 'Слоты памяти', value: '2 × DIMM DDR5' },
      ],
      tags: ['motherboard', 'gigabyte', 'b850', 'amd', 'budget'],
    },

// ── Power Supply (Блоки питания) ────────────────────────────────────────
    {
      name: 'Corsair HX1500i 1500W Titanium',
      slug: 'corsair-hx1500i-1500w-titanium',
      sku: 'PSU-CORSAIR-HX1500I',
      shortDescription: '1500W модульный БП, 80+ Titanium, 12-летняя гарантия',
      description: 'Топовый блок питания для экстремальных сборок. КПД 92%+, полностью модульный.',
      priceMinor: 32000000, stock: 6,
      categoryId: catPsu.id, brandId: corsair.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '1500 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Titanium (92%+)' },
        { key: 'modular', label: 'Модульность', value: 'Полностью модульный' },
        { key: 'warranty', label: 'Гарантия', value: '12 лет' },
        { key: 'connector', label: 'Тип разъёма CPU', value: '2 × 8-pin EPS' },
      ],
      tags: ['psu', 'corsair', 'titanium', 'modular', 'high-end'],
    },
    {
      name: 'Seasonic PRIME ULTRA 1000W Gold',
      slug: 'seasonic-prime-ultra-1000w-gold',
      sku: 'PSU-SEASONIC-PRIME-ULTRA-1000',
      shortDescription: '1000W модульный, 80+ Gold, Япон качество',
      description: 'Надёжный блок питания японского производства. Отличная шумоизоляция.',
      priceMinor: 18000000, stock: 14,
      categoryId: catPsu.id, brandId: seasonic.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '1000 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Gold (90%+)' },
        { key: 'modular', label: 'Модульность', value: 'Полностью модульный' },
        { key: 'warranty', label: 'Гарантия', value: '12 лет' },
      ],
      tags: ['psu', 'seasonic', 'gold', 'modular', 'reliable'],
    },
    {
      name: 'Be Quiet! Dark Power Pro 13 850W',
      slug: 'be-quiet-dark-power-pro-13-850w',
      sku: 'PSU-BEQUIET-DPP13-850',
      shortDescription: '850W, 80+ Platinum, очень тихий',
      description: 'Премиум БП известный своей тишиной. Специальная шумоизоляция.',
      priceMinor: 16000000, stock: 10,
      categoryId: catPsu.id, brandId: be_quiet.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '850 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Platinum (92%+)' },
        { key: 'modular', label: 'Модульность', value: 'Полностью модульный' },
        { key: 'noise_level', label: 'Уровень шума', value: 'Очень тихий' },
      ],
      tags: ['psu', 'be-quiet', 'platinum', 'silent', 'modular'],
    },
    {
      name: 'EVGA SuperNOVA 750 G6 750W Gold',
      slug: 'evga-supernova-750-g6-gold',
      sku: 'PSU-EVGA-SN750-G6',
      shortDescription: '750W модульный, 80+ Gold, хорошая цена',
      description: 'Проверенный БП для большинства конфигураций. Хорошее соотношение цены-качества.',
      priceMinor: 10000000, stock: 25,
      categoryId: catPsu.id, brandId: evga.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '750 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Gold' },
        { key: 'modular', label: 'Модульность', value: 'Полностью модульный' },
        { key: 'warranty', label: 'Гарантия', value: '10 лет' },
      ],
      tags: ['psu', 'evga', 'gold', 'modular', 'mid-range'],
    },
    {
      name: 'Corsair CX650F RGB 650W Bronze',
      slug: 'corsair-cx650f-rgb-650w-bronze',
      sku: 'PSU-CORSAIR-CX650F',
      shortDescription: '650W, 80+ Bronze, RGB подсветка, доступный',
      description: 'Бюджетный вариант для базовых конфигураций. Есть RGB подсветка для красоты.',
      priceMinor: 6500000, stock: 40,
      categoryId: catPsu.id, brandId: corsair.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '650 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Bronze (85%+)' },
        { key: 'modular', label: 'Модульность', value: 'Полумодульный' },
        { key: 'led', label: 'RGB подсветка', value: 'Да' },
      ],
      tags: ['psu', 'corsair', 'bronze', 'budget', 'rgb'],
    },
    {
      name: 'Thermaltake Toughpower GF1 500W Gold',
      slug: 'thermaltake-toughpower-gf1-500w',
      sku: 'PSU-THERMALTAKE-GF1-500',
      shortDescription: '500W, 80+ Gold, компактный',
      description: 'Компактный блок питания идеален для небольших корпусов.',
      priceMinor: 5500000, stock: 35,
      categoryId: catPsu.id, brandId: thermaltake.id,
      specs: [
        { key: 'wattage', label: 'Мощность', value: '500 Вт' },
        { key: 'efficiency', label: 'Сертификация', value: '80+ Gold' },
        { key: 'modular', label: 'Модульность', value: 'Полностью модульный' },
        { key: 'size', label: 'Размер', value: 'Компактный' },
      ],
      tags: ['psu', 'thermaltake', 'gold', 'compact'],
    },

// ── CPU Coolers (Кулеры для процессора) ────────────────────────────────
    {
      name: 'Noctua NH-D15 Chromax Black Edition',
      slug: 'noctua-nh-d15-chromax-black',
      sku: 'COOLER-NOCTUA-D15-CHROMAX',
      shortDescription: 'Воздушный кулер, 2 вентилятора 140мм, очень тихий',
      description: 'Один из лучших воздушных кулеров. Знаменит на весь мир своей низкой шумностью.',
      priceMinor: 8500000, stock: 18,
      categoryId: catCooler.id, brandId: noctua.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'Воздушное' },
        { key: 'sockets', label: 'Сокеты', value: 'LGA1700, AM5, и другие' },
        { key: 'fans', label: 'Вентиляторы', value: '2 × 140 мм' },
        { key: 'noise_level', label: 'Шумность', value: 'Очень тихо (~21 дБ)' },
        { key: 'height', label: 'Высота', value: '165 мм' },
      ],
      tags: ['cooler', 'noctua', 'air', 'quiet', 'premium'],
    },
    {
      name: 'be quiet! Dark Rock Pro Ultra',
      slug: 'be-quiet-dark-rock-pro-ultra',
      sku: 'COOLER-BEQUIET-DRP-ULTRA',
      shortDescription: 'Воздушный кулер премиум класса, 2 вентилятора',
      description: 'Премиум воздушное охлаждение от be quiet. Отличная производительность при тишине.',
      priceMinor: 7500000, stock: 15,
      categoryId: catCooler.id, brandId: be_quiet.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'Воздушное' },
        { key: 'fans', label: 'Вентиляторы', value: '2 × 135 мм' },
        { key: 'noise_level', label: 'Шумность', value: 'Очень низкая (~23 дБ)' },
        { key: 'tdp', label: 'Максимальный TDP', value: '250 Вт' },
      ],
      tags: ['cooler', 'be-quiet', 'air', 'quiet', 'premium'],
    },
    {
      name: 'NZXT Kraken Z63 360mm Liquid Cooler',
      slug: 'nzxt-kraken-z63-360mm',
      sku: 'COOLER-NZXT-KRAKEN-Z63',
      shortDescription: 'Жидкостное охлаждение 360мм, RGB, сенсорный экран',
      description: 'Современное жидкостное охлаждение с интегрированным дисплеем. Отличная производительность.',
      priceMinor: 12000000, stock: 12,
      categoryId: catCooler.id, brandId: nzxt.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'AIO Жидкостное' },
        { key: 'radiator', label: 'Радиатор', value: '360 мм' },
        { key: 'pump', label: 'Помпа', value: 'Встроенная' },
        { key: 'display', label: 'Дисплей', value: 'Сенсорный 2.36"' },
        { key: 'rgb', label: 'RGB подсветка', value: 'Да' },
      ],
      tags: ['cooler', 'nzxt', 'liquid', 'aio', 'rgb', 'premium'],
    },
    {
      name: 'Corsair iCUE H150i Elite LCD 360mm',
      slug: 'corsair-icue-h150i-elite-lcd-360',
      sku: 'COOLER-CORSAIR-H150I-LCD',
      shortDescription: 'AIO кулер 360мм с LCD экраном и RGB',
      description: 'Жидкостный кулер с дисплеем для показа информации о системе.',
      priceMinor: 11500000, stock: 14,
      categoryId: catCooler.id, brandId: corsair.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'AIO Жидкостное' },
        { key: 'radiator', label: 'Радиатор', value: '360 мм' },
        { key: 'display', label: 'Дисплей', value: 'LCD 2.4"' },
        { key: 'fans', label: 'Вентиляторы', value: '3 × 120 мм' },
      ],
      tags: ['cooler', 'corsair', 'liquid', 'aio', 'display', 'premium'],
    },
    {
      name: 'Arctic Cooling Liquid Freezer II 240mm',
      slug: 'arctic-liquid-freezer-ii-240',
      sku: 'COOLER-ARCTIC-LF2-240',
      shortDescription: 'AIO 240мм, отличное охлаждение по цене',
      description: 'Надёжное жидкостное охлаждение от Arctic. Хорошее соотношение цены и производительности.',
      priceMinor: 6000000, stock: 28,
      categoryId: catCooler.id, brandId: treelabs.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'AIO Жидкостное' },
        { key: 'radiator', label: 'Радиатор', value: '240 мм' },
        { key: 'fans', label: 'Вентиляторы', value: '2 × 120 мм' },
        { key: 'warranty', label: 'Гарантия', value: '6 лет' },
      ],
      tags: ['cooler', 'arctic', 'liquid', 'aio', 'budget'],
    },
    {
      name: 'Thermalright Peerless Assassin 180 SE',
      slug: 'thermalright-peerless-assassin-180-se',
      sku: 'COOLER-THERMALRIGHT-PA-180SE',
      shortDescription: 'Воздушный кулер, отличное охлаждение за деньги',
      description: 'Бюджетный воздушный кулер с отличной производительностью.',
      priceMinor: 2500000, stock: 50,
      categoryId: catCooler.id, brandId: treelabs.id,
      specs: [
        { key: 'type', label: 'Тип охлаждения', value: 'Воздушное' },
        { key: 'sockets', label: 'Сокеты', value: 'LGA1700, AM5' },
        { key: 'height', label: 'Высота', value: '180 мм' },
        { key: 'tdp', label: 'Максимальный TDP', value: '180 Вт' },
      ],
      tags: ['cooler', 'air', 'budget', 'thermalright'],
    },

// ── PC Cases (Корпуса) ──────────────────────────────────────────────────
    {
      name: 'NZXT H7 Flow RGB ATX Case',
      slug: 'nzxt-h7-flow-rgb',
      sku: 'CASE-NZXT-H7-FLOW',
      shortDescription: 'ATX корпус, 3 RGB вентилятора спереди, закалённое стекло',
      description: 'Современный корпус с отличной вентиляцией и красивым дизайном.',
      priceMinor: 8000000, stock: 22,
      categoryId: catCase.id, brandId: nzxt.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX / Micro-ATX' },
        { key: 'fans_included', label: 'Вентиляторы', value: '3 × 120 мм RGB' },
        { key: 'glass', label: 'Боковая панель', value: 'Закалённое стекло' },
        { key: 'radiator_support', label: 'Поддержка радиаторов', value: '360/280 мм спереди' },
      ],
      tags: ['case', 'nzxt', 'atx', 'rgb', 'gaming'],
    },
    {
      name: 'Corsair Crystal Series 570X RGB',
      slug: 'corsair-crystal-570x-rgb',
      sku: 'CASE-CORSAIR-570X',
      shortDescription: 'ATX корпус, трёхсторонний RGB, премиум стекло',
      description: 'Красивый корпус с тремя панелями закалённого стекла. Отличная для водяного охлаждения.',
      priceMinor: 9500000, stock: 18,
      categoryId: catCase.id, brandId: corsair.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX / Micro-ATX' },
        { key: 'fans_included', label: 'Вентиляторы', value: '3 × 120 мм' },
        { key: 'glass', label: 'Панели стекла', value: '3 панели закалённого стекла' },
        { key: 'radiator_support', label: 'Макс. радиатор', value: '360 мм спереди' },
      ],
      tags: ['case', 'corsair', 'atx', 'premium', 'glass'],
    },
    {
      name: 'Fractal Design North ATX Case White',
      slug: 'fractal-design-north-atx-white',
      sku: 'CASE-FRACTAL-NORTH',
      shortDescription: 'Скандинавский дизайн, простой и элегантный корпус',
      description: 'Минималистичный корпус с хорошей вентиляцией и тихой работой.',
      priceMinor: 7000000, stock: 25,
      categoryId: catCase.id, brandId: treelabs.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX / Micro-ATX' },
        { key: 'design', label: 'Дизайн', value: 'Скандинавский минимализм' },
        { key: 'glass', label: 'Боковая панель', value: 'Закалённое стекло' },
      ],
      tags: ['case', 'fractal', 'atx', 'minimalist', 'quiet'],
    },
    {
      name: 'Thermaltake Core P3 Tempered Glass',
      slug: 'thermaltake-core-p3-glass',
      sku: 'CASE-THERMALTAKE-P3',
      shortDescription: 'Открытый дизайн, легко доступ к компонентам',
      description: 'Корпус с открытой архитектурой для максимального доступа к железу.',
      priceMinor: 5000000, stock: 32,
      categoryId: catCase.id, brandId: thermaltake.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX' },
        { key: 'design', label: 'Дизайн', value: 'Открытая архитектура' },
        { key: 'glass', label: 'Панели', value: 'Закалённое стекло спереди и сбоку' },
      ],
      tags: ['case', 'thermaltake', 'open-design', 'budget'],
    },
    {
      name: 'Lian Li Lancool 216 RGB White',
      slug: 'lian-li-lancool-216-rgb',
      sku: 'CASE-LIANLI-LANCOOL-216',
      shortDescription: 'Бюджетный корпус с RGB вентиляторами',
      description: 'Доступный корпус с красивыми RGB лентами и вентиляторами.',
      priceMinor: 3500000, stock: 45,
      categoryId: catCase.id, brandId: treelabs.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX / Micro-ATX' },
        { key: 'fans_included', label: 'Вентиляторы', value: '2 × 120 мм RGB' },
        { key: 'glass', label: 'Боковая панель', value: 'Закалённое стекло' },
      ],
      tags: ['case', 'lian-li', 'atx', 'rgb', 'budget'],
    },
    {
      name: 'Cooler Master MasterBox TD500 Mesh',
      slug: 'cooler-master-masterbox-td500-mesh',
      sku: 'CASE-COOLERMASTER-TD500',
      shortDescription: 'Корпус с хорошей циркуляцией воздуха и RGB',
      description: 'Проверенный корпус для обычного пользователя и геймеров.',
      priceMinor: 4500000, stock: 38,
      categoryId: catCase.id, brandId: treelabs.id,
      specs: [
        { key: 'form_factor', label: 'Форм-фактор', value: 'ATX / Micro-ATX' },
        { key: 'fans_included', label: 'Вентиляторы', value: '2 × 120 мм спереди + 1 × 120 мм сзади' },
      ],
      tags: ['case', 'cooler-master', 'atx', 'budget', 'airflow'],
    },

// ── Peripherals (Периферия) ────────────────────────────────────────────
    {
      name: 'Logitech MX Master 3S Wireless Mouse',
      slug: 'logitech-mx-master-3s',
      sku: 'MOUSE-LOGITECH-MX3S',
      shortDescription: 'Беспроводная мышь премиум класса, 8K DPI, USB-C',
      description: 'Профессиональная мышь с бесконечным прокручиванием и высокой точностью.',
      priceMinor: 9000000, stock: 28,
      categoryId: catPeripherals.id, brandId: logitech.id,
      specs: [
        { key: 'dpi', label: 'Максимум DPI', value: '8000' },
        { key: 'connectivity', label: 'Соединение', value: 'Bluetooth + USB-C приёмник' },
        { key: 'battery', label: 'Батарея', value: '70 часов без зарядки' },
        { key: 'buttons', label: 'Кнопки', value: 'Многофункциональные' },
      ],
      tags: ['mouse', 'logitech', 'wireless', 'premium', 'productivity'],
    },
    {
      name: 'Razer DeathAdder V3 Pro Gaming Mouse',
      slug: 'razer-deathadder-v3-pro',
      sku: 'MOUSE-RAZER-DAV3-PRO',
      shortDescription: 'Игровая мышь, 30000 DPI, 650 часов батареи',
      description: 'Легчайшая игровая мышь с самым длительным временем батареи.',
      priceMinor: 8500000, stock: 35,
      categoryId: catPeripherals.id, brandId: razer.id,
      specs: [
        { key: 'dpi', label: 'Максимум DPI', value: '30000' },
        { key: 'weight', label: 'Вес', value: '63 гр' },
        { key: 'battery', label: 'Батарея', value: '650 часов' },
        { key: 'connectivity', label: 'Соединение', value: 'Гибридное (2.4ГГц + USB)' },
      ],
      tags: ['mouse', 'razer', 'gaming', 'wireless', 'lightweight'],
    },
    {
      name: 'SteelSeries Rival 5 Pro Wired Gaming Mouse',
      slug: 'steelseries-rival-5-pro',
      sku: 'MOUSE-STEELSERIES-RIVAL5',
      shortDescription: 'Проводная игровая мышь, 18000 DPI, 9 программируемых кнопок',
      description: 'Надёжная мышь для киберспорта с глубокой кастомизацией.',
      priceMinor: 5500000, stock: 42,
      categoryId: catPeripherals.id, brandId: treelabs.id,
      specs: [
        { key: 'dpi', label: 'Максимум DPI', value: '18000' },
        { key: 'connectivity', label: 'Соединение', value: 'Проводное USB' },
        { key: 'buttons', label: 'Кнопки', value: '9 программируемых' },
        { key: 'weight', label: 'Вес', value: '95 гр' },
      ],
      tags: ['mouse', 'steelseries', 'gaming', 'wired', 'esports'],
    },
    {
      name: 'Corsair K95 Platinum XT Mechanical Keyboard',
      slug: 'corsair-k95-platinum-xt',
      sku: 'KEYBOARD-CORSAIR-K95-XT',
      shortDescription: 'Механическая клавиатура, Cherry MX переключатели, RGB',
      description: 'Премиум механическая клавиатура для игр и работы.',
      priceMinor: 18000000, stock: 18,
      categoryId: catPeripherals.id, brandId: corsair.id,
      specs: [
        { key: 'switches', label: 'Переключатели', value: 'Cherry MX Speed' },
        { key: 'rgb', label: 'RGB подсветка', value: 'Per-key' },
        { key: 'connectivity', label: 'Соединение', value: 'USB проводное' },
        { key: 'macro_keys', label: 'Макро-клавиши', value: '6 G-клавиш' },
      ],
      tags: ['keyboard', 'corsair', 'mechanical', 'gaming', 'rgb'],
    },
    {
      name: 'Razer Huntsman V3 Pro Analog Gaming Keyboard',
      slug: 'razer-huntsman-v3-pro-analog',
      sku: 'KEYBOARD-RAZER-HV3-ANALOG',
      shortDescription: 'Механическая клавиатура с аналоговыми переключателями',
      description: 'Инновационная клавиатура с аналоговыми переключателями для максимального контроля.',
      priceMinor: 20000000, stock: 12,
      categoryId: catPeripherals.id, brandId: razer.id,
      specs: [
        { key: 'switches', label: 'Переключатели', value: 'Razer Analog Optical' },
        { key: 'connectivity', label: 'Соединение', value: 'USB + Bluetooth' },
        { key: 'rgb', label: 'RGB подсветка', value: 'Per-key' },
        { key: 'programmable', label: 'Программируемые', value: 'Да' },
      ],
      tags: ['keyboard', 'razer', 'mechanical', 'analog', 'gaming'],
    },
    {
      name: 'BenQ EW2880U 28" 4K Monitor',
      slug: 'benq-ew2880u-4k-monitor',
      sku: 'MONITOR-BENQ-EW2880U',
      shortDescription: '4K монитор 28", IPS панель, USB-C, высокий рейтинг цветопередачи',
      description: 'Профессиональный 4K монитор для дизайнеров и видеомонтажёров.',
      priceMinor: 35000000, stock: 8,
      categoryId: catPeripherals.id, brandId: benq.id,
      specs: [
        { key: 'resolution', label: 'Разрешение', value: '3840 × 2160 (4K)' },
        { key: 'panel_type', label: 'Тип панели', value: 'IPS' },
        { key: 'refresh_rate', label: 'Частота обновления', value: '60 Гц' },
        { key: 'color_accuracy', label: 'Точность цвета', value: 'Delta E < 2' },
        { key: 'connectivity', label: 'Разъёмы', value: 'USB-C, HDMI, DisplayPort' },
      ],
      tags: ['monitor', 'benq', '4k', 'professional', 'usb-c'],
    },
    {
      name: 'LG 27GN950-B 27" 4K Gaming Monitor',
      slug: 'lg-27gn950-b-gaming-4k',
      sku: 'MONITOR-LG-27GN950',
      shortDescription: '27" 4K, 144 Гц, USB-C, идеален для игр в 4K',
      description: 'Игровой 4K монитор с высокой частотой обновления.',
      priceMinor: 42000000, stock: 6,
      categoryId: catPeripherals.id, brandId: lg.id,
      specs: [
        { key: 'resolution', label: 'Разрешение', value: '3840 × 2160 (4K)' },
        { key: 'refresh_rate', label: 'Частота обновления', value: '144 Гц' },
        { key: 'panel_type', label: 'Тип панели', value: 'Nano IPS' },
        { key: 'response_time', label: 'Время отклика', value: '1 мс' },
        { key: 'hdmi', label: 'HDMI версия', value: '2.1' },
      ],
      tags: ['monitor', 'lg', '4k', 'gaming', '144hz'],
    },

// ── Cables & Connectors (Кабели) ────────────────────────────────────────
    {
      name: 'PCIE 5.0 12VHPWR Адаптер 12+4pin',
      slug: 'pcie-5-12vhpwr-adapter',
      sku: 'CABLE-PCIE5-ADAPTER',
      shortDescription: 'Адаптер для подключения RTX 4090, совместимость со старыми БП',
      description: 'Переходник для подключения новых видеокарт к старым блокам питания.',
      priceMinor: 1500000, stock: 120,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'connector', label: 'Разъём', value: '12+4pin (12VHPWR)' },
        { key: 'compatibility', label: 'Совместимость', value: 'PCIE 5.0 карты' },
        { key: 'material', label: 'Материал', value: 'Медь высокого качества' },
      ],
      tags: ['cable', 'adapter', 'pcie5', 'connector'],
    },
    {
      name: 'USB 3.2 Gen 2 Кабель Type-C to Type-C 2м',
      slug: 'usb-32-gen2-cable-2m',
      sku: 'CABLE-USB32-C-2M',
      shortDescription: '10 Гбит/с кабель для передачи данных',
      description: 'Быстрый кабель для подключения внешних SSD и других устройств.',
      priceMinor: 1200000, stock: 80,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'speed', label: 'Скорость', value: '10 Гбит/с' },
        { key: 'length', label: 'Длина', value: '2 метра' },
        { key: 'connector', label: 'Разъёмы', value: 'Type-C to Type-C' },
      ],
      tags: ['cable', 'usb', 'type-c', 'data-transfer'],
    },
    {
      name: 'DisplayPort 1.4 Кабель 8K 2м',
      slug: 'displayport-14-cable-8k-2m',
      sku: 'CABLE-DP14-8K-2M',
      shortDescription: 'Кабель для подключения мониторов 8K',
      description: 'Поддерживает разрешение 8K при 60 Гц и выше.',
      priceMinor: 1800000, stock: 60,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'version', label: 'Версия DP', value: '1.4' },
        { key: 'max_resolution', label: 'Макс. разрешение', value: '8K @ 60 Hz' },
        { key: 'length', label: 'Длина', value: '2 метра' },
      ],
      tags: ['cable', 'displayport', '8k', 'video'],
    },
    {
      name: 'SATA III Кабель 0.5м, красный',
      slug: 'sata-iii-cable-05m-red',
      sku: 'CABLE-SATA-05M-RED',
      shortDescription: 'Кабель для подключения HDD и SSD',
      description: 'Стандартный SATA кабель красного цвета.',
      priceMinor: 300000, stock: 200,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'connector', label: 'Разъём', value: 'SATA III (6 Гбит/с)' },
        { key: 'length', label: 'Длина', value: '0.5 метра' },
        { key: 'color', label: 'Цвет', value: 'Красный' },
      ],
      tags: ['cable', 'sata', 'storage'],
    },
    {
      name: 'Кабель управления вентиляторами PWM Splitter',
      slug: 'fan-pwm-splitter-cable',
      sku: 'CABLE-FAN-PWM-SPLIT',
      shortDescription: 'Разветвитель для подключения 4 вентиляторов на 1 разъём',
      description: 'Удобный разветвитель для управления несколькими вентиляторами.',
      priceMinor: 450000, stock: 150,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'connector', label: 'Разъём', value: '4-pin PWM' },
        { key: 'compatible_fans', label: 'Вентиляторы', value: '4 × 4-pin' },
        { key: 'material', label: 'Материал', value: 'Сверхпрочный пластик' },
      ],
      tags: ['cable', 'fan', 'splitter', 'pwm'],
    },

// ── Thermal Products (Термопаста и охлаждение) ────────────────────────
    {
      name: 'Noctua NT-H2 Термопаста 3.5г',
      slug: 'noctua-nt-h2-thermal-paste',
      sku: 'THERMAL-NOCTUA-NTH2',
      shortDescription: 'Премиум термопаста, очень хорошая теплопроводность',
      description: 'Профессиональная термопаста от Noctua с отличной производительностью.',
      priceMinor: 1200000, stock: 90,
      categoryId: catCables.id, brandId: noctua.id,
      specs: [
        { key: 'volume', label: 'Объём', value: '3.5 гр' },
        { key: 'thermal_conductivity', label: 'Теплопроводность', value: '8.1 Вт/мК' },
        { key: 'viscosity', label: 'Вязкость', value: 'Оптимальная' },
        { key: 'non_conductive', label: 'Электрическая проводимость', value: 'Не проводит' },
      ],
      tags: ['thermal', 'paste', 'noctua', 'premium'],
    },
    {
      name: 'Corsair TM30 Thermal Paste 2г',
      slug: 'corsair-tm30-thermal-paste',
      sku: 'THERMAL-CORSAIR-TM30',
      shortDescription: 'Надёжная термопаста, хорошее соотношение цены',
      description: 'Качественная термопаста за доступную цену.',
      priceMinor: 800000, stock: 110,
      categoryId: catCables.id, brandId: corsair.id,
      specs: [
        { key: 'volume', label: 'Объём', value: '2 гр' },
        { key: 'thermal_conductivity', label: 'Теплопроводность', value: '3.2 Вт/мК' },
        { key: 'application', label: 'Применение', value: 'Процессоры и видеокарты' },
      ],
      tags: ['thermal', 'paste', 'corsair', 'budget'],
    },
    {
      name: 'Thermal Pads 1.5мм 50×50мм 5шт',
      slug: 'thermal-pads-50x50-set',
      sku: 'THERMAL-PADS-50X50-5',
      shortDescription: 'Термопрокладки для чипов памяти и других компонентов',
      description: 'Удобный набор термопрокладок для модификации систем охлаждения.',
      priceMinor: 1500000, stock: 70,
      categoryId: catCables.id, brandId: treelabs.id,
      specs: [
        { key: 'thickness', label: 'Толщина', value: '1.5 мм' },
        { key: 'size', label: 'Размер', value: '50 × 50 мм' },
        { key: 'quantity', label: 'Количество', value: '5 шт' },
        { key: 'thermal_conductivity', label: 'Теплопроводность', value: '5.0 Вт/мК' },
      ],
      tags: ['thermal', 'pads', 'cooling', 'diy'],
    },
    // ── ВСТРОЕННЫЕ СИСТЕМЫ И МИКРОКОНТРОЛЛЕРЫ ──────────────────────────────

    // ── Мощные микроконтроллеры ────────────────────────────────────────
    {
      name: 'STM32H7 Nucleo-H743ZI Отладочная плата',
      slug: 'stm32h7-nucleo-h743zi',
      sku: 'EMB-STM32H743ZI',
      shortDescription: 'ARM Cortex-M7 @ 480MHz, 2MB Flash, полный функционал STM32',
      description: 'Мощная отладочная плата для промышленных приложений. Поддержка Ethernet, USB Host, DAC/ADC.',
      priceMinor: 3500000, stock: 22,
      categoryId: catEmbedded.id, brandId: nucleo.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M7 @ 480 MHz' },
        { key: 'flash', label: 'Flash память', value: '2 МБ' },
        { key: 'ram', label: 'RAM', value: '1 МБ' },
        { key: 'interfaces', label: 'Интерфейсы', value: 'Ethernet, USB, CAN, SPI, I2C' },
        { key: 'adc', label: 'АЦП', value: '16-канальный 12-bit' },
      ],
      tags: ['embedded', 'stm32', 'cortex-m7', 'industrial', 'ethernet'],
    },
    {
      name: 'Teensy 4.0 Ultra Fast Microcontroller',
      slug: 'teensy-4-0',
      sku: 'EMB-TEENSY-4.0',
      shortDescription: 'ARM Cortex-M7 @ 600MHz, самый быстрый Arduino-совместимый',
      description: 'Невероятно быстрый микроконтроллер для DSP приложений. Поддержка аналогового ввода/вывода.',
      priceMinor: 3200000, stock: 28,
      categoryId: catEmbedded.id, brandId: teensy.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M7 @ 600 MHz' },
        { key: 'ram', label: 'RAM', value: '512 KB + 16 MB PSRAM' },
        { key: 'adc', label: 'АЦП', value: '2 × 10-bit' },
        { key: 'dac', label: 'ЦАП', value: '1 × 12-bit' },
        { key: 'audio', label: 'Аудио', value: 'Встроенная поддержка' },
      ],
      tags: ['embedded', 'teensy', 'fast', 'dsp', 'audio'],
    },
    {
      name: 'M5Stack Core2 IoT Development Kit',
      slug: 'm5stack-core2-iot',
      sku: 'EMB-M5STACK-CORE2',
      shortDescription: 'ESP32 + цветной сенсорный экран 2" + батарея',
      description: 'Готовое решение для IoT приложений. Встроенный экран, акселерометр, микрофон.',
      priceMinor: 4500000, oldPriceMinor: 5500000, stock: 35,
      categoryId: catEmbedded.id, brandId: m5stack.id,
      specs: [
        { key: 'mcu', label: 'Микроконтроллер', value: 'ESP32 Dual-core' },
        { key: 'display', label: 'Дисплей', value: '2" TFT LCD 320×240' },
        { key: 'sensors', label: 'Сенсоры', value: 'Акселерометр, гиромагнитный' },
        { key: 'battery', label: 'Батарея', value: '390 мАч' },
        { key: 'io', label: 'Разъёмы', value: 'Пины GPIO, USB-C' },
      ],
      tags: ['embedded', 'esp32', 'iot', 'display', 'all-in-one'],
    },
    {
      name: 'OpenMV H7 Plus AI Vision Camera',
      slug: 'openmv-h7-plus',
      sku: 'EMB-OPENMV-H7PLUS',
      shortDescription: 'Микрокамера с AI, STM32H7, для компьютерного зрения',
      description: 'Специализированная плата для обработки изображений и машинного обучения.',
      priceMinor: 8500000, stock: 12,
      categoryId: catEmbedded.id, brandId: openmv.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'STM32H7 @ 480 MHz' },
        { key: 'camera', label: 'Камера', value: 'OV5640 5MP' },
        { key: 'ram', label: 'RAM', value: '3.2 МБ' },
        { key: 'features', label: 'Возможности', value: 'Face detection, ML, QR-коды' },
      ],
      tags: ['embedded', 'ai', 'vision', 'camera', 'machine-learning'],
    },
    {
      name: 'Raspberry Pi Pico W с WiFi',
      slug: 'raspberry-pi-pico-w-emb',
      sku: 'EMB-RPI-PICO-W',
      shortDescription: 'Мини микроконтроллер с WiFi, RP2040, 264KB RAM',
      description: 'Сверхкомпактный и дешёвый микроконтроллер с поддержкой WiFi.',
      priceMinor: 850000, stock: 150,
      categoryId: catEmbedded.id, brandId: pico.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M0+ Dual-core @ 133 MHz' },
        { key: 'ram', label: 'RAM', value: '264 KB' },
        { key: 'flash', label: 'Flash', value: '2 МБ' },
        { key: 'wifi', label: 'WiFi', value: '802.11b/g/n' },
        { key: 'bluetooth', label: 'Bluetooth', value: 'BLE 5.2' },
      ],
      tags: ['embedded', 'pico', 'rp2040', 'wifi', 'compact'],
    },
    {
      name: 'Arduino Nano 33 IoT с WiFi',
      slug: 'arduino-nano-33-iot',
      sku: 'EMB-ARDUINO-NANO33-IOT',
      shortDescription: 'Компактная Arduino с WiFi, Cortex-M0',
      description: 'Миниатюрная Arduino для IoT проектов. Совместима со всеми Arduino шилдами.',
      priceMinor: 2200000, stock: 55,
      categoryId: catEmbedded.id, brandId: arduino.id,
      specs: [
        { key: 'cpu', label: 'Процессор', value: 'ARM Cortex-M0 @ 48 MHz' },
        { key: 'ram', label: 'RAM', value: '32 KB' },
        { key: 'flash', label: 'Flash', value: '256 KB' },
        { key: 'wifi', label: 'WiFi', value: 'Built-in' },
        { key: 'cryptochip', label: 'Криптография', value: 'ATECC608A' },
      ],
      tags: ['embedded', 'arduino', 'iot', 'nano', 'secure'],
    },

// ── IoT и коммуникационные модули ────────────────────────────────────

    {
      name: 'ESP32-S3 WiFi + Bluetooth 5.0 SoC',
      slug: 'esp32-s3-wifi-ble',
      sku: 'IOT-ESP32S3',
      shortDescription: 'Микросхема с двойным ядром, WiFi 6 и Bluetooth 5.0',
      description: 'Следующее поколение ESP32. Потребляет меньше энергии, быстрее.',
      priceMinor: 1200000, stock: 85,
      categoryId: catIoT.id, brandId: espressif.id,
      specs: [
        { key: 'cores', label: 'Ядра', value: '2 × Xtensa 32-bit @ 240 MHz' },
        { key: 'ram', label: 'SRAM', value: '512 KB' },
        { key: 'wifi', label: 'WiFi', value: '802.11 a/b/g/n/ax (WiFi 6)' },
        { key: 'bluetooth', label: 'Bluetooth', value: '5.0 + BLE' },
        { key: 'interfaces', label: 'Интерфейсы', value: 'USB, SPI, I2C, I2S, UART' },
      ],
      tags: ['iot', 'wifi', 'bluetooth', 'esp32', 'wireless'],
    },
    {
      name: 'u-Blox SARA-R510S-100 LTE-M модуль',
      slug: 'u-blox-sara-r510s',
      sku: 'IOT-SARA-R510S',
      shortDescription: 'LTE-M/NB-IoT модуль для IoT, низкое энергопотребление',
      description: 'Профессиональный модуль для IoT приложений. Поддержка GPS.',
      priceMinor: 12500000, stock: 8,
      categoryId: catIoT.id, brandId: waveshare.id,
      specs: [
        { key: 'technology', label: 'Технология', value: 'LTE-M / NB-IoT' },
        { key: 'gnss', label: 'GNSS', value: 'GPS, GLONASS, BeiDou, Galileo' },
        { key: 'antenna', label: 'Антенна', value: 'Встроенная' },
        { key: 'interface', label: 'Интерфейс', value: 'UART, I2C, SPI' },
      ],
      tags: ['iot', 'lte', 'gnss', 'gps', 'nb-iot'],
    },
    {
      name: 'Dragino LoRa GPS HAT для Raspberry Pi',
      slug: 'dragino-lora-gps-hat',
      sku: 'IOT-DRAGINO-LORA-GPS',
      shortDescription: 'LoRa + GPS модуль для Raspberry Pi',
      description: 'Расширитель для Raspberry Pi с LoRa и GPS функциональностью.',
      priceMinor: 5500000, stock: 28,
      categoryId: catIoT.id, brandId: lora.id,
      specs: [
        { key: 'lora', label: 'LoRa', value: 'SX1276 915 MHz' },
        { key: 'gps', label: 'GPS', value: 'SIM28 с антенной' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI, UART' },
        { key: 'compatibility', label: 'Совместимость', value: '40-pin GPIO Raspberry Pi' },
      ],
      tags: ['iot', 'lora', 'gps', 'hat', 'raspberry-pi'],
    },
    {
      name: 'Adafruit AirLift WiFi Co-processor Board',
      slug: 'adafruit-airlift-wifi',
      sku: 'IOT-ADAFRUIT-AIRLIFT',
      shortDescription: 'Отдельный WiFi модуль для любых микроконтроллеров',
      description: 'Позволяет добавить WiFi к любому микроконтроллеру без встроенного WiFi.',
      priceMinor: 2800000, stock: 42,
      categoryId: catIoT.id, brandId: adafruit.id,
      specs: [
        { key: 'chip', label: 'Чип', value: 'ESP32' },
        { key: 'interface', label: 'Интерфейс', value: 'SPI + UART' },
        { key: 'wifi', label: 'WiFi', value: '802.11 b/g/n' },
        { key: 'size', label: 'Размер', value: 'Очень компактный' },
      ],
      tags: ['iot', 'wifi', 'coprocessor', 'adafruit', 'spi'],
    },
    {
      name: 'Seeed Studio Wio Terminal 4G Wireless',
      slug: 'seeed-wio-terminal-4g',
      sku: 'IOT-SEEED-WIO-4G',
      shortDescription: 'All-in-one IoT платформа с 4G LTE и сенсорным экраном',
      description: 'Готовое решение для IoT проектов. Экран, батарея, модули датчиков.',
      priceMinor: 8200000, stock: 15,
      categoryId: catIoT.id, brandId: seeed.id,
      specs: [
        { key: 'mcu', label: 'MCU', value: 'ATSAMD51P19 Cortex-M4' },
        { key: 'display', label: 'Дисплей', value: '2.4" LCD 320×240' },
        { key: 'cellular', label: 'Сотовая связь', value: 'LTE Cat-M1 / NB-IoT / GPRS' },
        { key: 'sensors', label: 'Встроенные датчики', value: 'Light, Sound, 5-axis IMU' },
      ],
      tags: ['iot', 'lte', 'display', 'all-in-one', 'wireless'],
    },

// ── Моторы и исполнители ────────────────────────────────────────────

    {
      name: '28BYJ-48 Шаговый мотор с драйвером ULN2003',
      slug: '28byj48-stepper-motor-driver',
      sku: 'MOTOR-28BYJ48',
      shortDescription: '5V шаговый мотор, 4-фазный, с готовым драйвером',
      description: 'Малогабаритный шаговый мотор для робототехники. Комплект с драйвером.',
      priceMinor: 1200000, stock: 95,
      categoryId: catActuatorsMotors.id, brandId: dfrobot.id,
      specs: [
        { key: 'voltage', label: 'Напряжение', value: '5V DC' },
        { key: 'steps', label: 'Шаги', value: '2048 на оборот' },
        { key: 'torque', label: 'Крутящий момент', value: '0.3 Нм' },
        { key: 'driver', label: 'Драйвер', value: 'ULN2003 в комплекте' },
        { key: 'pins', label: 'Контакты', value: '4 провода управления' },
      ],
      tags: ['motor', 'stepper', 'robotics', 'cheap', 'diy'],
    },
    {
      name: 'NEMA 17 Шаговый мотор 1.7A 48mm',
      slug: 'nema-17-stepper-motor',
      sku: 'MOTOR-NEMA17',
      shortDescription: 'Профессиональный шаговый мотор для 3D принтеров и ЧПУ',
      description: 'Стандартный мотор используется в большинстве 3D принтеров.',
      priceMinor: 3500000, stock: 45,
      categoryId: catActuatorsMotors.id, brandId: sparkfun.id,
      specs: [
        { key: 'voltage', label: 'Напряжение', value: '12V DC' },
        { key: 'current', label: 'Ток на фазу', value: '1.7A' },
        { key: 'holding_torque', label: 'Удерживаемый момент', value: '0.4 Нм' },
        { key: 'step_angle', label: 'Угол шага', value: '1.8°' },
        { key: 'size', label: 'Размер', value: 'NEMA 17' },
      ],
      tags: ['motor', 'stepper', '3d-printer', 'cnc', 'nema17'],
    },
    {
      name: 'MG996R Digital Servo Motor 180° 20kg',
      slug: 'mg996r-servo-motor',
      sku: 'MOTOR-MG996R',
      shortDescription: 'Мощный сервомотор, 20кг момент, металлические шестерни',
      description: 'Профессиональный сервомотор для робототехники и моделирования.',
      priceMinor: 2500000, stock: 65,
      categoryId: catActuatorsMotors.id, brandId: sparkfun.id,
      specs: [
        { key: 'voltage', label: 'Напряжение', value: '4.8-6V' },
        { key: 'torque', label: 'Крутящий момент', value: '20 кг·см @ 6V' },
        { key: 'speed', label: 'Скорость', value: '0.11 сек/60°' },
        { key: 'range', label: 'Диапазон', value: '180°' },
        { key: 'gear', label: 'Шестерни', value: 'Металлические' },
      ],
      tags: ['servo', 'motor', 'robotics', 'metal-gear', 'high-torque'],
    },
    {
      name: 'DC Motor L298N 5V Motor Driver Module',
      slug: 'l298n-dc-motor-driver',
      sku: 'MOTOR-L298N-DRIVER',
      shortDescription: 'Драйвер для управления DC моторами, двойной канал',
      description: 'Двухканальный модуль для управления скоростью и направлением DC моторов.',
      priceMinor: 550000, stock: 120,
      categoryId: catActuatorsMotors.id, brandId: dfrobot.id,
      specs: [
        { key: 'logic_voltage', label: 'Напряжение логики', value: '5V' },
        { key: 'motor_voltage', label: 'Напряжение мотора', value: '5-35V' },
        { key: 'current', label: 'Макс. ток', value: '2A на канал' },
        { key: 'channels', label: 'Каналов', value: '2 (dual channel)' },
        { key: 'ic', label: 'Интегральная схема', value: 'L298N' },
      ],
      tags: ['motor', 'driver', 'dc', 'pwm', 'control'],
    },
    {
      name: 'Relay Module 4-Channel 5V Optoisolated',
      slug: 'relay-module-4ch-optoisolated',
      sku: 'RELAY-4CH-OPT',
      shortDescription: '4 канала реле с оптоизоляцией для управления мощными нагрузками',
      description: 'Позволяет управлять высоковольтными нагрузками от микроконтроллера безопасно.',
      priceMinor: 1500000, stock: 80,
      categoryId: catActuatorsMotors.id, brandId: dfrobot.id,
      specs: [
        { key: 'channels', label: 'Каналов', value: '4' },
        { key: 'logic_voltage', label: 'Напряжение логики', value: '5V' },
        { key: 'relay_voltage', label: 'Напряжение реле', value: '10-30V' },
        { key: 'max_current', label: 'Макс. ток', value: '10A на канал' },
        { key: 'isolation', label: 'Изоляция', value: 'Оптоизоляция' },
      ],
      tags: ['relay', 'actuator', 'power-control', 'optoisolated'],
    },
    {
      name: 'Solenoid Push-Pull 12V 5kg Force',
      slug: 'solenoid-12v-5kg',
      sku: 'SOLENOID-12V',
      shortDescription: 'Электромагнит толкающий/вытягивающий, 12V, 5кг силы',
      description: 'Мощный соленоид для дверных замков, прессов и механизмов.',
      priceMinor: 3200000, stock: 42,
      categoryId: catActuatorsMotors.id, brandId: sparkfun.id,
      specs: [
        { key: 'voltage', label: 'Напряжение', value: '12V DC' },
        { key: 'force', label: 'Сила', value: '5 кг' },
        { key: 'stroke', label: 'Ход', value: '20 мм' },
        { key: 'duty_cycle', label: 'Рабочий цикл', value: '100% continuous' },
        { key: 'connection', label: 'Разъём', value: 'Две клеммы' },
      ],
      tags: ['solenoid', 'actuator', 'electromagnet', 'lock'],
    },

// ── Датчики и модули сенсоров ──────────────────────────────────────────

    {
      name: 'BMP390 Датчик давления и температуры',
      slug: 'bmp390-pressure-temp',
      sku: 'SENSOR-BMP390',
      shortDescription: 'Цифровой датчик давления и высоты, I2C/SPI, высокая точность',
      description: 'Точный датчик для метеостанций, дронов и климат-контроля.',
      priceMinor: 1800000, stock: 65,
      categoryId: catSensors.id, brandId: bosch.id,
      specs: [
        { key: 'pressure_range', label: 'Диапазон давления', value: '300-1100 hPa' },
        { key: 'accuracy', label: 'Точность', value: '±0.5 hPa' },
        { key: 'temperature_range', label: 'Температура', value: '-40…+85°C' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
      ],
      tags: ['sensor', 'pressure', 'altitude', 'weather', 'i2c'],
    },
    {
      name: 'MLX90640 Тепловизионный сенсор 32×24',
      slug: 'mlx90640-thermal-camera',
      sku: 'SENSOR-MLX90640',
      shortDescription: 'Тепловизионный массив, IR камера 32×24 пиксела',
      description: 'Инфракрасная матрица для создания тепловизионных изображений.',
      priceMinor: 9500000, stock: 18,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'resolution', label: 'Разрешение', value: '32×24 пиксела' },
        { key: 'fov', label: 'Поле зрения', value: '55°' },
        { key: 'refresh_rate', label: 'Частота кадров', value: '0.5-64 Гц' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'range', label: 'Диапазон температур', value: '-40…+300°C' },
      ],
      tags: ['sensor', 'thermal', 'infrared', 'ir-camera', 'high-end'],
    },
    {
      name: 'MAX30102 Пульсоксиметр датчик',
      slug: 'max30102-pulse-oximeter',
      sku: 'SENSOR-MAX30102',
      shortDescription: 'Оптический датчик частоты пульса и уровня кислорода',
      description: 'Интегрированный датчик для носимых медицинских устройств.',
      priceMinor: 1500000, stock: 48,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'channels', label: 'Каналы', value: 'Red + IR LED' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'output', label: 'Выход', value: 'Цифровой 18-bit' },
        { key: 'power', label: 'Энергопотребление', value: '< 1 mA (low power)' },
      ],
      tags: ['sensor', 'biomedical', 'heart-rate', 'pulse', 'wearable'],
    },
    {
      name: 'ACS712 Датчик тока 5A/20A/30A',
      slug: 'acs712-current-sensor',
      sku: 'SENSOR-ACS712',
      shortDescription: 'Датчик переменного и постоянного тока с гальванической изоляцией',
      description: 'Позволяет точно измерять ток без разрыва цепи.',
      priceMinor: 850000, stock: 85,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'range', label: 'Диапазон', value: '±5A, ±20A, ±30A (варианты)' },
        { key: 'output', label: 'Выход', value: 'Аналоговое 0-5V' },
        { key: 'isolation', label: 'Изоляция', value: 'Гальваническая' },
        { key: 'interface', label: 'Интерфейс', value: 'Аналоговый AO' },
      ],
      tags: ['sensor', 'current', 'power-monitoring', 'analog'],
    },
    {
      name: 'LSM6DS3 6-Axis IMU with Temperature',
      slug: 'lsm6ds3-imu-6axis',
      sku: 'SENSOR-LSM6DS3',
      shortDescription: '6 DOF инерциальный модуль (акселерометр + гироскоп)',
      description: 'Компактный 6-осевой датчик для навигации и стабилизации.',
      priceMinor: 1200000, stock: 72,
      categoryId: catSensors.id, brandId: stmicro.id,
      specs: [
        { key: 'accelerometer', label: 'Акселерометр', value: '±2/±4/±8/±16 g' },
        { key: 'gyroscope', label: 'Гироскоп', value: '±125/±250/±500/±1000/±2000 dps' },
        { key: 'temperature', label: 'Температура', value: 'Встроенный датчик' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C / SPI' },
      ],
      tags: ['sensor', 'imu', 'motion', 'accelerometer', 'gyro'],
    },
    {
      name: 'AS5600 Magnetic Rotary Position Sensor',
      slug: 'as5600-magnetic-encoder',
      sku: 'SENSOR-AS5600',
      shortDescription: 'Магнитный датчик положения вала, 12-bit разрешение',
      description: 'Позволяет отслеживать угловое положение без механического контакта.',
      priceMinor: 1800000, stock: 55,
      categoryId: catSensors.id, brandId: sparkfun.id,
      specs: [
        { key: 'resolution', label: 'Разрешение', value: '12-bit (4096 позиций)' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C' },
        { key: 'accuracy', label: 'Точность', value: '±0.05°' },
        { key: 'magnet', label: 'Требуемый магнит', value: 'Диаметр 6-10мм' },
      ],
      tags: ['sensor', 'encoder', 'position', 'magnetic', 'rotary'],
    },

// ── Расширители и шилды ────────────────────────────────────────────────

    {
      name: 'Raspberry Pi Sense HAT с датчиками и LED матрицей',
      slug: 'rpi-sense-hat',
      sku: 'SHIELD-RPI-SENSE-HAT',
      shortDescription: 'Официальный HAT: акселерометр, гироскоп, магнетометр, давление, влажность, 8x8 LED',
      description: 'Полный набор датчиков для образовательных проектов.',
      priceMinor: 4200000, stock: 32,
      categoryId: catExpansion.id, brandId: raspberry.id,
      specs: [
        { key: 'sensors', label: 'Датчики', value: 'IMU + Pressure + Humidity' },
        { key: 'display', label: 'Дисплей', value: '8×8 RGB LED матрица' },
        { key: 'joystick', label: 'Джойстик', value: 'Встроенный' },
        { key: 'interface', label: 'Интерфейс', value: 'I2C + 40-pin GPIO' },
      ],
      tags: ['shield', 'hat', 'sensors', 'led-matrix', 'raspberry-pi'],
    },
    {
      name: 'Arduino Motor Shield R3',
      slug: 'arduino-motor-shield-r3',
      sku: 'SHIELD-ARDUINO-MOTOR-R3',
      shortDescription: 'Официальный шилд Arduino для управления 4 DC моторами',
      description: 'Готовое решение для робототехники на базе Arduino.',
      priceMinor: 3500000, stock: 38,
      categoryId: catExpansion.id, brandId: arduino.id,
      specs: [
        { key: 'motor_channels', label: 'Каналов моторов', value: '4' },
        { key: 'voltage', label: 'Напряжение питания', value: '6-12V' },
        { key: 'current', label: 'Макс. ток', value: '2A на канал' },
        { key: 'ics', label: 'ИС', value: 'L298P микросхемы' },
      ],
      tags: ['shield', 'motor-control', 'arduino', 'robotics'],
    },
    {
      name: 'Seeed Grove Base Shield для Arduino',
      slug: 'seeed-grove-base-shield',
      sku: 'SHIELD-SEEED-GROVE',
      shortDescription: '10 Grove портов для подключения датчиков без пайки',
      description: 'Система Grove позволяет собирать проекты без спайки.',
      priceMinor: 1800000, stock: 55,
      categoryId: catExpansion.id, brandId: grove.id,
      specs: [
        { key: 'ports', label: 'Портов Grove', value: '10' },
        { key: 'compatibility', label: 'Совместимость', value: 'Arduino Uno/Mega' },
        { key: 'i2c_ports', label: 'I2C портов', value: '4' },
        { key: 'analog_ports', label: 'Аналоговых портов', value: '4' },
      ],
      tags: ['shield', 'grove', 'sensors', 'no-soldering'],
    },
    {
      name: 'Adafruit Feather RP2040 Adalogger',
      slug: 'adafruit-feather-rp2040-adalogger',
      sku: 'SHIELD-ADAFRUIT-FEATHER-LOG',
      shortDescription: 'Feather плата с SD картой и батареей',
      description: 'Полнофункциональное решение для логирования данных.',
      priceMinor: 2500000, stock: 28,
      categoryId: catExpansion.id, brandId: adafruit.id,
      specs: [
        { key: 'mcu', label: 'MCU', value: 'Raspberry Pi RP2040' },
        { key: 'storage', label: 'Хранилище', value: 'MicroSD до 32GB' },
        { key: 'battery', label: 'Батарея', value: '200mAh встроенная' },
        { key: 'charging', label: 'Зарядка', value: 'USB-C с автоматической регулировкой' },
      ],
      tags: ['shield', 'feather', 'sd-card', 'data-logging', 'wearable'],
    },
    {
      name: 'Pimoroni PiCade XL Arcade Module',
      slug: 'pimoroni-picade-xl-arcade',
      sku: 'SHIELD-PIMORONI-PICADE',
      shortDescription: 'Модуль для создания аркадного контроллера на Raspberry Pi',
      description: 'Готовое решение для создания ретро аркады.',
      priceMinor: 8500000, stock: 12,
      categoryId: catExpansion.id, brandId: pimoroni.id,
      specs: [
        { key: 'buttons', label: 'Кнопок', value: '20+' },
        { key: 'joystick', label: 'Джойстики', value: '2 × аналоговых' },
        { key: 'trackball', label: 'Трекбол', value: 'Встроенный' },
        { key: 'compatibility', label: 'Совместимость', value: 'Raspberry Pi 3/4' },
      ],
      tags: ['shield', 'arcade', 'game', 'pimoroni', 'gaming'],
    },

// ── Наборы для разработки ──────────────────────────────────────────────

    {
      name: 'Arduino Ultimate Starter Kit (набор из 100+ компонентов)',
      slug: 'arduino-ultimate-starter-kit',
      sku: 'KIT-ARDUINO-ULTIMATE',
      shortDescription: 'Полный набор с Arduino Uno, датчиками, моторами, экраном, кейсом',
      description: 'Всё необходимое для начинающих и опытных разработчиков.',
      priceMinor: 8500000, oldPriceMinor: 10500000, stock: 22,
      categoryId: catDevelopment.id, brandId: arduino.id,
      specs: [
        { key: 'mcu', label: 'Плата', value: 'Arduino Uno x2' },
        { key: 'components', label: 'Компонентов', value: '100+' },
        { key: 'sensors', label: 'Датчики', value: '20+ видов' },
        { key: 'accessories', label: 'Аксессуары', value: 'Кейс, провода, макетная плата' },
      ],
      tags: ['kit', 'starter', 'arduino', 'educational', 'all-in-one'],
    },
    {
      name: 'Raspberry Pi Learning Kit с книгой',
      slug: 'raspberry-pi-learning-kit',
      sku: 'KIT-RPI-LEARNING',
      shortDescription: 'Raspberry Pi 4 + датчики + видеокурс + книга на русском',
      description: 'Обучающий набор с полной документацией.',
      priceMinor: 12500000, stock: 15,
      categoryId: catDevelopment.id, brandId: raspberry.id,
      specs: [
        { key: 'board', label: 'Плата', value: 'Raspberry Pi 4 (4GB)' },
        { key: 'sensors', label: 'Датчики', value: '10+ видов' },
        { key: 'book', label: 'Книга', value: 'Русский + English' },
        { key: 'accessories', label: 'Аксессуары', value: 'Кейс, кулер, БП' },
      ],
      tags: ['kit', 'educational', 'raspberry-pi', 'learning', 'book'],
    },
    {
      name: 'DFRobot IoT Learning Kit для Smart Home',
      slug: 'dfrobot-iot-smart-home-kit',
      sku: 'KIT-DFROBOT-IOT-SMART',
      shortDescription: 'Набор для создания умного дома: датчики, реле, WiFi модули',
      description: 'Проектный набор для создания системы умного дома.',
      priceMinor: 15800000, stock: 8,
      categoryId: catDevelopment.id, brandId: dfrobot.id,
      specs: [
        { key: 'mcu', label: 'MCU', value: 'Arduino + ESP8266' },
        { key: 'sensors', label: 'Датчики', value: 'Температура, влажность, свет, дверь' },
        { key: 'modules', label: 'Модули', value: 'WiFi, Relay, LCD' },
        { key: 'documentation', label: 'Документация', value: 'Полные схемы и код' },
      ],
      tags: ['kit', 'iot', 'smart-home', 'wifi', 'automation'],
    },
    {
      name: 'SparkFun Robotics Starter Kit с машиной',
      slug: 'sparkfun-robotics-starter-kit',
      sku: 'KIT-SPARKFUN-ROBOTICS',
      shortDescription: 'Готовое 2-колёсное роботическое шасси с Arduino',
      description: 'Собираемый робот для изучения робототехники.',
      priceMinor: 9200000, stock: 18,
      categoryId: catDevelopment.id, brandId: sparkfun.id,
      specs: [
        { key: 'chassis', label: 'Шасси', value: '2-колёсное с моторами' },
        { key: 'mcu', label: 'MCU', value: 'Arduino-совместимая плата' },
        { key: 'sensors', label: 'Датчики', value: 'Дальномер + линейные' },
        { key: 'tools', label: 'Инструменты', value: 'Отвёртки и разъёмы в комплекте' },
      ],
      tags: ['kit', 'robotics', 'robot', 'mobile', 'diy'],
    },
    {
      name: 'Seeed Studio AI Vision Kit с Jetson Nano',
      slug: 'seeed-ai-vision-jetson-nano',
      sku: 'KIT-SEEED-AI-JETSON',
      shortDescription: 'Jetson Nano + камера + сенсоры для AI/ML проектов',
      description: 'Набор для создания систем с искусственным интеллектом.',
      priceMinor: 18500000, stock: 6,
      categoryId: catDevelopment.id, brandId: seeed.id,
      specs: [
        { key: 'sbc', label: 'SBC', value: 'NVIDIA Jetson Nano' },
        { key: 'camera', label: 'Камера', value: '5MP IMX219' },
        { key: 'memory', label: 'Память', value: '64-bit ARM, 4GB LPDDR4' },
        { key: 'ai_framework', label: 'Фреймворк', value: 'TensorFlow, PyTorch' },
      ],
      tags: ['kit', 'ai', 'machine-learning', 'jetson', 'vision'],
    },

// ── Однопланатные компьютеры ───────────────────────────────────────────

    {
      name: 'Raspberry Pi 5 (8GB RAM)',
      slug: 'raspberry-pi-5-8gb',
      sku: 'SBC-RPI5-8GB',
      shortDescription: 'Новое поколение Raspberry Pi, Cortex-A72 @ 2.4GHz, 8GB RAM',
      description: 'Самый мощный Raspberry Pi на сегодняшний день.',
      priceMinor: 8500000, oldPriceMinor: 10000000, stock: 12,
      categoryId: catSingle.id, brandId: raspberry.id,
      specs: [
        { key: 'cpu', label: 'CPU', value: 'ARM Cortex-A72 (64-bit) × 4 @ 2.4 GHz' },
        { key: 'ram', label: 'RAM', value: '8 ГБ LPDDR5' },
        { key: 'storage', label: 'Хранилище', value: 'MicroSD (UHS-II)' },
        { key: 'connectivity', label: 'Подключение', value: 'WiFi 6E, Gigabit Ethernet, BLE 5.3' },
        { key: 'video', label: 'Видеовыход', value: '2 × HDMI, DSI' },
      ],
      tags: ['sbc', 'raspberry-pi', 'arm', 'powerful', '8gb-ram'],
    },
    {
      name: 'NVIDIA Jetson Nano 2GB Developer Kit',
      slug: 'nvidia-jetson-nano-2gb',
      sku: 'SBC-JETSON-NANO-2GB',
      shortDescription: 'AI ускоритель, 2GB RAM, 128-core GPU, идеален для AI',
      description: 'Специализированный компьютер для машинного обучения и AI.',
      priceMinor: 12500000, stock: 8,
      categoryId: catSingle.id, brandId: jetson.id,
      specs: [
        { key: 'cpu', label: 'CPU', value: 'ARM Cortex-A57 (64-bit) × 4' },
        { key: 'gpu', label: 'GPU', value: '128-core NVIDIA Maxwell' },
        { key: 'ram', label: 'RAM', value: '2 ГБ LPDDR4' },
        { key: 'storage', label: 'Хранилище', value: 'MicroSD' },
        { key: 'power', label: 'Питание', value: '5V 4A' },
      ],
      tags: ['sbc', 'jetson', 'ai', 'gpu', 'machine-learning'],
    },
    {
      name: 'Orange Pi 5 Plus (8GB, RK3588)',
      slug: 'orange-pi-5-plus',
      sku: 'SBC-ORANGE-PI5-8GB',
      shortDescription: 'Альтернатива Raspberry Pi, RK3588, 8GB RAM, Gigabit Ethernet',
      description: 'Мощный однопланатный компьютер с отличным соотношением цены.',
      priceMinor: 6500000, stock: 18,
      categoryId: catSingle.id, brandId: treelabs.id,
      specs: [
        { key: 'cpu', label: 'CPU', value: 'Rockchip RK3588 (8-core 64-bit)' },
        { key: 'ram', label: 'RAM', value: '8 ГБ LPDDR5' },
        { key: 'storage', label: 'Storage', value: 'MicroSD' },
        { key: 'ethernet', label: 'Ethernet', value: 'Gigabit RJ45' },
        { key: 'wifi', label: 'WiFi', value: '802.11 a/b/g/n/ac/ax' },
      ],
      tags: ['sbc', 'orange-pi', 'rk3588', 'alternative', 'budget'],
    },
    {
      name: 'ROCK Pi 4 Model B+ (4GB)',
      slug: 'rock-pi-4-model-b-plus',
      sku: 'SBC-ROCK-PI4BP-4GB',
      shortDescription: 'Rockchip RK3399, 4GB RAM, USB 3.0, PCIe 4x',
      description: 'Мощный однопланатный компьютер для сложных приложений.',
      priceMinor: 5800000, stock: 14,
      categoryId: catSingle.id, brandId: treelabs.id,
      specs: [
        { key: 'cpu', label: 'CPU', value: 'Rockchip RK3399 (6-core 64-bit)' },
        { key: 'ram', label: 'RAM', value: '4 ГБ LPDDR4' },
        { key: 'usb', label: 'USB', value: '1 × USB 3.0 + 2 × USB 2.0' },
        { key: 'ethernet', label: 'Ethernet', value: 'Gigabit + PoE' },
        { key: 'pcie', label: 'PCIe', value: '4x (для расширения)' },
      ],
      tags: ['sbc', 'rock-pi', 'rk3399', 'powerful', 'pcie'],
    },
    {
      name: 'Khadas Vim4 Media Center (8GB)',
      slug: 'khadas-vim4-8gb',
      sku: 'SBC-KHADAS-VIM4-8GB',
      shortDescription: 'Amlogic A311D2, 8GB RAM, идеален для медиа-центра и AI',
      description: 'Высокопроизводительный компьютер с поддержкой 8K видео.',
      priceMinor: 9200000, stock: 9,
      categoryId: catSingle.id, brandId: treelabs.id,
      specs: [
        { key: 'cpu', label: 'CPU', value: 'Amlogic A311D2 (8-core)' },
        { key: 'gpu', label: 'GPU', value: 'Mali-G52 MP4' },
        { key: 'ram', label: 'RAM', value: '8 ГБ LPDDR4' },
        { key: 'storage', label: 'Storage', value: '32/64 ГБ eMMC' },
        { key: 'video', label: 'Видео', value: 'до 8K @ 60fps' },
      ],
      tags: ['sbc', 'khadas', 'media-center', '8k', 'ai'],
    },

// ── Дополнительные компоненты Edge Computing ────────────────────────

    {
      name: 'Google Coral TPU Accelerator (USB 3.1)',
      slug: 'google-coral-tpu-usb',
      sku: 'EDGE-CORAL-TPU-USB',
      shortDescription: 'Ускоритель для TensorFlow Lite моделей, USB подключение',
      description: 'Позволяет запускать AI модели быстро на любом компьютере.',
      priceMinor: 6500000, stock: 11,
      categoryId: catEdge.id, brandId: treelabs.id,
      specs: [
        { key: 'ai_acceleration', label: 'Ускорение', value: 'Edge TPU' },
        { key: 'interface', label: 'Интерфейс', value: 'USB 3.1' },
        { key: 'compatibility', label: 'Совместимость', value: 'TensorFlow Lite' },
        { key: 'power', label: 'Питание', value: 'От USB (макс. 2W)' },
      ],
      tags: ['edge', 'ai', 'tpu', 'inference', 'accelerator'],
    },
    {
      name: 'Intel Movidius Neural Compute Stick 2',
      slug: 'intel-movidius-ncs2',
      sku: 'EDGE-INTEL-NCS2',
      shortDescription: 'USB ускоритель для OpenVINO и нейросетей',
      description: 'Для развертывания AI моделей на краю сети.',
      priceMinor: 8500000, stock: 7,
      categoryId: catEdge.id, brandId: intel.id,
      specs: [
        { key: 'framework', label: 'Фреймворк', value: 'OpenVINO, TensorFlow, Caffe' },
        { key: 'interface', label: 'Интерфейс', value: 'USB 3.0' },
        { key: 'inference', label: 'Скорость инференса', value: 'до 16 TOPS' },
      ],
      tags: ['edge', 'ai', 'accelerator', 'openvino', 'inference'],
    },
    {
      name: 'Hailo-8 AI Accelerator Module',
      slug: 'hailo-8-accelerator',
      sku: 'EDGE-HAILO8',
      shortDescription: 'Мощный AI ускоритель, 26 TOPS, PCIe interface',
      description: 'Профессиональный ускоритель для промышленных приложений.',
      priceMinor: 28500000, stock: 3,
      categoryId: catEdge.id, brandId: treelabs.id,
      specs: [
        { key: 'performance', label: 'Производительность', value: '26 TOPS INT8' },
        { key: 'interface', label: 'Интерфейс', value: 'PCIe 3.0 x4' },
        { key: 'power', label: 'Питание', value: '~10W' },
        { key: 'frameworks', label: 'Фреймворки', value: 'Any (HAI compiler)' },
      ],
      tags: ['edge', 'ai', 'professional', 'high-performance', 'inference'],
    },
    {
      name: 'TinyML BLE Sensor Module для Edge AI',
      slug: 'tinyml-ble-sensor-module',
      sku: 'EDGE-TINYML-BLE',
      shortDescription: 'Компактный модуль для запуска ML моделей на BLE устройствах',
      description: 'Для построения умных носимых устройств и сенсоров.',
      priceMinor: 3200000, stock: 25,
      categoryId: catEdge.id, brandId: tinymicrocontrollers.id,
      specs: [
        { key: 'mcu', label: 'MCU', value: 'ARM Cortex-M4 @ 64MHz' },
        { key: 'ram', label: 'RAM', value: '256 KB' },
        { key: 'ml_framework', label: 'ML фреймворк', value: 'TensorFlow Lite Micro' },
        { key: 'sensors', label: 'Датчики', value: 'IMU 6-axis встроенный' },
        { key: 'battery_life', label: 'Время работы', value: 'недели на батарее' },
      ],
      tags: ['edge', 'tinyml', 'wearable', 'ble', 'low-power'],
    },
    {
      name: 'Seeeduino nRF52840 Sense Board с датчиками',
      slug: 'seeeduino-nrf52840-sense',
      sku: 'EDGE-SEED-NRF52840',
      shortDescription: 'BLE микроконтроллер с 9-axis IMU, микрофон, датчик света',
      description: 'Полнофункциональная плата для IoT и носимых устройств.',
      priceMinor: 3800000, stock: 32,
      categoryId: catEmbedded.id, brandId: seeed.id,
      specs: [
        { key: 'mcu', label: 'MCU', value: 'nRF52840 ARM Cortex-M4' },
        { key: 'sensors', label: 'Встроенные датчики', value: '9-axis IMU, Microphone, Light' },
        { key: 'battery', label: 'Батарея', value: '640mAh' },
        { key: 'charging', label: 'Зарядка', value: 'USB-C' },
        { key: 'memory', label: 'Память', value: '1 МБ Flash, 256 KB RAM' },
      ],
      tags: ['embedded', 'ble', 'wearable', 'sensors', 'nrf52'],
    },
  ];

  const slugMap = new Map<string, any>();
  let hasDuplicates = false;

  for (const p of products) {
    if (slugMap.has(p.slug)) {
      const existingProduct = slugMap.get(p.slug);
      console.error(`🚨 КРИТИЧЕСКАЯ ОШИБКА: Обнаружен дубликат слага "${p.slug}"!`);
      console.error(`  Товар №1: Name: "${existingProduct.name}", SKU: "${existingProduct.sku}"`);
      console.error(`  Товар №2: Name: "${p.name}", SKU: "${p.sku}"`);
      console.error(`──────────────────────────────────────────────────`);
      hasDuplicates = true;
    }
    slugMap.set(p.slug, p);
  }

  if (hasDuplicates) {
    throw new Error("Остановка сида: обнаружены дублирующиеся слаги в массиве товаров.");
  }
  
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
