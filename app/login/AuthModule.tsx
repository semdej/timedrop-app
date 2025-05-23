"use client";

import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { login, signup } from "./actions";
import classes from "./Auth.module.css";

export function AuthModule() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const action = isLogin ? login : signup;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      // Only redirect on success (or use router.push if needed)
      window.location.href = isLogin ? "/dashboard" : "/";
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {isLogin ? "Welcome back!" : "Create your account"}
      </Title>

      <Text className={classes.subtitle}>
        {isLogin ? (
          <>
            Do not have an account yet?{" "}
            <Anchor component="button" onClick={() => setIsLogin(false)}>
              Create account
            </Anchor>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Anchor component="button" onClick={() => setIsLogin(true)}>
              Log in
            </Anchor>
          </>
        )}
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            name="email"
            placeholder="you@timedrop.nl"
            required
            radius="md"
            type="email"
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
          </Group>
          {error && (
            <Text color="red" mt="sm" size="sm">
              {error}
            </Text>
          )}
          <Button type="submit" fullWidth mt="xl" radius="md">
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
