import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";
import { InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { InputOTP } from "../ui/input-otp";
import { handleSignIn, handleVerifyOTP } from "@/lib/actions/auth";

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
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
    setError("");
    setMessage("");

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
    setError("");
    setMessage("");

    try {
      await handleVerifyOTP(email, otp);
      setMessage("Email verified!");
      setShowOtpInput(false);
      onOpenChange(false);
    } catch (error) {
      setError("Invalid code. Please try again.")
      console.error("Error verifying code:", error);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Enter your email to receive a one-time password for signing in.
          </DialogDescription>
        </DialogHeader>

        {!showOtpInput ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label>One-Time Password</Label>
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
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}