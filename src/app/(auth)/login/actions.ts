"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/core/supabase/server";
import { ensurePublicUser } from "@/features/auth/sync-user";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" };
  }

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user?.email) {
    await ensurePublicUser(data.user.id, data.user.email);
  }

  redirect("/dashboard");
}
