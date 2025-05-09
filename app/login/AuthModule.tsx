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
import { login, signup } from "./actions"; // Your server actions
import classes from "./Auth.module.css";

export function AuthModule() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login/signup forms

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
        <form action={isLogin ? login : signup}>
          <TextInput
            label="Email"
            name="email"
            placeholder="you@mantine.dev"
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
          <Button type="submit" fullWidth mt="xl" radius="md">
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
