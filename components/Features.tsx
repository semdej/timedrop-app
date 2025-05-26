"use client";

import { Container, SimpleGrid, Text, Title, ThemeIcon } from "@mantine/core";
import { FaRegClock, FaRegCalendarAlt, FaHeadphonesAlt } from "react-icons/fa";
import classes from "./Features.module.css";

export function Features() {
  return (
    <div className={classes.background}>
      <Container pt={80} pb={80} size="lg" py="xl" className={classes.wrapper}>
        <Title order={2} className={classes.title}>
          Wat maakt <span className={classes.highlight}>Timedrop</span> uniek?
        </Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt="xl">
          <Feature
            icon={<FaRegCalendarAlt size={32} />}
            title="Altijd up-to-date"
            description="Timetables worden automatisch bijgewerkt – geen stress, altijd de juiste info."
          />
          <Feature
            icon={<FaRegClock size={32} />}
            title="Persoonlijke planning"
            description="Maak je eigen festivalplanning met een paar klikken. Simpel en snel."
          />
          <Feature
            icon={<FaHeadphonesAlt size={32} />}
            title="Herbeleef de sets"
            description="Bekijk welke tracks zijn gedraaid en herbeleef je favoriete optredens."
          />
        </SimpleGrid>
      </Container>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <ThemeIcon variant="light" size="xl" radius="xl" color="blue">
        {icon}
      </ThemeIcon>
      <Text fw={600} fz="xl" mt="sm">
        {title}
      </Text>
      <Text c="dimmed">{description}</Text>
    </div>
  );
}
