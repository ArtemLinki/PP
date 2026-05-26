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
  TextInput,
} from "@mantine/core";
import { IconDownload, IconSearch } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { adminService, type AdminOrder } from "@/lib/services/admin/AdminApiService";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/dto";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function StatPill({ label, value }: { label: string; value: string }) {
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
      <Text style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "var(--te-text)", lineHeight: 1 }}>
        {value}
      </Text>
    </Box>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [appliedEmail, setAppliedEmail] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<OrderStatus | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", appliedEmail, appliedStatus],
    queryFn: () =>
      adminService.listOrders(
        1,
        200,
        appliedEmail || undefined,
        (appliedStatus as OrderStatus) || undefined,
      ),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-orders"] });
      notifications.show({ message: "Статус заказа обновлён", color: "teal" });
    },
    onError: () => notifications.show({ message: "Ошибка при обновлении статуса", color: "red" }),
  });

  const allOrders: AdminOrder[] = data?.items ?? [];

  const totalCount = data?.total ?? 0;
  const pendingCount = allOrders.filter((o) => o.status === "PENDING").length;
  const shippedCount = allOrders.filter((o) => o.status === "SHIPPED").length;
  const revenue = allOrders.reduce((acc, o) => acc + o.totalMinor, 0);

  const handleApplyFilters = () => {
    setAppliedEmail(emailFilter);
    setAppliedStatus(statusFilter);
  };

  const handleResetFilters = () => {
    setEmailFilter("");
    setStatusFilter("");
    setAppliedEmail("");
    setAppliedStatus("");
  };

  const handleExportCsv = () => {
    const rows = [
      ["ID", "Дата", "Email", "Позиций", "Сумма (руб)", "Статус"],
      ...allOrders.map((o) => [
        o.id,
        new Date(o.createdAt).toLocaleDateString("ru-RU"),
        o.userEmail,
        String(o.itemsCount),
        String(o.totalMinor / 100),
        o.status,
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

  return (
    <Box style={{ padding: 32 }}>
      <Stack gap={24}>
        {/* Title */}
        <Group justify="space-between" align="center">
          <Text style={{ fontSize: 24, fontWeight: 700, color: "var(--te-text)" }}>Заказы</Text>
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
          <StatPill label="Выручка" value={formatPrice({ amount: revenue, currency: "RUB" })} />
        </Group>

        {/* Filters */}
        <Group gap={8} align="flex-end">
          <TextInput
            placeholder="Фильтр по email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            leftSection={<IconSearch size={14} />}
            size="xs"
            style={{ width: 220 }}
            styles={{ input: { borderColor: "var(--te-line)", background: "var(--te-surface)", color: "var(--te-text)" } }}
          />
          <Select
            placeholder="Все статусы"
            data={STATUS_OPTIONS}
            value={statusFilter || null}
            onChange={(v) => setStatusFilter((v as OrderStatus) ?? "")}
            size="xs"
            clearable
            style={{ width: 160 }}
            radius={0}
          />
          <Button color="teal" size="xs" radius={0} onClick={handleApplyFilters}>
            Найти
          </Button>
          {(appliedEmail || appliedStatus) && (
            <Button variant="subtle" color="gray" size="xs" radius={0} onClick={handleResetFilters}>
              Сбросить
            </Button>
          )}
        </Group>

        {/* Table */}
        <Box style={{ background: "var(--te-surface)", border: "1px solid var(--te-line)", borderRadius: 0, overflow: "hidden" }}>
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
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Доставка</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Позиций</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Сумма</Table.Th>
                  <Table.Th style={{ color: "var(--te-muted)", fontWeight: 500, fontSize: 12 }}>Статус</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allOrders.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text style={{ color: "var(--te-muted)", padding: "24px 0", textAlign: "center" }}>
                        Нет заказов
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  allOrders.map((order) => (
                    <Table.Tr key={order.id} style={{ borderBottom: "1px solid var(--te-line)" }}>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {order.id.length > 14 ? `${order.id.slice(0, 14)}…` : order.id}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-muted)" }}>
                          {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ color: "var(--te-muted)" }}>{order.userEmail}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" style={{ color: "var(--te-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                          {order.deliveryCity
                            ? `${order.deliveryCity}${order.deliveryName ? ` · ${order.deliveryName}` : ""}`
                            : "—"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {order.itemsCount}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--te-text)" }}>
                          {formatPrice({ amount: order.totalMinor, currency: "RUB" })}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={8}>
                          <Badge color={getStatusColor(order.status)} radius={0} size="sm" variant="light">
                            {statusLabel(order.status)}
                          </Badge>
                          <Select
                            data={STATUS_OPTIONS}
                            value={order.status}
                            onChange={(v) => {
                              if (v) statusMutation.mutate({ id: order.id, status: v as OrderStatus });
                            }}
                            size="xs"
                            radius={0}
                            style={{ width: 140 }}
                            styles={{ input: { fontSize: 11 } }}
                          />
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
    </Box>
  );
}
