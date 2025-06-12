export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Title, Text, Box, Divider, Container, Stack } from "@mantine/core";
import { Navbar } from "@/components/Navbar";
import { ClientStageSchedule } from "@/components/ClientStageSchedule";
import { BackButton } from "@/components/BackButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function FestivalPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;

  if (!/^[a-zA-Z0-9-]+$/.test(slug)) return notFound();

  const supabase = await createClient();

  // ✅ Auth check
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: festival, error: festErr } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", slug)
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
      <Container size="lg" py="xl">
        <Box p="md">
          <Stack gap="md">
            <BackButton />
            <Title order={2}>{festival.name}</Title>
            <Text size="sm" c="dimmed">
              {festival.location} • {festival.start_date} → {festival.end_date}
            </Text>
            <Divider my="md" />
            <ClientStageSchedule stages={stages} />
          </Stack>
        </Box>
      </Container>
    </>
  );
}
