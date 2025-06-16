'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useOpenRouterApiKey } from "@/hooks/use-openrouter-api-key";
import { validateOpenRouterApiKey } from "@/lib/actions/validate-api-key";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface OpenRouterApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpenRouterApiKeyDialog({ open, onOpenChange }: OpenRouterApiKeyDialogProps) {
  const { apiKey: currentApiKey, saveApiKey, removeApiKey, hasApiKey } = useOpenRouterApiKey();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (open && currentApiKey) {
      setApiKey(currentApiKey);
    }
  }, [open, currentApiKey]);

  useEffect(() => {
    if (!open) {
      setApiKey("");
      setError("");
      setShowApiKey(false);
    }
  }, [open]);

  async function handleSave() {
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    if (!apiKey.startsWith('sk-or-')) {
      setError("OpenRouter API keys should start with 'sk-or-'");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const isValid = await validateOpenRouterApiKey(apiKey);
      if (!isValid) {
        setError("Invalid API key. Please check and try again.");
        return;
      }

      saveApiKey(apiKey);
      
      toast.success("API key saved successfully!");
      
      onOpenChange(false);
      
      setTimeout(() => {
        // window.location.reload();
      }, 100);
    } catch (err) {
      setError("Failed to save API key. Please try again.");
      toast.error("Failed to save API key");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove() {
    try {
      removeApiKey();
      toast.success("API key removed successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to remove API key");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenRouter API Key</DialogTitle>
          <DialogDescription>
            p12o.chat uses OpenRouter to connect to AI models. You can get your API key from{" "}
            <a 
              href="https://openrouter.ai/keys" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              OpenRouter
            </a>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isLoading}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {hasApiKey && (
            <div className="text-sm text-muted-foreground">
              ✅ You have an API key configured
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {hasApiKey && (
            <Button 
              variant="destructive" 
              onClick={handleRemove}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Key
            </Button>
          )}
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !apiKey.trim()}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? "Validating..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}