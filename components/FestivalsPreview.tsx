import {
  Card,
  Image,
  Text,
  Title,
  Container,
  SimpleGrid,
  Group,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export async function FestivalsPreview() {
  const supabase = await createClient();
  const { data: festivals, error } = await supabase
    .from("festivals")
    .select("id, name, location, start_date, end_date, logourl, slug")
    .order("start_date", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error fetching festivals:", error.message);
    return null;
  }

  if (!festivals || festivals.length === 0) {
    return null;
  }

  return (
    <Container size="lg" py="xl">
      <Title size={36} order={2} ta="center" mb="lg">
        Ontdek Festivals
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {festivals.map((festival) => (
          <Anchor
            key={festival.id}
            component={Link}
            href={`/festivals/${festival.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              shadow="md"
              radius="lg"
              withBorder
              p="md"
              style={{
                transition: "transform 150ms ease, box-shadow 150ms ease",
              }}
              className="hover:shadow-xl hover:scale-[1.02]"
            >
              {festival.logourl && (
                <Image
                  src={festival.logourl}
                  height={160}
                  alt={`${festival.name} logo`}
                  fit="contain"
                  radius="sm"
                  mb="sm"
                />
              )}

              <Group justify="space-between" mb="xs" wrap="nowrap">
                <Title order={4}>{festival.name}</Title>
              </Group>

              <Text c="dimmed" size="sm" truncate="end">
                {festival.location}
              </Text>

              <Text size="sm" mt="xs" c="blue">
                {formatDateRange(festival.start_date, festival.end_date)}
              </Text>
            </Card>
          </Anchor>
        ))}
      </SimpleGrid>
    </Container>
  );
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const sameDay = startDate.toDateString() === endDate.toDateString();
  return sameDay
    ? startDate.toLocaleDateString("nl-NL", options)
    : `${startDate.toLocaleDateString("nl-NL", options)} – ${endDate.toLocaleDateString(
        "nl-NL",
        options
      )}`;
}
