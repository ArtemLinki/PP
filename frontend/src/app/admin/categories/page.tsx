'use client';

import { useState, useEffect } from 'react';
import {
  Box, Stack, Group, Text, Button, TextInput, Select,
  Switch, ActionIcon, Modal, UnstyledButton,
} from '@mantine/core';
import { IconPlus, IconPencil, IconTrash, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { adminService, type AdminCategory, type CreateAdminCategoryDto } from '@/lib/services/admin/AdminApiService';

// ─── CategoryModal ────────────────────────────────────────────────────────────

interface CategoryModalProps {
  opened: boolean;
  onClose: () => void;
  editing: AdminCategory | null;
  parentOptions: { value: string; label: string }[];
}

function CategoryModal({ opened, onClose, editing, parentOptions }: CategoryModalProps) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!opened) return;
    if (editing) {
      setName(editing.name);
      setSlug(editing.slug);
      setParentId(editing.parentId ?? null);
      setIsVisible(editing.isVisible);
    } else {
      setName(''); setSlug(''); setParentId(null); setIsVisible(true);
    }
  }, [opened, editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const createMut = useMutation({
    mutationFn: (dto: CreateAdminCategoryDto) => adminService.createCategory(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      notifications.show({ title: 'Создана', message: `Категория «${name}» добавлена`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при создании', color: 'red' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CreateAdminCategoryDto> }) =>
      adminService.updateCategory(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      notifications.show({ title: 'Сохранено', message: `Категория «${name}» обновлена`, color: 'teal' });
      onClose();
    },
    onError: () => notifications.show({ message: 'Ошибка при обновлении', color: 'red' }),
  });

  const handleSave = () => {
    if (!name.trim()) { notifications.show({ message: 'Введите название', color: 'red' }); return; }
    const dto: CreateAdminCategoryDto = {
      name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      parentId: parentId ?? undefined, isVisible,
    };
    if (editing) updateMut.mutate({ id: editing.id, dto });
    else createMut.mutate(dto);
  };

  const loading = createMut.isPending || updateMut.isPending;

  return (
    <Modal
      opened={opened} onClose={onClose}
      title={editing ? 'Редактировать категорию' : 'Добавить категорию'}
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
        <Select label="Родительская категория" placeholder="L1 (без родителя)"
          data={parentOptions} value={parentId} onChange={setParentId} radius={0} clearable />
        <Switch label="Видима на витрине" checked={isVisible}
          onChange={e => setIsVisible(e.currentTarget.checked)} color="teal" />
        <Group justify="flex-end" gap={8} mt={8}>
          <Button variant="subtle" color="gray" radius={0} onClick={onClose}>Отмена</Button>
          <Button color="teal" radius={0} onClick={handleSave} loading={loading}>Сохранить</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ─── CategoryRow ──────────────────────────────────────────────────────────────

interface RowProps {
  cat: AdminCategory;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit: (c: AdminCategory) => void;
  onDelete: (c: AdminCategory) => void;
  onToggle: (c: AdminCategory) => void;
}

function CategoryRow({ cat, isSelected, onClick, onEdit, onDelete, onToggle }: RowProps) {
  return (
    <UnstyledButton onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', width: '100%', cursor: 'pointer',
      background: isSelected ? 'rgba(0,212,181,0.08)' : 'transparent',
      borderLeft: isSelected ? '3px solid var(--te-accent)' : '3px solid transparent',
      borderBottom: '1px solid var(--te-line)',
    }}>
      <Text size="sm" style={{ color: isSelected ? 'var(--te-accent)' : 'var(--te-text)', fontWeight: isSelected ? 600 : 400 }}>
        {cat.name}
        {!cat.isVisible && <Text component="span" size="xs" c="dimmed" ml={6}>(скрыта)</Text>}
      </Text>
      <Group gap={4} onClick={e => e.stopPropagation()}>
        <ActionIcon variant="subtle" color={cat.isVisible ? 'teal' : 'gray'} size="sm" radius={0}
          onClick={() => onToggle(cat)} title={cat.isVisible ? 'Скрыть' : 'Показать'}>
          {cat.isVisible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
        </ActionIcon>
        <ActionIcon variant="subtle" color="teal" size="sm" radius={0}
          onClick={() => onEdit(cat)} title="Редактировать">
          <IconPencil size={14} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="red" size="sm" radius={0}
          onClick={() => onDelete(cat)} title="Удалить">
          <IconTrash size={14} />
        </ActionIcon>
      </Group>
    </UnstyledButton>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const [selectedL1Id, setSelectedL1Id] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.listCategories(),
  });

  const toggleMut = useMutation({
    mutationFn: (cat: AdminCategory) => adminService.updateCategory(cat.id, { isVisible: !cat.isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      notifications.show({ message: 'Категория удалена', color: 'orange' });
    },
    onError: () => notifications.show({ message: 'Ошибка при удалении', color: 'red' }),
  });

  const handleDelete = (cat: AdminCategory) => {
    if (!confirm(`Удалить категорию «${cat.name}»?`)) return;
    deleteMut.mutate(cat.id);
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (cat: AdminCategory) => { setEditing(cat); setModalOpen(true); };

  const l1 = categories.filter(c => !c.parentId);
  const l2 = categories.filter(c => c.parentId === selectedL1Id);
  const selectedL1 = categories.find(c => c.id === selectedL1Id);
  const parentOptions = l1.map(c => ({ value: c.id, label: c.name }));

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: 'var(--te-text)' }}>Категории</Text>
          <Button color="teal" radius={0} leftSection={<IconPlus size={16} />} onClick={openAdd}>
            + Добавить категорию
          </Button>
        </Group>

        {isLoading ? (
          <Text c="var(--te-muted)">Загрузка…</Text>
        ) : (
          <Group align="flex-start" gap={0} style={{ border: '1px solid var(--te-line)' }}>
            <Box style={{ flex: 1, borderRight: '1px solid var(--te-line)', background: 'var(--te-surface)' }}>
              <Box style={{ padding: '8px 14px', borderBottom: '1px solid var(--te-line)', background: 'var(--te-bg)' }}>
                <Text size="xs" fw={600} c="var(--te-muted)" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Категории L1
                </Text>
              </Box>
              {l1.length === 0
                ? <Box p="md"><Text size="sm" c="var(--te-muted)">Нет категорий</Text></Box>
                : l1.map(cat => (
                  <CategoryRow key={cat.id} cat={cat}
                    isSelected={cat.id === selectedL1Id}
                    onClick={() => setSelectedL1Id(cat.id === selectedL1Id ? null : cat.id)}
                    onEdit={openEdit} onDelete={handleDelete} onToggle={c => toggleMut.mutate(c)} />
                ))}
            </Box>

            <Box style={{ flex: 1, background: 'var(--te-surface)' }}>
              <Box style={{ padding: '8px 14px', borderBottom: '1px solid var(--te-line)', background: 'var(--te-bg)' }}>
                <Text size="xs" fw={600} c="var(--te-muted)" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Подкатегории L2
                  {selectedL1 && <Text component="span" c="var(--te-accent)" ml={8} style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>— {selectedL1.name}</Text>}
                </Text>
              </Box>
              {!selectedL1
                ? <Box p="md"><Text size="sm" c="var(--te-muted)">Выберите категорию L1</Text></Box>
                : l2.length === 0
                  ? <Box p="md"><Text size="sm" c="var(--te-muted)">Нет подкатегорий</Text></Box>
                  : l2.map(cat => (
                    <CategoryRow key={cat.id} cat={cat}
                      onEdit={openEdit} onDelete={handleDelete} onToggle={c => toggleMut.mutate(c)} />
                  ))}
            </Box>
          </Group>
        )}
      </Stack>

      <CategoryModal
        opened={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        editing={editing}
        parentOptions={parentOptions}
      />
    </Box>
  );
}
