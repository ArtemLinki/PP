import { Box, Text, Stack, SimpleGrid } from '@mantine/core';
import { DualModeSearchBar } from '@/components/search/DualModeSearchBar';
import { Eyebrow } from '@/components/ui/Eyebrow';

const features = [
  {
    num: '01 · СОВМЕСТИМОСТЬ',
    title: 'Проверка пин-аутов',
    desc: 'ИИ сверяет напряжения, протоколы (I²C, SPI, UART). Не даст собрать несовместимое.',
  },
  {
    num: '02 · СКЛАД',
    title: 'В наличии — в один клик',
    desc: 'Подбор только из того, что лежит на складе. Альтернативы — если основное закончилось.',
  },
  {
    num: '03 · BOM',
    title: 'Сохранить как сборку',
    desc: 'Каждый проект сохраняется в BOM с артикулами. Поделиться ссылкой одним кликом.',
  },
];

const chips = ['Собрать ПК', 'Система умного дома', 'Робот-пылесос на Arduino', 'FPV-дрон до 50к', 'Метеостанция ESP32'];

export default function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        className="te-container"
        py={{ base: 40, sm: 80 }}
        style={{ textAlign: 'center' }}
      >
        <Stack align="center" gap="lg" maw={720} mx="auto">
          <Eyebrow>AI ENGINEER · ONLINE</Eyebrow>

          <Text
            fz={{ base: 32, sm: 48, md: 56 }}
            fw={700}
            c="var(--te-text)"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.08, textWrap: 'balance' }}
          >
            Техника, которая собирает сама себя.{' '}
            <Text component="span" inherit c="teal.6">Спросите ИИ.</Text>
          </Text>

          <Text c="var(--te-muted)" size="sm" maw={480} style={{ textWrap: 'pretty' }}>
            Опишите проект — нейросеть подберёт совместимые компоненты, проверит характеристики, соберёт сборку под бюджет.
          </Text>

          {/* DualModeSearchBar */}
          <Box w="100%" maw={600}>
            <DualModeSearchBar size="lg" />
          </Box>

          {/* Example chips */}
          <Box>
            <Text size="10px" ff="JetBrains Mono" c="var(--te-muted)" style={{ letterSpacing: '0.12em', marginBottom: 8 }}>
              ПРИМЕРЫ ЗАПРОСОВ
            </Text>
            <Box style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {chips.map((chip) => (
                <ChipButton key={chip} label={chip} />
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Features */}
      <Box
        className="te-container"
        pb={{ base: 48, sm: 80 }}
        style={{ borderTop: '1px solid var(--te-line)' }}
      >
        <SimpleGrid cols={{ base: 1, sm: 3 }} pt={40} style={{ gap: 0 }}>
          {features.map((f, i) => (
            <Box
              key={f.num}
              p={{ base: 'md', sm: 'xl' }}
              style={{
                borderRight: i < features.length - 1 ? '1px solid var(--te-line)' : undefined,
              }}
            >
              <Text size="10px" ff="JetBrains Mono" c="var(--te-muted)" style={{ letterSpacing: '0.12em', marginBottom: 8 }}>
                {f.num}
              </Text>
              <Text fw={600} c="var(--te-text)" mb={8} size="sm">
                {f.title}
              </Text>
              <Text size="sm" c="var(--te-muted)" style={{ lineHeight: 1.6 }}>
                {f.desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

function ChipButton({ label }: { label: string }) {
  return (
    <a
      href={`/catalog?search=${encodeURIComponent(label)}`}
      style={{
        background: 'var(--te-surface)',
        border: '1px solid var(--te-line)',
        color: 'var(--te-text)',
        fontFamily: 'JetBrains Mono',
        fontSize: 12,
        padding: '6px 12px',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  );
}
