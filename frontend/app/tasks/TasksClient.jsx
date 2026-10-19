"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  });

  const loadTasks = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/tasks");
      const taskList = response.data;
      setTasks(Array.isArray(taskList) ? taskList : []);
      
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setError(err.response?.data?.message || "Could not load your tasks.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    loadTasks();
  }, [loadTasks, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/tasks", {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });

      setTasks((previous) => [response.data, ...previous]);

      setMessage("Task created successfully!");

      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      setError(err.response?.data?.message || "Could not create the task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <header>
          <h1 className="text-3xl font-bold">My tasks</h1>
          <p className="mt-2 text-slate-600">
            Plan your work and keep track of your progress.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">Create a task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block font-medium">
                Task title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="Complete DBMS assignment"
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block font-medium">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={1000}
                rows={3}
                placeholder="What needs to be done?"
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="priority" className="mb-1 block font-medium">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-3"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="mb-1 block font-medium">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-3"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create task"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Your task list</h2>

            <button
              type="button"
              onClick={loadTasks}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-600">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-slate-600">
              No tasks yet. Create your first task above.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasks
                .filter((task) => task && task._id)
                .map((task) => (
                  <article
                    key={task._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-700">
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-3 whitespace-pre-wrap text-slate-600">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-4 text-sm capitalize text-slate-500">
                      Status: {task.status.replace("-", " ")}
                    </p>

                    {task.createdAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </article>
                ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
