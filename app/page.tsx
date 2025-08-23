"use client";
import { Main, ThemeProvider } from "@abhishekbarve/components";
import Logs from "./components/Logs";
import ConfigPanel from "./components/ConfigPanel";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Main className="flex items-center h-screen divide-x divide-gray-900">
        <div className="flex flex-col items-center justify-center w-1/2">
          <ConfigPanel />
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          <Logs />
        </div>
      </Main>
    </ThemeProvider>
  );
}
