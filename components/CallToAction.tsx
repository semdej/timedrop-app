"use client";

import { Button, Container, Group, Text, Title } from "@mantine/core";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";
import classes from "./CallToAction.module.css";

export function CallToAction() {
  return (
    <div className={classes.wrapper}>
      <Container size="lg" className={classes.inner}>
        <Title order={2} className={classes.title}>
          Klaar om je festivaldag te plannen?
        </Title>
        <Text c="dimmed" mt="sm" className={classes.text}>
          Ervaar Timedrop nu gratis. Geen gedoe, gewoon genieten.
        </Text>

        <Group mt="xl" justify="center">
          <Link href="/login">
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
              leftSection={<FiLogIn />}
            >
              Start Nu
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}
