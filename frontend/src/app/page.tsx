'use client';

import { Container, Title, Text, Stack, Group, Badge, Box } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';

export default function HomePage() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#121826',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container size="lg">
        <Stack align="center" gap="xl">
          <Group gap="xs">
            <IconBolt size={16} color="#00d4b5" />
            <Text
              size="xs"
              fw={600}
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                color: '#00d4b5',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              AI ENGINEER · ONLINE
            </Text>
          </Group>

          <Title
            order={1}
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Найди идеальные{' '}
            <span style={{ color: '#00d4b5' }}>комплектующие</span>
            <br />
            с помощью AI
          </Title>

          <Text
            size="lg"
            c="dimmed"
            maw={560}
            ta="center"
            style={{ lineHeight: 1.6 }}
          >
            TechElectro — интернет-магазин компьютерных комплектующих с умным AI-помощником.
            Подберём конфигурацию, сравним характеристики, добавим в корзину.
          </Text>

          <Group gap="sm">
            <Badge
              variant="outline"
              color="teal"
              size="lg"
              radius={0}
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              КАТАЛОГ ТОВАРОВ
            </Badge>
            <Badge
              variant="filled"
              color="teal"
              size="lg"
              radius={0}
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              AI-ПОМОЩНИК
            </Badge>
          </Group>

          <Text size="xs" c="dimmed" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            TechElectro v0.1.0 · Docker Ready
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
