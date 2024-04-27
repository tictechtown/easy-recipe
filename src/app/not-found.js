import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hero min-h-screen bg-gradient-to-b from-base-300">
      <div className="hero-content text-center">
        <div className="row">
          <div className="col-sm-8 offset-sm-2 -mt-52 text-center text-neutral-content ">
            <div className="flex items-center justify-center pb-16 text-base-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-64 w-64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 22v-2" />
                <path d="M9 15l6 -6" />
                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
                <path d="M20 17h2" />
                <path d="M2 7h2" />
                <path d="M7 2v2" />
              </svg>
            </div>
            <div className="relative">
              <h1 className="tracking-tighter-less text-shadow relative font-sans text-9xl font-bold text-base-content">
                <span>4</span>
                <span>0</span>
                <span>4</span>
              </h1>
              <span className="absolute top-0  -ml-12 font-semibold">
                Oops!
              </span>
            </div>
            <h5 className="-mr-10 -mt-3 font-semibold">Page not found</h5>
            <p className="mb-6 mt-2 text-base-content">
              This recipe was not found.
            </p>
            <Link href="/recipes" className="btn btn-primary px-5 py-3">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
