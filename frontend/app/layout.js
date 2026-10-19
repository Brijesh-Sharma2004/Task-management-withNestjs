import StoreProvider from "./StoreProvider";
import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Authentication and task management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
