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
  Divider,
  rem,
} from "@mantine/core";
import { login, signup, signInWithGoogle } from "./actions";
import classes from "./Auth.module.css";
// Import the Google icon from react-icons/fc (Flat Color Icons)
import { FcGoogle } from 'react-icons/fc';


export function AuthModule() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        // Redirect only if there's no error and it's not an email confirmation flow (for signup)
        if (result?.success && !(result.result?.user && !result.result?.session)) {
          window.location.href = isLogin ? "/dashboard" : "/";
        } else if (result?.success && result.result?.user && !result.result?.session) {
          // Handle email confirmation for signup (Supabase's default behavior)
          setError("Please check your email to confirm your account.");
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.error) {
        setError(result.error);
      } else if (result?.data?.url) { // Check if a URL is returned from the server action
        // Explicitly redirect the user to the OAuth provider's URL
        window.location.href = result.data.url;
      } else {
        // Fallback for unexpected successful response without a URL
        console.warn("Google sign-in action succeeded but no redirect URL was provided.");
        setError("Something went wrong with Google sign-in. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected error during Google sign-in:", err);
      setError("Something went wrong with Google sign-in. Please try again.");
    } finally {
      // In a successful OAuth flow, this finally block might not run
      // if window.location.href redirects immediately.
      // However, it's good practice for error paths.
      setGoogleLoading(false);
    }
  };
  

  return (
    // The Fragment <> </> is necessary here because there's only one root element
    // and the previous code had two root elements implicitly if not wrapped.
    // However, looking at the previous input, `Container` was already the direct child
    // of `return`, so the outer `<></>` might be redundant if `Container` is the sole root.
    // Keeping it here for safety, but if your previous code compiled without it,
    // you can remove it.
    <>
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
        <Button
          fullWidth
          variant="default"
          // Use the imported FcGoogle component directly
          leftSection={<FcGoogle style={{ fontSize: rem(20) }} />}
          onClick={handleGoogleSignIn}
          loading={googleLoading}
        >
          Sign in with Google
        </Button>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

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
    </>
  );
}
