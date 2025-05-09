import { Badge, Box, Card, Group, Image, Stack, Text } from "@mantine/core";
import Link from "next/link";

type FestiCardProps = {
  title: string;
  description: string;
  daysLeft: number;
  logourl: string;
  slug: string; // Unique identifier for route
};

export function FestiCard({
  title,
  description,
  daysLeft,
  logourl,
  slug,
}: FestiCardProps) {
  return (
    <Link href={`/festivals/${slug}`} style={{ textDecoration: "none" }}>
      <Card
        withBorder
        padding="lg"
        radius="md"
        mt={10}
        component="div"
        style={{ cursor: "pointer" }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack flex={1}>
            <Badge>{daysLeft} days left</Badge>
            <Text fz="lg" fw={500}>
              {title}
            </Text>
            <Text fz="sm" c="dimmed">
              {description}
            </Text>
          </Stack>

          <Box style={{ alignSelf: "flex-start" }}>
            <Image
              src={logourl}
              alt="Festival Image"
              height={120}
              width={120}
              fit="contain"
              radius="md"
            />
          </Box>
        </Group>
      </Card>
    </Link>
  );
}
