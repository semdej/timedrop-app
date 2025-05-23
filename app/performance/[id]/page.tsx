import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { createClient } from "@/utils/supabase/server";
import {
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { notFound } from "next/navigation";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function PerformancePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: performance } = await supabase
    .from("performances")
    .select(
      "id, artist_name, start_time, end_time, songs(title, start_time, end_time)"
    )
    .eq("id", params.id)
    .single();

  if (!performance) return notFound();

  const start = dayjs(performance.start_time).tz("Europe/Amsterdam");
  const end = dayjs(performance.end_time).tz("Europe/Amsterdam");

  return (
    <>
      <Navbar />
      <Container size="lg" py="xl">
        <Box p="md">
          <Stack gap="md">
            <BackButton />
            <Title order={2}>{performance.artist_name}</Title>
            <Text c="dimmed">
              {start.format("dddd D MMMM YYYY")} — {start.format("HH:mm")} tot{" "}
              {end.format("HH:mm")}
            </Text>

            <Divider my="sm" />

            <Title order={4}>Gespeelde nummers</Title>

            {performance.songs.length > 0 ? (
              <Stack>
                {performance.songs
                  .sort((a: any, b: any) =>
                    a.start_time && b.start_time
                      ? new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime()
                      : 0
                  )
                  .map(
                    (
                      song: {
                        title: string;
                        start_time?: string | null;
                        end_time?: string | null;
                      },
                      index: number
                    ) => (
                      <Box key={index}>
                        <Text fw={500}>• {song.title}</Text>
                        {song.start_time && song.end_time && (
                          <Text size="sm" c="dimmed">
                            {dayjs(song.start_time)
                              .tz("Europe/Amsterdam")
                              .format("HH:mm")}{" "}
                            –{" "}
                            {dayjs(song.end_time)
                              .tz("Europe/Amsterdam")
                              .format("HH:mm")}
                          </Text>
                        )}
                      </Box>
                    )
                  )}
              </Stack>
            ) : (
              <Text c="dimmed">Geen nummers geregistreerd.</Text>
            )}
          </Stack>
        </Box>
      </Container>
    </>
  );
}
