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
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import classes from "./Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import type { User } from "@supabase/supabase-js"; // <-- Add this import

export function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [user, setUser] = useState<User | null>(null); // <-- Add type
  const [role, setRole] = useState<string | null>(null); // <-- Add type
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (!error && profile) {
          setRole(profile.role); // ✅ Set role
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    };

    getSessionAndProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Box pb={30}>
      <header className={classes.header}>
        <Box pos="relative" w="100%" h="100%">
          <Group justify="space-between" h="100%">
            <Image src="/logo.png" alt="Logo" w={130} />

            {!loading && (
              <Group visibleFrom="sm">
                {user ? (
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <UnstyledButton aria-label="User menu">
                        <FiUser size={20} />
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        component={Link}
                        href="/account"
                        leftSection={<FiSettings size={16} />}
                      >
                        Account
                      </Menu.Item>

                      {role === "admin" && (
                        <Menu.Item
                          component={Link}
                          href="/admin"
                          leftSection={<FiUser size={16} />}
                        >
                          Admin
                        </Menu.Item>
                      )}

                      <Menu.Item
                        color="red"
                        onClick={handleLogout}
                        leftSection={<FiLogOut size={16} />}
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Button
                    component={Link}
                    href="/login"
                    variant="filled"
                    aria-label="Login or Sign up"
                  >
                    <FiLogIn size={20} />
                  </Button>
                )}
              </Group>
            )}

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>

          <Group
            visibleFrom="sm"
            gap="sm"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button
              component={Link}
              href="/"
              variant="subtle"
              size="md"
              radius="md"
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/dashboard"
              variant="subtle"
              size="md"
              radius="md"
            >
              Dashboard
            </Button>
          </Group>
        </Box>
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
          <Link href="/" className={classes.link}>
            Home
          </Link>
          <Link href="/dashboard" className={classes.link}>
            Dashboard
          </Link>

          {role === "admin" && (
            <>
              <Divider my="sm" />
              <Link href="/admin" className={classes.link}>
                Admin
              </Link>
            </>
          )}

          <Divider my="sm" />

          {!loading && (
            <Group justify="center" grow pb="xl" px="md">
              {user ? (
                <>
                  <Button
                    component={Link}
                    href="/account"
                    variant="default"
                    leftSection={<FiSettings size={16} />}
                  >
                    Account
                  </Button>
                  <Button
                    color="red"
                    onClick={handleLogout}
                    leftSection={<FiLogOut size={16} />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    variant="default"
                    leftSection={<FiLogIn size={16} />}
                  >
                    Log in
                  </Button>
                  <Button
                    component={Link}
                    href="/login"
                    leftSection={<FiLogIn size={16} />}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
