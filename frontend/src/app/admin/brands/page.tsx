"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  SimpleGrid,
  Modal,
} from "@mantine/core";
import {
  IconPlus,
  IconWorld,
  IconMapPin,
  IconBox,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface BrandMock {
  id: string;
  title: string;
  website: string;
  country: string;
  activeSku: number;
}

const mockBrands: BrandMock[] = [
  {
    id: "b1",
    title: "Espressif",
    website: "https://espressif.com",
    country: "Китай",
    activeSku: 18,
  },
  {
    id: "b2",
    title: "Raspberry Pi",
    website: "https://raspberrypi.com",
    country: "Великобритания",
    activeSku: 12,
  },
  {
    id: "b3",
    title: "Arduino",
    website: "https://arduino.cc",
    country: "Италия",
    activeSku: 9,
  },
  {
    id: "b4",
    title: "DFRobot",
    website: "https://dfrobot.com",
    country: "Китай",
    activeSku: 24,
  },
];

// ─── BrandCard ────────────────────────────────────────────────────────────────

function BrandCard({ brand }: { brand: BrandMock }) {
  return (
    <Box
      style={{
        background: "var(--te-surface)",
        border: "1px solid var(--te-line)",
        borderRadius: 0,
        padding: "20px 24px",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "var(--te-text)",
          marginBottom: 12,
        }}
      >
        {brand.title}
      </Text>
      <Stack gap={8}>
        <Group gap={8}>
          <IconWorld size={14} color="var(--te-muted)" />
          <Text
            size="xs"
            style={{
              color: "var(--te-accent)",
              fontFamily: "'JetBrains Mono', monospace",
              wordBreak: "break-all",
            }}
          >
            {brand.website}
          </Text>
        </Group>
        <Group gap={8}>
          <IconMapPin size={14} color="var(--te-muted)" />
          <Text size="xs" style={{ color: "var(--te-muted)" }}>
            {brand.country}
          </Text>
        </Group>
        <Group gap={8}>
          <IconBox size={14} color="var(--te-muted)" />
          <Text size="xs" style={{ color: "var(--te-muted)" }}>
            Активных SKU:{" "}
            <Text
              component="span"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--te-text)",
                fontWeight: 600,
              }}
            >
              {brand.activeSku}
            </Text>
          </Text>
        </Group>
      </Stack>
    </Box>
  );
}

// ─── AddBrandModal ────────────────────────────────────────────────────────────

interface AddBrandModalProps {
  opened: boolean;
  onClose: () => void;
}

function AddBrandModal({ opened, onClose }: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      notifications.show({ message: "Введите название", color: "red" });
      return;
    }
    onClose();
    setName("");
    setWebsite("");
    setCountry("");
    notifications.show({
      title: "Сохранено",
      message: `Бренд «${name}» добавлен`,
      color: "teal",
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить бренд"
      radius={0}
      size="sm"
      styles={{
        header: { background: "var(--te-surface)", borderBottom: "1px solid var(--te-line)" },
        body: { background: "var(--te-surface)", paddingTop: 16 },
        content: { borderRadius: 0 },
      }}
    >
      <Stack gap={16}>
        <TextInput
          label="Название"
          placeholder="Название бренда"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          radius={0}
        />
        <TextInput
          label="Сайт"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.currentTarget.value)}
          radius={0}
        />
        <TextInput
          label="Страна"
          placeholder="Страна производства"
          value={country}
          onChange={(e) => setCountry(e.currentTarget.value)}
          radius={0}
        />
        <Group justify="flex-end" gap={8} mt={8}>
          <Button variant="subtle" color="gray" radius={0} onClick={onClose}>
            Отмена
          </Button>
          <Button color="teal" radius={0} onClick={handleSave}>
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminBrandsPage() {
  const [brands] = useState<BrandMock[]>(mockBrands);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>
            Бренды
          </Text>
          <Button
            color="teal"
            radius={0}
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            + Добавить бренд
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={16}>
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </SimpleGrid>
      </Stack>

      <AddBrandModal opened={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
