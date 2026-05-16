"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Select,
  Switch,
  ActionIcon,
  Modal,
  UnstyledButton,
} from "@mantine/core";
import {
  IconPlus,
  IconPencil,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface CategoryNode {
  id: string;
  title: string;
  slug: string;
  isVisible: boolean;
  children: CategoryNode[];
}

const mockCategories: CategoryNode[] = [
  {
    id: "1",
    title: "Микроконтроллеры",
    slug: "mcu",
    isVisible: true,
    children: [
      { id: "11", title: "ESP32", slug: "esp32", isVisible: true, children: [] },
      { id: "12", title: "Arduino", slug: "arduino", isVisible: true, children: [] },
    ],
  },
  {
    id: "2",
    title: "Сенсоры",
    slug: "sensors",
    isVisible: true,
    children: [],
  },
];

// ─── AddCategoryModal ─────────────────────────────────────────────────────────

interface AddCategoryModalProps {
  opened: boolean;
  onClose: () => void;
  parentOptions: { value: string; label: string }[];
}

function AddCategoryModal({ opened, onClose, parentOptions }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const handleSave = () => {
    if (!name.trim()) {
      notifications.show({ message: "Введите название", color: "red" });
      return;
    }
    onClose();
    setName("");
    setParentId(null);
    setVisible(true);
    notifications.show({
      title: "Сохранено",
      message: `Категория «${name}» добавлена`,
      color: "teal",
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить категорию"
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
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          radius={0}
        />
        <Select
          label="Родительская категория"
          placeholder="Без родителя (L1)"
          data={parentOptions}
          value={parentId}
          onChange={setParentId}
          radius={0}
          clearable
        />
        <Switch
          label="Видима"
          checked={visible}
          onChange={(e) => setVisible(e.currentTarget.checked)}
          color="teal"
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

// ─── CategoryRow ──────────────────────────────────────────────────────────────

interface CategoryRowProps {
  category: CategoryNode;
  isSelected?: boolean;
  onClick?: () => void;
  onToggleVisible: (id: string) => void;
  onEdit: (id: string) => void;
}

function CategoryRow({ category, isSelected, onClick, onToggleVisible, onEdit }: CategoryRowProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        background: isSelected ? "rgba(0,212,181,0.08)" : "transparent",
        borderLeft: isSelected ? "3px solid var(--te-accent)" : "3px solid transparent",
        borderBottom: "1px solid var(--te-line)",
        width: "100%",
        cursor: "pointer",
      }}
    >
      <Text
        size="sm"
        style={{
          color: isSelected ? "var(--te-accent)" : "var(--te-text)",
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {category.title}
      </Text>
      <Group gap={4} onClick={(e) => e.stopPropagation()}>
        <ActionIcon
          variant="subtle"
          color={category.isVisible ? "teal" : "gray"}
          size="sm"
          radius={0}
          onClick={() => onToggleVisible(category.id)}
          title={category.isVisible ? "Скрыть" : "Показать"}
        >
          {category.isVisible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="teal"
          size="sm"
          radius={0}
          onClick={() => onEdit(category.id)}
          title="Редактировать"
        >
          <IconPencil size={14} />
        </ActionIcon>
      </Group>
    </UnstyledButton>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>(mockCategories);
  const [selectedL1Id, setSelectedL1Id] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedL1 = categories.find((c) => c.id === selectedL1Id) ?? null;

  const toggleVisible = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) return { ...cat, isVisible: !cat.isVisible };
        return {
          ...cat,
          children: cat.children.map((ch) =>
            ch.id === id ? { ...ch, isVisible: !ch.isVisible } : ch,
          ),
        };
      }),
    );
  };

  const handleEdit = (id: string) => {
    notifications.show({
      message: `Редактирование категории ${id} — скоро`,
      color: "teal",
    });
  };

  const parentOptions = categories.map((c) => ({ value: c.id, label: c.title }));

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>
            Категории
          </Text>
          <Button
            color="teal"
            radius={0}
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            + Добавить категорию
          </Button>
        </Group>

        {/* Two-column layout */}
        <Group align="flex-start" gap={0} style={{ border: "1px solid var(--te-line)" }}>
          {/* L1 column */}
          <Box
            style={{
              flex: 1,
              borderRight: "1px solid var(--te-line)",
              background: "var(--te-surface)",
            }}
          >
            <Box
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid var(--te-line)",
                background: "var(--te-bg)",
              }}
            >
              <Text size="xs" fw={600} style={{ color: "var(--te-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Категории L1
              </Text>
            </Box>
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                isSelected={cat.id === selectedL1Id}
                onClick={() => setSelectedL1Id(cat.id === selectedL1Id ? null : cat.id)}
                onToggleVisible={toggleVisible}
                onEdit={handleEdit}
              />
            ))}
          </Box>

          {/* L2 column */}
          <Box
            style={{
              flex: 1,
              background: "var(--te-surface)",
            }}
          >
            <Box
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid var(--te-line)",
                background: "var(--te-bg)",
              }}
            >
              <Text size="xs" fw={600} style={{ color: "var(--te-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Подкатегории L2
                {selectedL1 && (
                  <Text component="span" style={{ color: "var(--te-accent)", marginLeft: 8, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                    — {selectedL1.title}
                  </Text>
                )}
              </Text>
            </Box>
            {!selectedL1 ? (
              <Box style={{ padding: 24 }}>
                <Text size="sm" style={{ color: "var(--te-muted)" }}>
                  Выберите категорию L1 слева
                </Text>
              </Box>
            ) : selectedL1.children.length === 0 ? (
              <Box style={{ padding: 24 }}>
                <Text size="sm" style={{ color: "var(--te-muted)" }}>
                  Нет подкатегорий
                </Text>
              </Box>
            ) : (
              selectedL1.children.map((child) => (
                <CategoryRow
                  key={child.id}
                  category={child}
                  onToggleVisible={toggleVisible}
                  onEdit={handleEdit}
                />
              ))
            )}
          </Box>
        </Group>
      </Stack>

      <AddCategoryModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        parentOptions={parentOptions}
      />
    </Box>
  );
}
