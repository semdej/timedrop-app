"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import {
  Button,
  Container,
  Group,
  TextInput,
  Title,
  Paper,
  Loader,
  Stack,
  Divider,
} from "@mantine/core";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || null);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const updateProfile = async () => {
    if (!user?.id) {
      alert("User not found.");
      return;
    }

    try {
      setLoading(true);
      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error, status } = await supabase.from("profiles").upsert(updates);

      if (error) {
        console.error("Supabase error:", error.message, error.details);
        alert(`Update failed: ${error.message}`);
        return;
      }

      if (status !== 200 && status !== 201) {
        console.warn("Unexpected status code from upsert:", status);
      }

      alert("Profile updated!");
    } catch (err) {
      console.error("Unexpected error during update:", err);
      alert("An unexpected error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" mt="lg">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Title order={3} mb="md">
          Your Account
        </Title>
        {loading ? (
          <Loader />
        ) : (
          <Stack>
            <TextInput label="Email" value={user?.email ?? ""} disabled />

            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              placeholder="Enter your username"
            />

            <Group justify="space-between" mt="md">
              <Button onClick={updateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>

              <form action="/auth/signout" method="post">
                <Button variant="light" color="red" type="submit">
                  Sign out
                </Button>
              </form>
            </Group>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
