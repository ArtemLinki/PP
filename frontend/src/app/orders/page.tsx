"use client";

import { useEffect } from "react";
import { Box, Text, Stack, Group, Badge } from "@mantine/core";
import { useServices } from "@/lib/services/ServicesProvider";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format";

export default function OrdersPage() {
  const services = useServices();
  const { data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => services.orders.list(),
  });

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return (
    <Box className="te-container" py="lg">
      <Text fz={{ base: 24, sm: 32 }} fw={700} c="var(--te-text)" mb="lg">
        Заказы
      </Text>
      {!data || data.length === 0 ? (
        <Text c="dimmed">Заказов пока нет.</Text>
      ) : (
        <Stack gap="md">
          {data.map((o) => (
            <Group
              key={o.id}
              justify="space-between"
              p="md"
              style={{ background: "var(--te-surface)", border: "1px solid var(--te-line)" }}
            >
              <Stack gap={2}>
                <Text fw={600} c="var(--te-text)">
                  №{o.number}
                </Text>
                <Text size="xs" c="dimmed" ff="JetBrains Mono">
                  {new Date(o.createdAt).toLocaleString("ru-RU")}
                </Text>
              </Stack>
              <Badge color="teal" variant="light">
                {o.status}
              </Badge>
              <Text fw={600} ff="JetBrains Mono" c="var(--te-text)">
                {formatPrice(o.total)}
              </Text>
            </Group>
          ))}
        </Stack>
      )}
    </Box>
  );
}
