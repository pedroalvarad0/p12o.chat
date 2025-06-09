"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MessageCircle, User } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";
import { useState } from "react";

interface DashboardProps {
  user: {
    email?: string;
    id: string;
  };
}

export function Dashboard({ user }: DashboardProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function onSignOut() {
    setIsSigningOut(true);
    try {
      await handleSignOut();
      // Refresh the page to update the auth state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <h1 className="text-xl font-bold">p12o.chat</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Ready to start chatting? Here's your dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Start Chat</span>
                </CardTitle>
                <CardDescription>
                  Begin a new conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  New Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Chats</CardTitle>
                <CardDescription>
                  Continue your previous conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Preferences
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">AI Assistant</h4>
                      <p className="text-sm text-muted-foreground">
                        Get help with anything
                      </p>
                    </div>
                    <Button size="sm">Try Now</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Voice Chat</h4>
                      <p className="text-sm text-muted-foreground">
                        Talk naturally with AI
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 