import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="text-xl font-extrabold text-gray-900 tracking-tight"
          >
            Lost Item Network
          </Link>

          <div className="flex items-center">
            <Link
              href="/signin"
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:inline font-medium">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
