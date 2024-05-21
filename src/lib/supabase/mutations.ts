import { SupaRecipe } from "@/types";
import supabase from ".";

export async function pushChanges(
  addedChanges: Partial<SupaRecipe>[],
  updatedChanges: Partial<SupaRecipe>[],
  userId: string,
  nextUpdateTimestamp: number | undefined,
) {
  let newRecipes: SupaRecipe[] = [];
  if (updatedChanges.length > 0) {
    await supabase.from("Recipe").upsert(updatedChanges);
  }
  if (addedChanges.length > 0) {
    const { data, error: newError } = await supabase
      .from("Recipe")
      .insert(addedChanges)
      .select();
    if (data) {
      newRecipes = data;
    }
  }

  if (nextUpdateTimestamp) {
    await supabase
      .from("Sync")
      .update({
        updated_at: new Date(nextUpdateTimestamp).toISOString(),
      })
      .eq("user_id", userId);
  }

  return newRecipes;
}

export async function pushLastUpdateTimestamp(
  userId: string,
  timestamp: number | null = null,
) {
  const values: { user_id: string; updated_at?: string } = { user_id: userId };
  if (timestamp) {
    values["updated_at"] = new Date(timestamp).toISOString();
  }
  return supabase.from("Sync").insert(values).select();
}
