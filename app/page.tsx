"use client";
import { Main, ScrollArea, ThemeProvider } from "@abhishekbarve/components";
import Logs from "./components/Logs";
import ConfigPanel from "./components/ConfigPanel";
import { store } from "./store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Main className="flex h-screen divide-x divide-gray-900">
          <div className="w-1/2 h-screen overflow-y-auto">
            <ConfigPanel />
          </div>
          <div className="w-1/2 h-screen">
            <Logs />
          </div>
        </Main>
      </ThemeProvider>
    </Provider>
  );
}
