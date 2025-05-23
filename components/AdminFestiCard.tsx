"use client";

import { Stack, Text, Group, Button, Image } from "@mantine/core";
import Link from "next/link";

type AdminFestiCardProps = {
  title: string;
  description: string;
  daysLeft: number;
  logourl: string;
  slug: string;
};

export function AdminFestiCard({
  title,
  description,
  daysLeft,
  logourl,
  slug,
}: AdminFestiCardProps) {
  return (
    <Stack
      p="md"
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 12,
        backgroundColor: "white",
      }}
    >
      <Group justify="space-between" align="center">
        <Stack style={{ flex: 1 }}>
          <Text fw={500}>{title}</Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
          <Text size="xs" c="gray">
            {daysLeft} days left
          </Text>
        </Stack>

        <Image
          src={logourl}
          alt="Festival Logo"
          width={60}
          height={60}
          fit="contain"
          radius="md"
        />
      </Group>

      <Button
        component={Link}
        href={`/admin/festivals/${slug}`}
        variant="light"
        color="blue"
        fullWidth
        mt="sm"
      >
        Edit Timetable
      </Button>
    </Stack>
  );
}
