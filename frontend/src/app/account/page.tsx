"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Text, Stack, Group, Button, TextInput,
  Divider, Badge, Avatar, Skeleton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUser, IconMail, IconPhone, IconPackage, IconLogout } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/store";
import { Eyebrow } from "@/components/ui/Eyebrow";

const roleLabel: Record<string, string> = {
  B2C: "Физлицо",
  B2B: "Компания",
  ADMIN: "Администратор",
};

const roleColor: Record<string, string> = {
  B2C: "teal",
  B2B: "blue",
  ADMIN: "orange",
};

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading, hydrate } = useAuthStore();
  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user) setEditName(user.name ?? "");
  }, [user]);

  if (loading) {
    return (
      <Box className="te-container" py="lg">
        <Skeleton height={32} width={200} mb="xl" />
        <Skeleton height={120} radius={0} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="te-container" py="lg">
        <Stack align="center" gap="md" py={80}>
          <IconUser size={64} opacity={0.2} color="var(--te-text)" />
          <Text c="dimmed">Вы не авторизованы</Text>
          <Button color="teal" onClick={() => router.push("/login")}>
            Войти
          </Button>
        </Stack>
      </Box>
    );
  }

  const handleSaveName = () => {
    notifications.show({ message: "Имя обновлено", color: "teal" });
    setEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Box className="te-container" py="lg">
      <Stack gap={4} mb="xl">
        <Eyebrow>ПРОФИЛЬ</Eyebrow>
        <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
          Личный кабинет
        </Text>
      </Stack>

      <Box maw={560}>
        {/* User card */}
        <Box
          p="xl"
          mb="lg"
          style={{ background: "var(--te-surface)", border: "1px solid var(--te-line)" }}
        >
          <Group mb="lg">
            <Avatar size={56} radius={0} color="teal">
              {user.name?.charAt(0)?.toUpperCase() ?? user.email.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Text fw={700} c="var(--te-text)" size="lg">{user.name ?? "—"}</Text>
              <Badge color={roleColor[user.role] ?? "gray"} size="sm" radius={0} mt={4}>
                {roleLabel[user.role] ?? user.role}
              </Badge>
            </Box>
          </Group>

          <Stack gap="sm">
            <Group gap="sm">
              <IconMail size={14} color="var(--te-muted)" />
              <Text size="sm" c="dimmed">{user.email}</Text>
            </Group>
            {user.phone && (
              <Group gap="sm">
                <IconPhone size={14} color="var(--te-muted)" />
                <Text size="sm" c="dimmed">{user.phone}</Text>
              </Group>
            )}
            <Group gap="sm">
              <IconUser size={14} color="var(--te-muted)" />
              <Text size="sm" c="dimmed" ff="JetBrains Mono">ID: {user.id.slice(0, 12)}…</Text>
            </Group>
          </Stack>
        </Box>

        {/* Edit name */}
        <Box
          p="xl"
          mb="lg"
          style={{ background: "var(--te-surface)", border: "1px solid var(--te-line)" }}
        >
          <Text fw={600} c="var(--te-text)" mb="md">Редактировать профиль</Text>
          <Stack gap="sm">
            <TextInput
              label="Имя"
              value={editName}
              onChange={(e) => { setEditName(e.currentTarget.value); setEditing(true); }}
              styles={{ input: { background: "var(--te-bg)", borderColor: "var(--te-line)", color: "var(--te-text)" } }}
            />
            {editing && (
              <Group>
                <Button size="xs" color="teal" radius={0} onClick={handleSaveName}>
                  Сохранить
                </Button>
                <Button size="xs" variant="subtle" color="gray" onClick={() => { setEditName(user.name ?? ""); setEditing(false); }}>
                  Отмена
                </Button>
              </Group>
            )}
          </Stack>
        </Box>

        <Divider color="var(--te-line)" mb="lg" />

        <Group>
          <Button
            variant="default"
            leftSection={<IconPackage size={14} />}
            style={{ borderColor: "var(--te-line)" }}
            onClick={() => router.push("/orders")}
          >
            Мои заказы
          </Button>
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconLogout size={14} />}
            onClick={() => void handleLogout()}
          >
            Выйти
          </Button>
        </Group>
      </Box>
    </Box>
  );
}
