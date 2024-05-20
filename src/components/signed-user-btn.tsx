import useAuthSession from "@/hooks/useSession";
import supabase from "@/lib/supabase";
import { useState } from "react";

export default function SignedUserButton() {
  const session = useAuthSession();
  const [loading, setLoading] = useState(false);

  const startSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    const { data, error } = await supabase.from("sync").select();
    console.log("fetching last sync", data, error);
    setLoading(false);
  };

  if (!session) {
    return (
      <button
        className="btn btn-outline btn-primary"
        onClick={startSignIn}
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        Sign In
      </button>
    );
  }

  return (
    <div className="avatar placeholder items-center gap-3">
      <div className="w-12 rounded-full bg-neutral text-neutral-content">
        <span className="text-xl">{session.user.user_metadata.name[0]}</span>
      </div>
      {session.user.user_metadata.name}
    </div>
  );
}
