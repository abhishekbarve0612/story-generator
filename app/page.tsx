"use client";
import { Main, ScrollArea, ThemeProvider, Button } from "@abhishekbarve/components";
import { MdLogout } from "react-icons/md";
import Logs from "./components/Logs";
import ConfigPanel from "./components/ConfigPanel";
import AuthModal from "./components/AuthModal";
import { store } from "./store";
import { Provider } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

function AppContent() {
  const { isAuthenticated, isLoading, onAuthenticated, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Story Generator</h1>
            <p className="text-gray-600 mb-6">Please authenticate to access the application</p>
            <Button onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={onAuthenticated}
        />
      </>
    );
  }

  return (
    <>
      <Main className="flex h-screen divide-x divide-gray-900">
        <div className="w-1/2 h-screen overflow-y-auto">
          <ConfigPanel />
        </div>
        <div className="w-1/2 h-screen relative">
          <Logs />
          {/* Sign Out Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
            title="Sign out"
          >
            <MdLogout className="w-4 h-4" />
          </Button>
        </div>
      </Main>
    </>
  );
}

export default function Home() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
