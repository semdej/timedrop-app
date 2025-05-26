"use client";

import { Container, Group, Text } from "@mantine/core";
import Link from "next/link";
import classes from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <Text size="sm" c="dimmed">
          © {new Date().getFullYear()} Timedrop. Alle rechten voorbehouden.
        </Text>
        <Group gap="md">
          <Link href="/privacy" className={classes.link}>
            Privacy
          </Link>
          <Link href="/terms" className={classes.link}>
            Voorwaarden
          </Link>
        </Group>
      </Container>
    </footer>
  );
}
