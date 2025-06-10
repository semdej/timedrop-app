"use client";

import { useState } from "react";
import {
  Anchor,
  Alert,
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData(e.currentTarget);
    const action = isLogin ? login : signup;
  
    try {
      const result = await action(formData);
      console.log("Result from action:", result);
  
      if (result?.error) {
        setError(result.error);
      } else {
        window.location.href = isLogin ? "/dashboard" : "/";
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            <Anchor
              component="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
            >
              Create account
            </Anchor>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Anchor
              component="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
            >
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
            <Alert color="red" mt="sm" title="Error">
              {error}
            </Alert>
          )}

          <Button type="submit" fullWidth mt="xl" radius="md" loading={loading}>
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
