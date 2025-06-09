import { AuthForm } from "@/components/auth/auth-form";
import { Dashboard } from "@/components/dashboard/dashboard";
import { getCurrentUser } from "@/lib/actions/auth";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">p12o.chat</h1>
      <AuthForm />
    </div>
  );
}
