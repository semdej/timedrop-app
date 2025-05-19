export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Title, Text, Box, Divider, Container } from "@mantine/core";
import { Navbar } from "@/components/Navbar";
import { ClientStageSchedule } from "@/components/ClientStageSchedule";

export default async function FestivalPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const paramsSlug = params.slug;

  const { data: festival, error: festErr } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", paramsSlug) // ✅ this is valid
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
          <ClientStageSchedule stages={stages} />
        </Box>
      </Container>
    </>
  );
}
