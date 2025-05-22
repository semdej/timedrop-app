'use client';

import { Button } from '@mantine/core';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="light"
      size="xs"
      w="fit-content"
    >
      ← Terug
    </Button>
  );
}
