"use client";

import { Box, Text, Stack, Group, Button, TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";

export default function AccountPage() {
  const { user, login, logout, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box className="te-container" py="lg">
      <Stack gap="lg" maw={420} mx="auto">
        <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)">
          Профиль
        </Text>

        {user ? (
          <Stack gap="sm">
            <Text c="var(--te-text)">{user.fullName ?? user.email}</Text>
            <Text c="dimmed" size="sm">
              Роль: {user.role}
            </Text>
            <Button variant="light" color="gray" onClick={() => void logout()}>
              Выйти
            </Button>
          </Stack>
        ) : (
          <Stack gap="sm">
            <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
            <PasswordInput
              label="Пароль"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {error && (
              <Text size="xs" c="red.4">
                {error}
              </Text>
            )}
            <Group>
              <Button color="teal" loading={loading} onClick={() => void login({ email, password })}>
                Войти
              </Button>
            </Group>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
