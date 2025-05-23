"use client";

import { Stack, Text, Group, Button, Image, Box } from "@mantine/core";
import Link from "next/link";

type AdminFestiCardProps = {
  name: string;
  location: string;
  daysLeft: number;
  logourl: string;
  slug: string;
};

export function AdminFestiCard({
  name,
  location,
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
          <Text fw={500}>{name}</Text>
          <Text size="sm" c="dimmed">
            {location}
          </Text>
          <Text size="xs" c="gray">
            {daysLeft} days left
          </Text>
        </Stack>

        <Box style={{ alignSelf: "flex-start" }}>
          <Image
            src={logourl}
            alt="Festival Logo"
            width={60}
            height={60}
            fit="contain"
            radius="md"
            style={{ minWidth: 60 }}
          />
        </Box>
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
