"use client";

import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Image,
  Menu,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import classes from "./Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [user, setUser] = useState(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // or router.push('/login') if you want a redirect
  };

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
            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Text fw={500}>{user.email}</Text>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href="/account">
                    Account
                  </Menu.Item>
                  <Menu.Item color="red" onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link href="/login">
                <Button variant="filled">Log in / Sign up</Button>
              </Link>
            )}
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
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <Link href="/dashboard" className={classes.link}>
            Dashboard
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <>
                <Button component={Link} href="/account" variant="default">
                  Account
                </Button>
                <Button color="red" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/login" variant="default">
                  Log in
                </Button>
                <Button component={Link} href="/login">
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
