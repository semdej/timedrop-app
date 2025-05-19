"use client";

import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Navbar.module.css";
import Link from "next/link";

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box pb={30}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Image src="/logo.png" alt="Logo" w={130} />

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/dashboard" className={classes.link}>
              Dashboard
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Link href="/login">
              <Button variant="filled">Log in / Sign up</Button>
            </Link>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="TimeDrop"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Link href="/dashboard" className={classes.link}>
            Dashboard
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
