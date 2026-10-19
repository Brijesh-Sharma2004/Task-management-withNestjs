"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/tasks" className="text-xl font-bold text-blue-700">
          Task Manager
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/tasks"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Tasks
          </Link>

          <Link
            href="/profile"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
