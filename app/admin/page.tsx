import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Container, Title, Text, SimpleGrid } from "@mantine/core";
import { Navbar } from "@/components/Navbar";
import { AdminFestiCard } from "@/components/AdminFestiCard";

export default async function AdminPage() {
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

  const { data: festivals, error: fetchError } = await supabase
    .from("festivals")
    .select("*")
    .order("start_date", { ascending: true });

  if (fetchError) {
    return (
      <Container size="lg" py="xl">
        <Text color="red">Could not load festivals.</Text>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container size="lg" py="xl">
        <Title order={2}>Admin Dashboard</Title>
        <Text size="md" color="dimmed" mb="xl">
          Welcome, <strong>{user.email}</strong>. Here you can manage festivals
          and their timetables.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {festivals.map((festival: any) => (
            <AdminFestiCard
              key={festival.id}
              title={festival.title}
              description={festival.description}
              daysLeft={calculateDaysLeft(festival.start_date)}
              logourl={festival.logo_url}
              slug={festival.slug}
            />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

function calculateDaysLeft(dateString: string): number {
  const start = new Date(dateString);
  const today = new Date();
  const diffTime = start.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}
