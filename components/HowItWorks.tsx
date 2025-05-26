"use client";

import { Box, Container, Stack, Text, Title } from "@mantine/core";
import {
  TbUserPlus,
  TbCalendarTime,
  TbPlaylist,
  TbPlayerPlay,
} from "react-icons/tb";
import { IconType } from "react-icons";
import classes from "./HowItWorks.module.css";

interface StepProps {
  icon: IconType;
  title: string;
}

const steps: StepProps[] = [
  { icon: TbUserPlus, title: "Account aanmaken" },
  { icon: TbCalendarTime, title: "Festival selecteren" },
  { icon: TbPlaylist, title: "Planning samenstellen" },
  { icon: TbPlayerPlay, title: "Live volgen & herbeleven" },
];

export function HowItWorks() {
  return (
    <Container pt={60} pb={80} size="lg" py="xl">
      <Title size={36} order={2} className={classes.title}>
        Zo werkt het
      </Title>

      <div className={classes.steps}>
        {steps.map((step, index) => (
          <Stack key={index} align="center" gap="xs" className={classes.step}>
            <Box className={classes.iconWrapper}>
              <step.icon size={24} />
            </Box>
            <Text ta="center" fw={500}>
              {step.title}
            </Text>
          </Stack>
        ))}
      </div>
    </Container>
  );
}
