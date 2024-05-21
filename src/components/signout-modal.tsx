type Props = {
  onSignOut: () => void;
};

export default function SignOutModal({ onSignOut }: Props) {
  return (
    <dialog id="signout-modal" className="prose modal">
      <div className="w-100 modal-box max-w-xl">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex w-full flex-col gap-4 ">
          <div>Are you sure you want to sign out?</div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary join-item basis-1/5"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
