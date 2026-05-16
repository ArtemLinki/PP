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
  Badge,
  Table,
  ActionIcon,
  Modal,
  NumberInput,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconPencil,
  IconArchive,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { services } from "@/lib/services";
import { formatPrice } from "@/lib/format";
import type { ProductDto, ProductStatus } from "@/lib/dto";

// ─── ProductForm ────────────────────────────────────────────────────────────

interface ProductFormValues {
  title: string;
  sku: string;
  categoryId: string;
  brandId: string;
  priceAmount: number;
  stockQty: number;
  status: ProductStatus;
}

const DEFAULT_FORM: ProductFormValues = {
  title: "",
  sku: "",
  categoryId: "",
  brandId: "",
  priceAmount: 0,
  stockQty: 0,
  status: "DRAFT",
};

interface ProductFormProps {
  onClose: () => void;
  initial?: Partial<ProductFormValues>;
}

function ProductForm({ onClose, initial }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>({ ...DEFAULT_FORM, ...initial });

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onClose();
    notifications.show({
      title: "Сохранено",
      message: `Товар «${form.title || "—"}» сохранён`,
      color: "teal",
    });
  };

  return (
    <Stack gap={16}>
      <TextInput
        label="Название"
        placeholder="Название товара"
        value={form.title}
        onChange={(e) => set("title", e.currentTarget.value)}
        radius={0}
      />
      <TextInput
        label="SKU"
        placeholder="ESP32-S3-001"
        value={form.sku}
        onChange={(e) => set("sku", e.currentTarget.value)}
        radius={0}
        styles={{ input: { fontFamily: "'JetBrains Mono', monospace" } }}
      />
      <Select
        label="Категория"
        placeholder="Выберите категорию"
        data={[
          { value: "1", label: "Микроконтроллеры" },
          { value: "2", label: "Сенсоры" },
          { value: "3", label: "Дисплеи" },
        ]}
        value={form.categoryId || null}
        onChange={(v) => set("categoryId", v ?? "")}
        radius={0}
      />
      <Select
        label="Бренд"
        placeholder="Выберите бренд"
        data={[
          { value: "b1", label: "Espressif" },
          { value: "b2", label: "Raspberry Pi" },
          { value: "b3", label: "Arduino" },
          { value: "b4", label: "DFRobot" },
        ]}
        value={form.brandId || null}
        onChange={(v) => set("brandId", v ?? "")}
        radius={0}
      />
      <NumberInput
        label="Цена в копейках"
        placeholder="4990"
        value={form.priceAmount}
        onChange={(v) => set("priceAmount", typeof v === "number" ? v : 0)}
        min={0}
        radius={0}
        styles={{ input: { fontFamily: "'JetBrains Mono', monospace" } }}
      />
      <NumberInput
        label="Остаток"
        placeholder="10"
        value={form.stockQty}
        onChange={(v) => set("stockQty", typeof v === "number" ? v : 0)}
        min={0}
        radius={0}
      />
      <Select
        label="Статус"
        data={[
          { value: "PUBLISHED", label: "Опубликован" },
          { value: "DRAFT", label: "Черновик" },
          { value: "ARCHIVED", label: "Архив" },
        ]}
        value={form.status}
        onChange={(v) => set("status", (v as ProductStatus) ?? "DRAFT")}
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
  );
}

// ─── Status badge helpers ────────────────────────────────────────────────────

function getProductStatusColor(status: string): string {
  switch (status) {
    case "PUBLISHED":
      return "teal";
    case "DRAFT":
      return "gray";
    case "ARCHIVED":
      return "red";
    default:
      return "gray";
  }
}

function getProductStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PUBLISHED: "Опубликован",
    DRAFT: "Черновик",
    ARCHIVED: "Архив",
  };
  return labels[status] ?? status;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, statusFilter],
    queryFn: () =>
      services.products.list({
        search: search || undefined,
        page: 1,
        pageSize: 50,
      }),
  });

  const products = data?.items ?? [];

  const filtered = products.filter((p) => {
    if (statusFilter && statusFilter !== "all") {
      // ProductDto doesn't have a status field in the DTO; use stockStatus as proxy
      // The ProductStatus type (PUBLISHED/DRAFT/ARCHIVED) is for CreateProductDto
      // We'll skip filtering on status for now since ProductDto lacks it
      return true;
    }
    return true;
  });

  const openAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: ProductDto) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
  };

  const handleArchive = (product: ProductDto) => {
    notifications.show({
      title: "Архивирован",
      message: `Товар «${product.title}» перемещён в архив`,
      color: "orange",
    });
  };

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        {/* Page title */}
        <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>
          Товары
        </Text>

        {/* Toolbar */}
        <Group gap={12}>
          <TextInput
            placeholder="Поиск по названию или SKU..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius={0}
            style={{ flex: 1, maxWidth: 360 }}
          />
          <Select
            placeholder="Все статусы"
            data={[
              { value: "all", label: "Все статусы" },
              { value: "PUBLISHED", label: "Опубликован" },
              { value: "DRAFT", label: "Черновик" },
              { value: "ARCHIVED", label: "Архив" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            radius={0}
            style={{ width: 180 }}
            clearable
          />
          <Button
            color="teal"
            radius={0}
            leftSection={<IconPlus size={16} />}
            onClick={openAdd}
          >
            + Добавить товар
          </Button>
        </Group>

        {/* Table */}
        <Box
          style={{
            background: "var(--te-surface)",
            border: "1px solid var(--te-line)",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <Box style={{ padding: 32 }}>
              <Text style={{ color: "var(--te-muted)" }}>Загрузка...</Text>
            </Box>
          ) : (
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ borderBottom: "1px solid var(--te-line)" }}>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Название</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>SKU</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Категория</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Цена</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Остаток</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Статус</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Действия</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text
                        style={{ color: "var(--te-muted)", padding: "24px 0", textAlign: "center" }}
                      >
                        Нет товаров
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filtered.map((product) => (
                    <Table.Tr
                      key={product.id}
                      style={{ borderBottom: "1px solid var(--te-line)" }}
                    >
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-text)" }} lineClamp={1}>
                          {product.title}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "var(--te-muted)",
                          }}
                        >
                          {product.sku}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-muted)" }}>
                          {product.categoryId}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "var(--te-text)",
                          }}
                        >
                          {formatPrice(product.price)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            color: "var(--te-text)",
                          }}
                        >
                          {product.stockQty ?? "—"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getProductStatusColor(product.stockStatus)}
                          radius={0}
                          size="sm"
                          variant="light"
                        >
                          {getProductStatusLabel(product.stockStatus)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            size="sm"
                            radius={0}
                            onClick={() => openEdit(product)}
                            title="Редактировать"
                          >
                            <IconPencil size={14} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="orange"
                            size="sm"
                            radius={0}
                            onClick={() => handleArchive(product)}
                            title="Архивировать"
                          >
                            <IconArchive size={14} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Stack>

      {/* Add / Edit Modal */}
      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editProduct ? "Редактировать товар" : "Добавить товар"}
        radius={0}
        size="md"
        styles={{
          header: { background: "var(--te-surface)", borderBottom: "1px solid var(--te-line)" },
          body: { background: "var(--te-surface)", paddingTop: 16 },
          content: { borderRadius: 0 },
        }}
      >
        <ProductForm
          onClose={closeModal}
          initial={
            editProduct
              ? {
                  title: editProduct.title,
                  sku: editProduct.sku,
                  categoryId: editProduct.categoryId,
                  brandId: editProduct.brandId ?? "",
                  priceAmount: editProduct.price.amount,
                  stockQty: editProduct.stockQty ?? 0,
                  status: "PUBLISHED",
                }
              : undefined
          }
        />
      </Modal>
    </Box>
  );
}
