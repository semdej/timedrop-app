"use client";

import {
  Box,
  Stack,
  Text,
  Title,
  Paper,
  SegmentedControl,
  ActionIcon,
  Tooltip,
  Container,
  Group,
} from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/nl";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale("nl");
dayjs.updateLocale("nl", {
  relativeTime: {
    future: "over %s",
    past: "%s geleden",
    s: "een paar seconden",
    m: "één minuut",
    mm: "%d minuten",
    h: "een uur",
    hh: "%d uur",
    d: "een dag",
    dd: "%d dagen",
    M: "een maand",
    MM: "%d maanden",
    y: "een jaar",
    yy: "%d jaar",
  },
});

type Performance = {
  id: string;
  artist_name: string;
  start_time: string;
  end_time: string;
};

type Stage = {
  id: string;
  name: string;
  performances: Performance[];
};

type Props = {
  stages: Stage[];
};

export function ClientStageSchedule({ stages }: Props) {
  const [now, setNow] = useState(dayjs().tz("Europe/Amsterdam"));
  const [filter, setFilter] = useState<
    "all" | "live" | "upcoming" | "favorites"
  >("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs().tz("Europe/Amsterdam"));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("favorite_performances")
        .select("performance_id")
        .eq("user_id", session.user.id);

      if (data) {
        setFavoriteIds(data.map((f) => f.performance_id));
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (performanceId: string) => {
    if (!userId) return;

    const isFav = favoriteIds.includes(performanceId);
    if (isFav) {
      await supabase
        .from("favorite_performances")
        .delete()
        .eq("user_id", userId)
        .eq("performance_id", performanceId);
      setFavoriteIds(favoriteIds.filter((id) => id !== performanceId));
    } else {
      await supabase
        .from("favorite_performances")
        .insert({ user_id: userId, performance_id: performanceId });
      setFavoriteIds([...favoriteIds, performanceId]);
    }
  };

  const allPerformances = stages.flatMap((stage) =>
    stage.performances.map((p) => ({
      ...p,
      stageName: stage.name,
      stageId: stage.id,
    }))
  );

  const liveNow = allPerformances.find((p) => {
    const start = dayjs(p.start_time).tz("Europe/Amsterdam");
    const end = dayjs(p.end_time).tz("Europe/Amsterdam");
    return now.isAfter(start) && now.isBefore(end);
  });

  const groupedByDate: Record<string, Stage[]> = {};

  stages.forEach((stage) => {
    const datedPerformances = stage.performances.map((p) => ({
      ...p,
      date: dayjs(p.start_time).tz("Europe/Amsterdam").format("dddd D MMMM"),
    }));

    const dates = Array.from(new Set(datedPerformances.map((p) => p.date)));

    dates.forEach((date) => {
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push({
        ...stage,
        performances: datedPerformances.filter((p) => p.date === date),
      });
    });
  });

  return (
    <Box>
      <Container my="md">
        <SegmentedControl
          fullWidth
          value={filter}
          onChange={(value) => setFilter(value as any)}
          data={[
            { label: "Alles", value: "all" },
            { label: "Live", value: "live" },
            { label: "Komend", value: "upcoming" },
            { label: "Mijn schema", value: "favorites" },
          ]}
        />
      </Container>

      {Object.entries(groupedByDate).map(([date, stages]) => (
        <Box key={date} mt="xl">
          <Title order={3} mb="sm">
            {date.charAt(0).toUpperCase() + date.slice(1)}
          </Title>

          {stages.map((stage) => (
            <Box key={stage.id} mt="md">
              <Title order={4}>{stage.name}</Title>
              <Stack spacing="xs" mt="xs">
                {stage.performances
                  .sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime()
                  )
                  .filter((p) => {
                    const start = dayjs(p.start_time).tz("Europe/Amsterdam");
                    const end = dayjs(p.end_time).tz("Europe/Amsterdam");
                    if (filter === "live")
                      return now.isAfter(start) && now.isBefore(end);
                    if (filter === "upcoming") return now.isBefore(start);
                    if (filter === "favorites")
                      return favoriteIds.includes(p.id);
                    return true;
                  })
                  .map((p) => {
                    const start = dayjs(p.start_time).tz("Europe/Amsterdam");
                    const end = dayjs(p.end_time).tz("Europe/Amsterdam");
                    const isLive = now.isAfter(start) && now.isBefore(end);
                    const isUpcoming = now.isBefore(start);
                    const isFavorite = favoriteIds.includes(p.id);

                    let timeLabel = "";
                    if (isLive) timeLabel = "LIVE NU";
                    else if (isUpcoming)
                      timeLabel = `Straks (${now.to(start, true)})`;

                    return (
                      <Paper
                        key={p.id}
                        p="sm"
                        radius="md"
                        withBorder
                        bg={
                          isLive
                            ? "blue.1"
                            : isUpcoming
                              ? "gray.0"
                              : "transparent"
                        }
                        shadow={isLive ? "sm" : "none"}
                      >
                        <Group justify="space-between">
                          <Text fw={500} c={isLive ? "blue.9" : undefined}>
                            {start.format("HH:mm")} – {end.format("HH:mm")} •{" "}
                            {p.artist_name}
                            {timeLabel && (
                              <Text
                                span
                                fw={700}
                                ml="sm"
                                c={isLive ? "red" : "gray"}
                              >
                                {timeLabel}
                              </Text>
                            )}
                          </Text>

                          <Tooltip
                            label={
                              isFavorite
                                ? "Verwijder uit schema"
                                : "Voeg toe aan schema"
                            }
                          >
                            <ActionIcon
                              variant="subtle"
                              onClick={() => toggleFavorite(p.id)}
                            >
                              {isFavorite ? (
                                <IconStarFilled size={20} color="gold" />
                              ) : (
                                <IconStar size={20} />
                              )}
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Paper>
                    );
                  })}
              </Stack>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
