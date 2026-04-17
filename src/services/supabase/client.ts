import { createClient } from "@supabase/supabase-js";

function normalize(value: string | undefined) {
  return value?.trim() ?? "";
}

function getRuntimeConfig() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.__APP_CONFIG;
}

const runtimeConfig = getRuntimeConfig();
const supabaseUrl =
  normalize(runtimeConfig?.VITE_SUPABASE_URL) ||
  normalize(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey =
  normalize(runtimeConfig?.VITE_SUPABASE_ANON_KEY) ||
  normalize(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "认证服务尚未配置，请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。",
    );
  }

  return supabase;
}

export function getAuthRedirectUrl() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const redirectUrl = new URL("/", window.location.origin);
  redirectUrl.hash = "/auth";
  return redirectUrl.toString();
}
