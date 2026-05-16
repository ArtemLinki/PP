"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Group,
  Text,
  SimpleGrid,
  Badge,
  Table,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { formatPrice } from "@/lib/format";
import type { PriceDto } from "@/lib/dto";
import type { OrderStatus } from "@/lib/dto";

interface RecentOrder {
  id: string;
  status: OrderStatus;
  total: PriceDto;
  createdAt: string;
}

interface TopProduct {
  id: string;
  title: string;
  soldCount: number;
}

interface DashboardData {
  productsTotal: number;
  ordersTotal: number;
  revenueTotal: PriceDto;
  aiRequestsTotal: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

const mockDashboard: DashboardData = {
  productsTotal: 42,
  ordersTotal: 128,
  revenueTotal: { amount: 2847500, currency: "RUB" },
  aiRequestsTotal: 847,
  recentOrders: [
    {
      id: "ord-001",
      status: "SHIPPED",
      total: { amount: 49900, currency: "RUB" },
      createdAt: "2025-05-14T10:00:00Z",
    },
    {
      id: "ord-002",
      status: "DELIVERED",
      total: { amount: 12300, currency: "RUB" },
      createdAt: "2025-05-13T15:30:00Z",
    },
    {
      id: "ord-003",
      status: "PENDING",
      total: { amount: 8900, currency: "RUB" },
      createdAt: "2025-05-13T09:15:00Z",
    },
  ],
  topProducts: [
    { id: "1", title: "ESP32-S3 DevKit", soldCount: 34 },
    { id: "2", title: "RPi Pico W", soldCount: 28 },
    { id: "3", title: "Arduino Uno R4", soldCount: 21 },
  ],
};

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "gray";
    case "PAID":
    case "PROCESSING":
      return "teal";
    case "SHIPPED":
      return "blue";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
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
  trend?: "up" | "down";
}

function KpiCard({ label, value, trend }: KpiCardProps) {
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
        {trend === "up" && <IconTrendingUp size={20} color="var(--te-accent)" />}
        {trend === "down" && <IconTrendingDown size={20} color="#ff5c5c" />}
      </Group>
    </Box>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setData(mockDashboard);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <Box style={{ padding: 32 }}>
        <Text style={{ color: "var(--te-muted)" }}>Загрузка...</Text>
      </Box>
    );
  }

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={32}>
        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--te-text)",
          }}
        >
          Дашборд
        </Text>

        {/* KPI Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={16}>
          <KpiCard
            label="Товары всего"
            value={String(data.productsTotal)}
            trend="up"
          />
          <KpiCard
            label="Заказы"
            value={String(data.ordersTotal)}
            trend="up"
          />
          <KpiCard
            label="Выручка"
            value={formatPrice(data.revenueTotal)}
            trend="up"
          />
          <KpiCard
            label="AI Запросы"
            value={String(data.aiRequestsTotal)}
            trend="up"
          />
        </SimpleGrid>

        {/* Recent Orders */}
        <Box>
          <Text
            fw={600}
            style={{ color: "var(--te-text)", marginBottom: 16, fontSize: 16 }}
          >
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
            <Table
              striped={false}
              highlightOnHover
              style={{ "--table-highlight-on-hover-color": "rgba(255,255,255,0.03)" } as React.CSSProperties}
            >
              <Table.Thead>
                <Table.Tr style={{ borderBottom: "1px solid var(--te-line)" }}>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>ID</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Дата</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Статус</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Сумма</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.recentOrders.map((order) => (
                  <Table.Tr key={order.id} style={{ borderBottom: "1px solid var(--te-line)" }}>
                    <Table.Td>
                      <Text
                        size="sm"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "var(--te-text)",
                        }}
                      >
                        {order.id.length > 12 ? `${order.id.slice(0, 12)}…` : order.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: "var(--te-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(order.status)}
                        radius={0}
                        size="sm"
                        variant="light"
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "var(--te-text)",
                        }}
                      >
                        {formatPrice(order.total)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Box>

        {/* Top Products */}
        <Box>
          <Text
            fw={600}
            style={{ color: "var(--te-text)", marginBottom: 16, fontSize: 16 }}
          >
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
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ borderBottom: "1px solid var(--te-line)" }}>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12, width: 48 }}>#</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Товар</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Продано</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.topProducts.map((product, idx) => (
                  <Table.Tr key={product.id} style={{ borderBottom: "1px solid var(--te-line)" }}>
                    <Table.Td>
                      <Text
                        size="sm"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "var(--te-accent)",
                          fontWeight: 600,
                        }}
                      >
                        {idx + 1}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: "var(--te-text)" }}>
                        {product.title}
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
                        {product.soldCount}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
