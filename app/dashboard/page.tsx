import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Container, Title, Text, Space } from "@mantine/core";
import { Navbar } from "@/components/Navbar";
import SearchableFestivals from "@/components/SearchableFestivals";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/login");
  }

  const { data: festivals, error: fetchError } = await supabase
    .from("festivals")
    .select("*")
    .order("start_date", { ascending: true });

  if (fetchError) {
    return <p>Could not load festivals.</p>;
  }

  return (
    <>
      <Navbar />
      <Container size="lg" py="xl">
        <Title order={2} mb="sm">
          Welcome back!
        </Title>
        <Text size="md" color="dimmed">
          Hello <strong>{authData.user.email}</strong>, here are the upcoming
          festivals:
        </Text>
        <Space h="xl" />
        <SearchableFestivals festivals={festivals} />
      </Container>
    </>
  );
}
