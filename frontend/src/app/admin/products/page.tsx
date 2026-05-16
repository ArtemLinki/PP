'use client';

import { useState } from 'react';
import {
  Box, Stack, Group, Text, Button, TextInput, Select,
  Badge, Table, ActionIcon, Modal, NumberInput, Textarea,
} from '@mantine/core';
import { IconSearch, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { adminService, type AdminProduct, type CreateAdminProductDto } from '@/lib/services/admin/AdminApiService';
import type { ProductStatus } from '@/lib/dto';

// ─── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function statusColor(s: ProductStatus) {
  return s === 'PUBLISHED' ? 'teal' : s === 'ARCHIVED' ? 'red' : 'gray';
}

function statusLabel(s: ProductStatus) {
  return s === 'PUBLISHED' ? 'Опубликован' : s === 'ARCHIVED' ? 'Архив' : 'Черновик';
}

// ─── form ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  priceMinor: number;
  stock: number;
  status: ProductStatus;
  categoryId: string;
  brandId: string;
}

const EMPTY: FormState = {
  name: '', slug: '', sku: '', shortDescription: '',
  priceMinor: 0, stock: 0, status: 'DRAFT', categoryId: '', brandId: '',
};

function productToForm(p: AdminProduct): FormState {
  return {
    name: p.name, slug: p.slug, sku: p.sku,
    shortDescription: p.shortDescription ?? '',
    priceMinor: p.priceMinor, stock: p.stock,
    status: p.status, categoryId: p.categoryId ?? '', brandId: p.brandId ?? '',
  };
}

interface ProductModalProps {
  opened: boolean;
  onClose: () => void;
  editing: AdminProduct | null;
  categories: { value: string; label: string }[];
  brands: { value: string; label: string }[];
}

