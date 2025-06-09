"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ArrowRight, Mail, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

import { handleSignIn, handleVerifyOTP } from "@/lib/actions/auth";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      await handleSignIn(email);
      setMessage("Email sent to " + email + "! Check your inbox.");
      setShowOtpInput(true);
    } catch (error) {
      setError("Failed to send email. Please try again.");
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsVerifying(true);
    setMessage("");
    setError("");

    try {
      await handleVerifyOTP(email, otp);
      setMessage("Email verified! Redirecting...");

      setShowOtpInput(false);
    } catch (error) {
      setError("Invalid code. Please try again.");
      console.error("Error verifying code:", error);
    } finally {
      setIsVerifying(false);
    }

  }

  return (
    <div className="w-full max-w-md px-4 m-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email to receive a one-time password for signing in.
          </CardDescription>
        </CardHeader>
        {
          !showOtpInput ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Mail className="absolute right-3 top-2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {message && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-sm p-3 rounded-md flex items-start">
                    <div className="shrink-0 mr-2 mt-0.5">✨</div>
                    <p>{message}</p>
                  </div>
                )}
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                    <div className="shrink-0 mr-2 mt-0.5">⚠️</div>
                    <p>{error}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full relative"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      Send code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>One-time password</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {message && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-sm p-3 rounded-md flex items-start">
                      <div className="shrink-0 mr-2 mt-0.5">✨</div>
                      <p>{message}</p>
                    </div>
                  )}
                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                      <div className="shrink-0 mr-2 mt-0.5">⚠️</div>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full relative"
                  disabled={isVerifying || otp.length !== 6}
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying code...
                    </>
                  ) : (
                    <>
                      Verify code
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOtpInput(false);
                    setMessage("");
                    setError("");
                  }}
                  className="w-full"
                >
                  Back to email
                </Button>
              </CardFooter>
            </form>
          )
        }

      </Card>
    </div>
  )
}