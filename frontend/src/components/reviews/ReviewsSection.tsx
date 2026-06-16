'use client';

import { useState } from 'react';
import {
  Box, Text, Stack, Group, Button, Textarea, Rating,
  ActionIcon, Skeleton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash, IconMessageReply, IconCheck, IconX } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store';
import { useServices } from '@/lib/services/ServicesProvider';
import { httpClient } from '@/lib/api/http-client';
import { endpoints } from '@/lib/api/endpoints';
import type { ReviewDto } from '@/lib/dto';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <Group gap={2}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} fz={14} c={i < rating ? 'yellow' : 'var(--te-line)'}>★</Text>
      ))}
    </Group>
  );
}

function ReviewCard({ review, canDelete, isAdmin, onDelete, onReplyUpdated }: {
  review: ReviewDto;
  canDelete: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  onReplyUpdated: (reviewId: string, reply: string | null) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState(review.adminReply ?? '');
  const [saving, setSaving] = useState(false);

  const handleSaveReply = async () => {
    setSaving(true);
    try {
      await httpClient.patch(endpoints.admin.reviewReply(review.id), { reply: replyText || null });
      onReplyUpdated(review.id, replyText || null);
      setReplyOpen(false);
      notifications.show({ message: 'Ответ сохранён', color: 'teal' });
    } catch {
      notifications.show({ message: 'Ошибка при сохранении ответа', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReply = async () => {
    setSaving(true);
    try {
      await httpClient.patch(endpoints.admin.reviewReply(review.id), { reply: null });
      onReplyUpdated(review.id, null);
      setReplyText('');
      setReplyOpen(false);
      notifications.show({ message: 'Ответ удалён', color: 'gray' });
    } catch {
      notifications.show({ message: 'Ошибка при удалении ответа', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p="md" style={{ background: 'var(--te-bg-deep)', border: '1px solid var(--te-line)' }}>
      <Group justify="space-between" mb={6}>
        <Group gap="sm">
          <Text size="sm" fw={600} c="var(--te-text)">{review.authorName}</Text>
          <StarDisplay rating={review.rating} />
        </Group>
        <Group gap="xs">
          <Text size="xs" c="dimmed">
            {new Date(review.createdAt).toLocaleDateString('ru-RU')}
          </Text>
          {isAdmin && (
            <ActionIcon size="xs" variant="subtle" color="teal"
              onClick={() => { setReplyText(review.adminReply ?? ''); setReplyOpen(v => !v); }}
              title="Ответить">
              <IconMessageReply size={12} />
            </ActionIcon>
          )}
          {canDelete && (
            <ActionIcon size="xs" variant="subtle" color="red" onClick={onDelete} aria-label="Удалить отзыв">
              <IconTrash size={12} />
            </ActionIcon>
          )}
        </Group>
      </Group>
      {review.comment && (
        <Text size="sm" c="var(--te-muted)" mt={4} style={{ lineHeight: 1.6 }}>
          {review.comment}
        </Text>
      )}

      {/* Existing admin reply */}
      {review.adminReply && !replyOpen && (
        <Box mt={10} p="sm" style={{ background: 'rgba(0,212,181,0.06)', borderLeft: '3px solid var(--te-accent)' }}>
          <Text size="xs" fw={600} c="teal.6" mb={4}>Ответ магазина</Text>
          <Text size="sm" c="var(--te-text)">{review.adminReply}</Text>
          {isAdmin && (
            <Group gap={4} mt={6}>
              <Button size="xs" variant="subtle" color="teal" radius={0} onClick={() => { setReplyText(review.adminReply ?? ''); setReplyOpen(true); }}>
                Изменить
              </Button>
              <Button size="xs" variant="subtle" color="red" radius={0} onClick={handleDeleteReply} loading={saving}>
                Удалить
              </Button>
            </Group>
          )}
        </Box>
      )}

      {/* Reply form (admin only) */}
      {replyOpen && isAdmin && (
        <Box mt={10}>
          <Textarea
            placeholder="Ответ от магазина…"
            value={replyText}
            onChange={e => setReplyText(e.currentTarget.value)}
            autosize minRows={2} radius={0}
            styles={{ input: { background: 'var(--te-bg)', borderColor: 'var(--te-accent)', color: 'var(--te-text)' } }}
          />
          <Group gap={6} mt={6}>
            <ActionIcon variant="filled" color="teal" size="sm" radius={0} onClick={handleSaveReply} loading={saving} title="Сохранить">
              <IconCheck size={12} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" size="sm" radius={0} onClick={() => setReplyOpen(false)} title="Отмена">
              <IconX size={12} />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Box>
  );
}

interface Props {
  productId: string;
}

export function ReviewsSection({ productId }: Props) {
  const services = useServices();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => services.reviews.getByProduct(productId),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: () => services.reviews.create({ productId, rating, comment: comment || undefined }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setComment('');
      setRating(5);
      setShowForm(false);
      notifications.show({ message: 'Отзыв добавлен', color: 'teal' });
    },
    onError: (err: any) => {
      notifications.show({ title: 'Ошибка', message: err?.message ?? 'Не удалось добавить отзыв', color: 'red' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => services.reviews.remove(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      notifications.show({ message: 'Отзыв удалён', color: 'gray' });
    },
  });

  const handleReplyUpdated = (reviewId: string, reply: string | null) => {
    queryClient.setQueryData(['reviews', productId], (old: ReviewDto[] | undefined) =>
      old?.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r)
    );
  };

  const alreadyReviewed = user && reviews?.some((r) => r.userId === user.id);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Box mt={56}>
      <Group justify="space-between" mb="md">
        <Text fw={700} c="var(--te-text)" fz={16}>
          Отзывы
          {reviews && reviews.length > 0 && (
            <Text component="span" fw={400} size="sm" c="dimmed" ml={8}>{reviews.length}</Text>
          )}
        </Text>
        {user && !alreadyReviewed && !showForm && !isAdmin && (
          <Button
            variant="outline"
            color="teal"
            size="xs"
            radius={0}
            style={{ borderColor: 'var(--te-accent)' }}
            onClick={() => setShowForm(true)}
          >
            Написать отзыв
          </Button>
        )}
        {!user && (
          <Button variant="subtle" color="gray" size="xs" component="a" href="/login">
            Войдите, чтобы оставить отзыв
          </Button>
        )}
      </Group>

      {/* Write review form */}
      {showForm && (
        <Box
          p="xl"
          mb="lg"
          style={{ background: 'var(--te-surface)', border: '1px solid var(--te-accent)' }}
        >
          <Text size="sm" fw={600} c="var(--te-text)" mb="md">Ваш отзыв</Text>
          <Stack gap="md">
            <Box>
              <Text size="xs" c="var(--te-muted)" mb={6}>Оценка</Text>
              <Rating value={rating} onChange={setRating} size="lg" color="yellow" />
            </Box>
            <Textarea
              label="Комментарий (необязательно)"
              placeholder="Расскажите о товаре..."
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              autosize
              minRows={3}
              maxRows={6}
              styles={{
                input: {
                  background: 'var(--te-bg)',
                  borderColor: 'var(--te-line)',
                  color: 'var(--te-text)',
                },
              }}
            />
            <Group>
              <Button
                color="teal"
                radius={0}
                size="sm"
                loading={createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                Опубликовать
              </Button>
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Отмена
              </Button>
            </Group>
          </Stack>
        </Box>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <Stack gap="sm">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={80} radius={0} />)}
        </Stack>
      ) : !reviews || reviews.length === 0 ? (
        <Box
          p="xl"
          style={{ background: 'var(--te-surface)', border: '1px solid var(--te-line)', textAlign: 'center' }}
        >
          <Text size="sm" c="dimmed">Отзывов пока нет. Станьте первым!</Text>
        </Box>
      ) : (
        <Stack gap="sm">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              canDelete={user?.id === review.userId || isAdmin}
              isAdmin={isAdmin}
              onDelete={() => deleteMutation.mutate(review.id)}
              onReplyUpdated={handleReplyUpdated}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
