import { Button, Container, Group, Text } from "@mantine/core";
import classes from "./Hero.module.css";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";

export function Hero() {
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
