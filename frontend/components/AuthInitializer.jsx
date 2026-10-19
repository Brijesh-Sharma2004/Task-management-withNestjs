"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/api";
import { setUser, logout } from "@/lib/features/auth/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    api
      .get("/auth/me")
      .then((response) => {
        const user = response.data.user ?? response.data.data ?? response.data;

        dispatch(setUser(user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        dispatch(logout());
      });
  }, [dispatch]);

  return null;
}
