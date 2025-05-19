import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { FestiCard } from "@/components/FestiCard";
import { Container } from "@mantine/core";
import { Navbar } from "@/components/Navbar";

export default async function PrivatePage() {
  const supabase = await createClient();

  // Auth check
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    redirect("/login");
  }

  // Fetch festivals (you can expand this with joins later)
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

      <Container>
        <p>Hello {authData.user.email}</p>
        {festivals.map((festival) => {
          const start = new Date(festival.start_date);
          const daysLeft = Math.max(
            0,
            Math.ceil((start.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          );

          return (
            <FestiCard
              key={festival.id}
              title={festival.name}
              slug={festival.slug}
              description={`Location: ${festival.location}`}
              daysLeft={daysLeft}
              logourl={festival.logourl}
            />
          );
        })}
      </Container>
    </>
  );
}
