"use client";
import { Main, ThemeProvider } from "@abhishekbarve/components";

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Main className="flex items-center h-screen divide-x divide-gray-900">
        <div className="flex flex-col items-center justify-center w-1/2">
          <h1 className="text-2xl font-bold">Hello World</h1>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          <h1 className="text-2xl font-bold">Hello World</h1>
        </div>
      </Main>
    </ThemeProvider>
  );
}
