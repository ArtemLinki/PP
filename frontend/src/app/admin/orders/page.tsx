"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Table,
  Select,
  Button,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { services } from "@/lib/services";
import { formatPrice } from "@/lib/format";
import type { OrderDto, OrderStatus } from "@/lib/dto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Ожидает" },
  { value: "PAID", label: "Оплачен" },
  { value: "PROCESSING", label: "В обработке" },
  { value: "SHIPPED", label: "В пути" },
  { value: "DELIVERED", label: "Доставлен" },
  { value: "CANCELLED", label: "Отменён" },
];

function statusLabel(status: OrderStatus): string {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

interface StatPillProps {
  label: string;
  value: string;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <Box
      style={{
        background: "var(--te-surface)",
        border: "1px solid var(--te-line)",
        borderRadius: 0,
        padding: "12px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Text size="xs" fw={600} style={{ color: "var(--te-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--te-text)",
          lineHeight: 1,
        }}
      >
        {value}
      </Text>
    </Box>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [localStatuses, setLocalStatuses] = useState<Record<string, OrderStatus>>({});

  const { data: orders, isLoading } = useQuery<OrderDto[]>({
    queryKey: ["admin-orders"],
    queryFn: () => services.orders.list(),
  });

  const allOrders = orders ?? [];

  // Derived stats
  const totalCount = allOrders.length;
  const pendingCount = allOrders.filter(
    (o) => (localStatuses[o.id] ?? o.status) === "PENDING",
  ).length;
  const shippedCount = allOrders.filter(
    (o) => (localStatuses[o.id] ?? o.status) === "SHIPPED",
  ).length;
  const revenue = allOrders.reduce(
    (acc, o) => acc + o.total.amount,
    0,
  );

  const handleExportCsv = () => {
    const rows = [
      ["ID", "Дата", "Позиций", "Сумма (руб)", "Статус"],
      ...allOrders.map((o) => [
        o.id,
        new Date(o.createdAt).toLocaleDateString("ru-RU"),
        String(o.items.length),
        String(o.total.amount / 100),
        localStatuses[o.id] ?? o.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
    notifications.show({
      message: `Статус заказа ${orderId} обновлён`,
      color: "teal",
    });
  };

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        {/* Title */}
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>
            Заказы
          </Text>
          <Button
            size="xs"
            variant="default"
            leftSection={<IconDownload size={14} />}
            style={{ borderColor: "var(--te-line)" }}
            onClick={handleExportCsv}
            disabled={allOrders.length === 0}
          >
            Экспорт CSV
          </Button>
        </Group>

        {/* Stat pills */}
        <Group gap={12}>
          <StatPill label="Всего" value={String(totalCount)} />
          <StatPill label="Ожидают" value={String(pendingCount)} />
          <StatPill label="В пути" value={String(shippedCount)} />
          <StatPill
            label="Выручка"
            value={formatPrice({ amount: revenue, currency: "RUB" })}
          />
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
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>ID заказа</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Дата</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Email</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Позиций</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Сумма</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Статус</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allOrders.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text
                        style={{
                          color: "var(--te-muted)",
                          padding: "24px 0",
                          textAlign: "center",
                        }}
                      >
                        Нет заказов
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  allOrders.map((order) => {
                    const currentStatus = localStatuses[order.id] ?? order.status;
                    return (
                      <Table.Tr
                        key={order.id}
                        style={{ borderBottom: "1px solid var(--te-line)" }}
                      >
                        <Table.Td>
                          <Text
                            size="sm"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color: "var(--te-text)",
                            }}
                          >
                            {order.id.length > 14
                              ? `${order.id.slice(0, 14)}…`
                              : order.id}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" style={{ color: "var(--te-muted)" }}>
                            {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" style={{ color: "var(--te-muted)" }}>
                            —
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
                            {order.items.length}
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
                            {formatPrice(order.total)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={8}>
                            <Badge
                              color={getStatusColor(currentStatus)}
                              radius={0}
                              size="sm"
                              variant="light"
                            >
                              {statusLabel(currentStatus)}
                            </Badge>
                            <Select
                              data={STATUS_OPTIONS}
                              value={currentStatus}
                              onChange={(v) => {
                                if (v) handleStatusChange(order.id, v as OrderStatus);
                              }}
                              size="xs"
                              radius={0}
                              style={{ width: 140 }}
                              styles={{
                                input: { fontSize: 11 },
                              }}
                            />
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
