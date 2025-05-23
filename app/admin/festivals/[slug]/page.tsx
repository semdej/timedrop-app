export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Title, Text, Box, Divider, Container, Stack } from "@mantine/core";
import { AdminFestivalManager } from "@/components/AdminFestivalManager";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function AdminFestivalPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug;

  const supabase = await createClient();

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") redirect("/login");

  // Fetch festival
  const { data: festival, error: festErr } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!festival || festErr) return notFound();

  // Fetch stages and performances
  const { data: stages, error: stageErr } = await supabase
    .from("stages")
    .select("*, performances(*)")
    .eq("festival_id", festival.id)
    .order("created_at");

  if (!stages || stageErr) return notFound();

  return (
    <>
      <Navbar />
      <Container size="lg" py="xl">
        <Box p="md">
          <Stack gap="md">
            <BackButton />
            <Title order={2}>Edit: {festival.name}</Title>
            <Text size="sm" c="dimmed">
              {festival.location} • {festival.start_date} → {festival.end_date}
            </Text>
            <Divider />
            <AdminFestivalManager festival={festival} stages={stages} />
          </Stack>
        </Box>
      </Container>
    </>
  );
}
