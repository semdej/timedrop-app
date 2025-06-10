"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: result, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Signup error:", error.message);
    return { error: error.message };
  }

  // Supabase's signUp returns a user and no session if email confirmation is required.
  // We return the full result to allow the client to handle this.
  return { success: true, result };
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // Ensure this URL is correctly configured in Supabase Auth Redirect URLs
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
    return { error: error.message };
  }

  return { success: true, data };
}