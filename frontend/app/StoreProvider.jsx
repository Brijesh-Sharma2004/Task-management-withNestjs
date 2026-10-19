"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import AuthInitializer from "@/components/AuthInitializer";

export default function StoreProvider({ children }) {
  const [store, setStore] = useState(null);

  useEffect(() => {
    setStore(makeStore());
  }, []);

  if (!store) {
    return <div className="p-4">Loading application...</div>;
  }

  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
