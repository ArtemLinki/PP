'use client';

import { useState } from 'react';
import {
  Box, Stack, Group, Text, Button, TextInput, SimpleGrid,
  Modal, ActionIcon,
} from '@mantine/core';
import { IconPlus, IconWorld, IconMapPin, IconPencil, IconTrash } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { adminService, type AdminBrand, type CreateAdminBrandDto } from '@/lib/services/admin/AdminApiService';

// ─── BrandModal ───────────────────────────────────────────────────────────────

interface BrandModalProps {
  opened: boolean;
  onClose: () => void;
  editing: AdminBrand | null;
}

function BrandModal({ opened, onClose, editing }: BrandModalProps) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const handleOpen = () => {
    if (editing) {
      setName(editing.name); setSlug(editing.slug);
      setWebsite(editing.website ?? ''); setCountry(editing.country ?? '');
      setLogoUrl(editing.logoUrl ?? '');
    } else {
      setName(''); setSlug(''); setWebsite(''); setCountry(''); setLogoUrl('');
    }
  };

  const createMut = useMutation({
    mutationFn: (dto: CreateAdminBrandDto) => adminService.createBrand(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands'] });
      notifications.show({ title: 'Создан', message: `Бренд «${name}» добавлен`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при создании', color: 'red' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateAdminBrandDto> }) =>
      adminService.updateBrand(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands'] });
      notifications.show({ title: 'Сохранено', message: `Бренд «${name}» обновлён`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при обновлении', color: 'red' }),
  });

  const handleSave = () => {
    if (!name.trim()) { notifications.show({ message: 'Введите название', color: 'red' }); return; }
    const dto: CreateAdminBrandDto = {
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      website: website || undefined, country: country || undefined,
      logoUrl: logoUrl || undefined,
    };
    if (editing) updateMut.mutate({ id: editing.id, dto });
    else createMut.mutate(dto);
  };

  const loading = createMut.isPending || updateMut.isPending;

  return (
    <Modal opened={opened} onClose={onClose} onFocus={handleOpen}
      title={editing ? 'Редактировать бренд' : 'Добавить бренд'}
      radius={0} size="sm"
      styles={{
        header: { background: 'var(--te-surface)', borderBottom: '1px solid var(--te-line)' },
        body: { background: 'var(--te-surface)', paddingTop: 16 },
        content: { borderRadius: 0 },
      }}
    >
      <Stack gap={12}>
        <TextInput label="Название" value={name}
          onChange={e => { setName(e.currentTarget.value); if (!editing) setSlug(e.currentTarget.value.toLowerCase().replace(/\s+/g, '-')); }}
          radius={0} />
        <TextInput label="Slug" value={slug} onChange={e => setSlug(e.currentTarget.value)} radius={0} />
        <TextInput label="Сайт" placeholder="https://example.com" value={website}
          onChange={e => setWebsite(e.currentTarget.value)} radius={0} />
        <TextInput label="Страна" placeholder="Китай" value={country}
          onChange={e => setCountry(e.currentTarget.value)} radius={0} />
        <TextInput label="URL логотипа" placeholder="https://…/logo.png" value={logoUrl}
          onChange={e => setLogoUrl(e.currentTarget.value)} radius={0} />
        <Group justify="flex-end" gap={8} mt={8}>
          <Button variant="subtle" color="gray" radius={0} onClick={onClose}>Отмена</Button>
          <Button color="teal" radius={0} onClick={handleSave} loading={loading}>Сохранить</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── BrandCard ────────────────────────────────────────────────────────────────

interface BrandCardProps {
  brand: AdminBrand;
  onEdit: (b: AdminBrand) => void;
  onDelete: (b: AdminBrand) => void;
}

function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <Box style={{
      background: 'var(--te-surface)', border: '1px solid var(--te-line)',
      borderRadius: 0, padding: '20px 24px', position: 'relative',
    }}>
      <Group justify="space-between" align="flex-start" mb={12}>
        <Text style={{ fontSize: 20, fontWeight: 700, color: 'var(--te-text)' }}>{brand.name}</Text>
        <Group gap={4}>
          <ActionIcon variant="subtle" color="teal" size="sm" radius={0}
            onClick={() => onEdit(brand)} title="Редактировать">
            <IconPencil size={14} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" size="sm" radius={0}
            onClick={() => onDelete(brand)} title="Удалить">
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>
      <Stack gap={8}>
        {brand.website && (
          <Group gap={8}>
            <IconWorld size={14} color="var(--te-muted)" />
            <Text size="xs" c="var(--te-accent)" ff="JetBrains Mono, monospace" style={{ wordBreak: 'break-all' }}>
              {brand.website}
            </Text>
          </Group>
        )}
        {brand.country && (
          <Group gap={8}>
            <IconMapPin size={14} color="var(--te-muted)" />
            <Text size="xs" c="var(--te-muted)">{brand.country}</Text>
          </Group>
        )}
        <Text size="xs" ff="JetBrains Mono, monospace" c="var(--te-muted)">slug: {brand.slug}</Text>
      </Stack>
    </Box>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminBrandsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const qc = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => adminService.listBrands(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminService.deleteBrand(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands'] });
      notifications.show({ message: 'Бренд удалён', color: 'orange' });
    },
    onError: () => notifications.show({ message: 'Ошибка при удалении', color: 'red' }),
  });

  const handleDelete = (b: AdminBrand) => {
    if (!confirm(`Удалить бренд «${b.name}»?`)) return;
    deleteMut.mutate(b.id);
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (b: AdminBrand) => { setEditing(b); setModalOpen(true); };

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: 'var(--te-text)' }}>Бренды</Text>
          <Button color="teal" radius={0} leftSection={<IconPlus size={16} />} onClick={openAdd}>
            + Добавить бренд
          </Button>
        </Group>

        {isLoading ? (
          <Text c="var(--te-muted)">Загрузка…</Text>
        ) : brands.length === 0 ? (
          <Text c="var(--te-muted)">Нет брендов</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={16}>
            {brands.map(b => (
              <BrandCard key={b.id} brand={b} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <BrandModal
        opened={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        editing={editing}
      />
    </Box>
  );
}