function ProductModal({ opened, onClose, editing, categories, brands }: ProductModalProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleOpen = () => setForm(editing ? productToForm(editing) : EMPTY);

  const createMut = useMutation({
    mutationFn: (dto: CreateAdminProductDto) => adminService.createProduct(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      notifications.show({ title: 'Создан', message: `Товар «${form.name}» добавлен`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при создании товара', color: 'red' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateAdminProductDto> }) =>
      adminService.updateProduct(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      notifications.show({ title: 'Сохранено', message: `Товар «${form.name}» обновлён`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при обновлении товара', color: 'red' }),
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.sku.trim()) {
      notifications.show({ message: 'Название и SKU обязательны', color: 'red' });
      return;
    }
    const dto: CreateAdminProductDto = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      sku: form.sku,
      shortDescription: form.shortDescription || undefined,
      priceMinor: form.priceMinor,
      stock: form.stock,
      status: form.status,
      categoryId: form.categoryId || undefined,
      brandId: form.brandId || undefined,
    };
    if (editing) {
      updateMut.mutate({ id: editing.id, dto });
    } else {
      createMut.mutate(dto);
    }
  };

  const loading = createMut.isPending || updateMut.isPending;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      onFocus={handleOpen}
      title={editing ? 'Редактировать товар' : 'Добавить товар'}
      radius={0}
      size="md"
      styles={{
        header: { background: 'var(--te-surface)', borderBottom: '1px solid var(--te-line)' },
        body: { background: 'var(--te-surface)', paddingTop: 16 },
        content: { borderRadius: 0 },
      }}
    >
      <Stack gap={12}>
        <TextInput label="Название *" value={form.name}
          onChange={e => { set('name', e.currentTarget.value); if (!editing) set('slug', slugify(e.currentTarget.value)); }}
          radius={0} />
        <TextInput label="Slug" value={form.slug} onChange={e => set('slug', e.currentTarget.value)} radius={0} />
        <TextInput label="SKU *" value={form.sku} onChange={e => set('sku', e.currentTarget.value)}
          radius={0} styles={{ input: { fontFamily: 'JetBrains Mono, monospace' } }} />
        <Textarea label="Краткое описание" value={form.shortDescription}
          onChange={e => set('shortDescription', e.currentTarget.value)}
          radius={0} autosize minRows={2} />
        <Group grow>
          <NumberInput label="Цена (копеек) *" value={form.priceMinor}
            onChange={v => set('priceMinor', typeof v === 'number' ? v : 0)} min={0} radius={0}
            styles={{ input: { fontFamily: 'JetBrains Mono, monospace' } }} />
          <NumberInput label="Остаток" value={form.stock}
            onChange={v => set('stock', typeof v === 'number' ? v : 0)} min={0} radius={0} />
        </Group>
        <Select label="Статус" value={form.status} onChange={v => set('status', (v as ProductStatus) ?? 'DRAFT')}
          data={[{ value: 'PUBLISHED', label: 'Опубликован' }, { value: 'DRAFT', label: 'Черновик' }, { value: 'ARCHIVED', label: 'Архив' }]}
          radius={0} />
        <Select label="Категория" value={form.categoryId || null} onChange={v => set('categoryId', v ?? '')}
          data={categories} radius={0} clearable placeholder="Без категории" />
        <Select label="Бренд" value={form.brandId || null} onChange={v => set('brandId', v ?? '')}
          data={brands} radius={0} clearable placeholder="Без бренда" />
        <Group justify="flex-end" gap={8} mt={8}>
          <Button variant="subtle" color="gray" radius={0} onClick={onClose}>Отмена</Button>
          <Button color="teal" radius={0} onClick={handleSave} loading={loading}>Сохранить</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminService.listProducts(1, 200),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.listCategories(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => adminService.listBrands(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      notifications.show({ message: 'Товар удалён', color: 'orange' });
    },
    onError: () => notifications.show({ message: 'Ошибка при удалении', color: 'red' }),
  });

  const handleDelete = (p: AdminProduct) => {
    if (!confirm(`Удалить товар «${p.name}»?`)) return;
    deleteMut.mutate(p.id);
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: AdminProduct) => { setEditing(p); setModalOpen(true); };

  const categoryOptions = (categoriesData ?? []).map(c => ({ value: c.id, label: c.name }));
  const brandOptions = (brandsData ?? []).map(b => ({ value: b.id, label: b.name }));

  const items = (data?.items ?? []).filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        <Text style={{ fontSize: 24, fontWeight: 700, color: 'var(--te-text)' }}>Товары</Text>

        <Group gap={12}>
          <TextInput placeholder="Поиск по названию или SKU…"
            leftSection={<IconSearch size={16} />} value={search}
            onChange={e => setSearch(e.currentTarget.value)} radius={0} style={{ flex: 1, maxWidth: 360 }} />
          <Select placeholder="Все статусы"
            data={[{ value: 'all', label: 'Все' }, { value: 'PUBLISHED', label: 'Опубликован' }, { value: 'DRAFT', label: 'Черновик' }, { value: 'ARCHIVED', label: 'Архив' }]}
            value={statusFilter} onChange={setStatusFilter} radius={0} style={{ width: 180 }} clearable />
          <Button color="teal" radius={0} leftSection={<IconPlus size={16} />} onClick={openAdd}>
            + Добавить товар
          </Button>
        </Group>

        <Box style={{ background: 'var(--te-surface)', border: '1px solid var(--te-line)', overflow: 'hidden' }}>
          {isLoading ? (
            <Box style={{ padding: 32 }}><Text style={{ color: 'var(--te-muted)' }}>Загрузка…</Text></Box>
          ) : (
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {['Название', 'SKU', 'Категория', 'Цена', 'Остаток', 'Статус', ''].map(h => (
                    <Table.Th key={h} style={{ color: 'var(--te-muted)', fontWeight: 500, fontSize: 12 }}>{h}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.length === 0 ? (
                  <Table.Tr><Table.Td colSpan={7}>
                    <Text style={{ color: 'var(--te-muted)', padding: '24px 0', textAlign: 'center' }}>Нет товаров</Text>
                  </Table.Td></Table.Tr>
                ) : items.map(p => (
                  <Table.Tr key={p.id} style={{ borderBottom: '1px solid var(--te-line)' }}>
                    <Table.Td><Text size="sm" c="var(--te-text)" lineClamp={1}>{p.name}</Text></Table.Td>
                    <Table.Td><Text size="sm" ff="JetBrains Mono, monospace" c="var(--te-muted)">{p.sku}</Text></Table.Td>
                    <Table.Td><Text size="sm" c="var(--te-muted)">{p.category?.name ?? '—'}</Text></Table.Td>
                    <Table.Td><Text size="sm" ff="JetBrains Mono, monospace" c="var(--te-text)">{(p.priceMinor / 100).toFixed(0)} ₽</Text></Table.Td>
                    <Table.Td><Text size="sm" ff="JetBrains Mono, monospace" c="var(--te-text)">{p.stock}</Text></Table.Td>
                    <Table.Td>
                      <Badge color={statusColor(p.status)} radius={0} size="sm" variant="light">
                        {statusLabel(p.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon variant="subtle" color="teal" size="sm" radius={0}
                          onClick={() => openEdit(p)} title="Редактировать">
                          <IconPencil size={14} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" size="sm" radius={0}
                          onClick={() => handleDelete(p)} title="Удалить" loading={deleteMut.isPending}>
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Stack>

      <ProductModal
        opened={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        editing={editing}
        categories={categoryOptions}
        brands={brandOptions}
      />
    </Box>
  );
}
