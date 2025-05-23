export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Title, Text, Box, Divider, Container, Stack } from "@mantine/core";
import { AdminFestivalManager } from "@/components/AdminFestivalManager";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminFestivalPage(props: PageProps) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") redirect("/login");

  const { data: festival, error: festErr } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!festival || festErr) return notFound();

  const { data: stages, error: stageErr } = await supabase
    .from("stages")
    .select("*, performances(*)")
    .eq("festival_id", festival.id)
    .order("created_at");

  if (!stages || stageErr) return notFound();

  return (
    <>
      <Navbar />
      <Container size="lg" py="xl" px={{ base: "sm", sm: "xl" }}>
        <Box p={{ base: "sm", sm: "md" }}>
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
