"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/tasks");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
        <p className="font-semibold text-blue-600">
          YOUR PERSONAL PRODUCTIVITY SPACE
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Organize your work.
          <span className="block text-blue-600">One task at a time.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">
          Create tasks, set priorities, and keep your work organized with your
          personal task management dashboard.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50"
          >
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
