import useAuthSession from "@/hooks/useSession";
import supabase from "@/lib/supabase";
import { useState } from "react";
import SignOutModal from "./signout-modal";

export default function SignedUserButton() {
  const session = useAuthSession();
  const [loading, setLoading] = useState(false);

  const startSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : "http://localhost:3000",
      },
    });
    const { data, error } = await supabase.from("sync").select();
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // TODO - clear the local cache too
  };

  const handleShowSignOutModal = () => {
    (document.getElementById("signout-modal") as HTMLDialogElement).showModal();
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
    <>
      <SignOutModal onSignOut={handleSignOut} />
      <div
        className="cursor-pointer rounded-lg border-2 p-2 hover:bg-primary-content"
        onClick={handleShowSignOutModal}
      >
        <div className="avatar placeholder items-center gap-3">
          <div className="w-8 rounded-full bg-neutral text-neutral-content">
            <span className="text-xl">
              {session.user.user_metadata.name[0]}
            </span>
          </div>
          {session.user.user_metadata.name}
        </div>
      </div>
    </>
  );
}
