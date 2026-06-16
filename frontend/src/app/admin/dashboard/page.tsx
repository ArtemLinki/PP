"use client";

import {
  Box,
  Stack,
  Group,
  Text,
  SimpleGrid,
  Badge,
  Table,
  Skeleton,
} from "@mantine/core";
import {
  IconTrendingUp,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services/admin/AdminApiService";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/dto";

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "PENDING": return "gray";
    case "PAID":
    case "PROCESSING": return "teal";
    case "SHIPPED": return "blue";
    case "DELIVERED": return "green";
    case "CANCELLED": return "red";
    default: return "gray";
  }
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Ожидает",
    PAID: "Оплачен",
    PROCESSING: "В обработке",
    SHIPPED: "В пути",
    DELIVERED: "Доставлен",
    CANCELLED: "Отменён",
  };
  return labels[status] ?? status;
}

interface KpiCardProps {
  label: string;
  value: string;
  loading?: boolean;
}

function KpiCard({ label, value, loading }: KpiCardProps) {
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
        size="xs"
        fw={600}
        style={{
          color: "var(--te-accent)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <Group gap={8} align="center">
        {loading ? (
          <Skeleton height={28} width={80} />
        ) : (
          <>
            <Text
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--te-text)",
                lineHeight: 1,
              }}
            >
              {value}
            </Text>
            <IconTrendingUp size={20} color="var(--te-accent)" />
          </>
        )}
      </Group>
    </Box>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getDashboard(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={32}>
        <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>
          Дашборд
        </Text>

        {/* KPI Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
          <KpiCard label="Товары всего" value={String(data?.productsTotal ?? 0)} loading={isLoading} />
          <KpiCard label="Заказы" value={String(data?.ordersTotal ?? 0)} loading={isLoading} />
          <KpiCard
            label="Выручка"
            value={data ? formatPrice(data.revenueTotal) : "—"}
            loading={isLoading}
          />
          <KpiCard label="AI Запросы" value={String(data?.aiRequestsTotal ?? 0)} loading={isLoading} />
        </SimpleGrid>

        {/* Recent Orders */}
        <Box>
          <Text fw={600} style={{ color: "var(--te-text)", marginBottom: 16, fontSize: 16 }}>
            Последние заказы
          </Text>
          <Box
            style={{
              background: "var(--te-surface)",
              border: "1px solid var(--te-line)",
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <Box p="md"><Stack gap="sm">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={40} />)}</Stack></Box>
            ) : (
              <Table
                striped={false}
                highlightOnHover
                style={{ "--table-highlight-on-hover-color": "rgba(255,255,255,0.03)" } as React.CSSProperties}
              >
                <Table.Thead>
                  <Table.Tr style={{ borderBottom: "1px solid var(--te-line)" }}>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>ID</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Email</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Дата</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Статус</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Сумма</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(data?.recentOrders ?? []).map((order) => (
                    <Table.Tr key={order.id} style={{ borderBottom: "1px solid var(--te-line)" }}>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {order.id.length > 12 ? `${order.id.slice(0, 12)}…` : order.id}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-muted)" }}>
                          {order.userEmail ?? "—"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-muted)" }}>
                          {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)} radius={0} size="sm" variant="light">
                          {getStatusLabel(order.status)}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {formatPrice(order.total)}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Box>
        </Box>

        {/* Top Products */}
        <Box>
          <Text fw={600} style={{ color: "var(--te-text)", marginBottom: 16, fontSize: 16 }}>
            Топ товары
          </Text>
          <Box
            style={{
              background: "var(--te-surface)",
              border: "1px solid var(--te-line)",
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <Box p="md"><Stack gap="sm">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={40} />)}</Stack></Box>
            ) : (
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr style={{ borderBottom: "1px solid var(--te-line)" }}>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12, width: 48 }}>#</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Товар</Table.Th>
                    <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Продано</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(data?.topProducts ?? []).map((product, idx) => (
                    <Table.Tr key={product.id} style={{ borderBottom: "1px solid var(--te-line)" }}>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-accent)", fontWeight: 600 }}>
                          {idx + 1}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-text)" }}>{product.title}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {product.soldCount}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
