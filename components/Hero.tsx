"use client";

import { useEffect, useState } from "react";
import { Button, Container, Group, Text } from "@mantine/core";
import classes from "./Hero.module.css";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client"; // adjust path if needed
import { Session } from "@supabase/supabase-js";

export function Hero() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          Dé{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Nieuwe Manier
          </Text>{" "}
          Van Timetables Bekijken
        </h1>

        <Text className={classes.description} color="dimmed">
          Plan je perfecte festivaldag met Timedrop – dé gratis app voor
          festivalfans. Bekijk volledige timetables, ontdek welke tracks er live
          zijn gedraaid, herbeleef elke set én stel je eigen persoonlijke schema
          samen. Alles op één plek, helemaal gratis.
        </Text>

        <Group className={classes.controls}>
          {!session && (
            <Link href="/login">
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                leftSection={<FiLogIn size={20} />}
              >
                Inloggen
              </Button>
            </Link>
          )}

          <Link href="/dashboard">
            <Button size="xl" variant="default" className={classes.control}>
              Dashboard
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
