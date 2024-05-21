import supabase from ".";

export async function pullRecipeChangesSince(
  userId: string,
  timestamp: number | null,
) {
  if (timestamp) {
    return supabase
      .from("Recipe")
      .select()
      .gte("updated_at", new Date(timestamp).toISOString())
      .eq("user_id", userId);
  }

  return supabase.from("Recipe").select().eq("user_id", userId);
}

export async function pullLastUpdateTimestamp(userId: string) {
  return supabase.from("Sync").select().eq("user_id", userId);
}
