"use client";

import { Navbar } from "@/components/Navbar";
import { AuthModule } from "./AuthModule";
import { Container } from "@mantine/core";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <Container size="lg" py="xl">
        <AuthModule />
      </Container>
    </>
  );
}
