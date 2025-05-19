import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Title, Text, Box, Stack, Divider, Container } from "@mantine/core";
import dayjs from "dayjs";
import { Navbar } from "@/components/Navbar";

type Props = {
  params: {
    slug: string;
  };
};

export default async function FestivalPage({ params }: Props) {
  const supabase = await createClient();

  const { data: festival, error: festErr } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!festival || festErr) return notFound();

  const { data: stages, error: stageErr } = await supabase
    .from("stages")
    .select(
      `
      id,
      name,
      performances (
        id,
        artist_name,
        start_time,
        end_time
      )
    `
    )
    .eq("festival_id", festival.id);

  if (!stages || stageErr) return notFound();

  return (
    <>
      <Navbar />

      <Container>
        <Box p="md">
          <Title order={2}>{festival.name}</Title>
          <Text size="sm" c="dimmed">
            {festival.location} • {festival.start_date} → {festival.end_date}
          </Text>

          <Divider my="md" />

          {stages.map((stage) => (
            <Box key={stage.id} mt="md">
              <Title order={4}>{stage.name}</Title>
              <Stack spacing="xs" mt="xs">
                {stage.performances
                  ?.sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime()
                  )
                  .map((p) => (
                    <Box key={p.id}>
                      <Text fw={500}>
                        {dayjs(p.start_time).format("HH:mm")} –{" "}
                        {dayjs(p.end_time).format("HH:mm")} • {p.artist_name}
                      </Text>
                    </Box>
                  ))}
                {stage.performances?.length === 0 && (
                  <Text size="sm" c="dimmed">
                    No performances scheduled.
                  </Text>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}
