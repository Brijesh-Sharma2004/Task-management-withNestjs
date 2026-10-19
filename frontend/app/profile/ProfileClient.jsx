"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";


export default function ProfilePage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!localStorage.getItem("token")) {
        router.replace("/login");
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const user = response.data.user || response.data;

        setProfile(user);
        setContactNumber(user.contactNumber || "");
        setLocation(user.location || "");
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        setError(err.response?.data?.message || "Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!contactNumber.trim() || !location.trim()) {
      setError("Contact number and location cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch("/users/profile", {
        contactNumber: contactNumber.trim(),
        location: location.trim(),
      });

      setProfile((previous) => ({
        ...previous,
        ...response.data.user,
      }));

      setMessage("Profile updated successfully.");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setError(err.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8 text-center text-slate-600">Loading profile...</main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">My profile</h1>

          <p className="mt-2 text-slate-500">
            View your account details and update your information.
          </p>

          {error && (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {error}
            </p>
          )}

          {profile && (
            <>
              <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm text-slate-500">Full name</p>
                  <p className="font-medium">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="mb-1 block font-medium"
                  >
                    Contact number
                  </label>

                  <input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(event) => setContactNumber(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="mb-1 block font-medium">
                    Location
                  </label>

                  <input
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />
                </div>

                {message && (
                  <p role="status" className="text-sm text-green-700">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}
