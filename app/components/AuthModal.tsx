"use client";
import { useState } from "react";
import { Button, Input, ControlledModal as Modal } from "@abhishekbarve/components";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [secretKey, setSecretKey] = useState("Mischief Managed");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey }),
      });

      const data = await response.json();

      if (response.ok) {
        onAuthenticated();
        onClose();
        setSecretKey("");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal id="auth-modal" open={isOpen} onClose={onClose}>
      <div className="max-w-md">
        <Modal.Header>
          <div className="flex items-center gap-3">
            <MdLock className="w-6 h-6 text-foreground/40" />
            <h2 className="text-lg font-bold">Enter a secret key</h2>
          </div>
        </Modal.Header>

        <Modal.Body>
          <p className="text-foreground/40 mb-6 text-sm">
            This is a demo application. Please use the following secret key to access the application: Mischief Managed
          </p>
          <p className="text-foreground/40 mb-6 text-sm">
            It is limited to 15 requests. To bypass the limit, use the provided secret key.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input>
                <Input.Field
                  name="secretKey"
                  type={showKey ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter your secret key"
                  className="pr-10"
                  disabled={loading}
                  autoFocus
                />
              </Input>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground/40"
              >
                {showKey ? (
                  <MdVisibilityOff className="w-5 h-5" />
                ) : (
                  <MdVisibility className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !secretKey.trim()}
              className="flex-1"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}