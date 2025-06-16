import { MainContent } from "@/components/app/main-content";
import { MainConversation } from "@/components/app/main-conversation";

export default async function Home() {

  return (
    <div>
      <div className="flex flex-col justify-center items-centers w-full max-w-4xl mx-auto px-3 mt-8 sm:px-6 md:px-8 py-4">
        <h1 className="text-2xl font-bold">Welcome to p12o.chat</h1>
        <p className="text-base text-muted-foreground mt-2">
          p12o.chat is a chatbot that can help you with your questions.
        </p>

        <MainContent />

      </div>

      <MainConversation />
    </div>
  );
}
