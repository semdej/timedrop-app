import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";

type FestiCardProps = {
  title: string;
  description: string;
  daysLeft: number;
  logourl: string;
  slug: string;
};

export function FestiCard({
  title,
  description,
  daysLeft,
  logourl,
  slug,
}: FestiCardProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
          gap="md"
          style={{
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Stack flex={1} spacing="xs">
            <Badge>{daysLeft} days left</Badge>
            <Text fz="lg" fw={500}>
              {title}
            </Text>
            <Text fz="sm" c="dimmed">
              {description}
            </Text>
          </Stack>

          <Box
            style={{
              alignSelf: isMobile ? "center" : "flex-start",
              marginTop: isMobile ? theme.spacing.md : 0,
            }}
          >
            <Image
              src={logourl}
              alt="Festival Image"
              height={isMobile ? 100 : 120}
              width={isMobile ? 100 : 120}
              fit="contain"
              radius="md"
            />
          </Box>
        </Group>
      </Card>
    </Link>
  );
}
