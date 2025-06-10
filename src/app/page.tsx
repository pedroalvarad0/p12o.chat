import { ChatInput } from "@/components/chat/chat-input";
import { MainContent } from "@/components/app/main-content";

export default async function Home() {

  return (

    <div className="flex flex-col min-h-[calc(100vh-46px)]">
      <div className="flex-1 w-full max-w-4xl mx-auto px-3 mt-8 sm:px-6 md:px-8 py-4">
        <h1 className="text-2xl font-bold">Welcome to p12o.chat</h1>
        <p className="text-sm text-muted-foreground mt-2">
          p12o.chat is a chatbot that can help you with your questions.
        </p>

        <div className="flex flex-col gap-2 mt-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <p key={index} className="text-sm mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In esse, incidunt error quo distinctio ipsa enim, obcaecati quas reprehenderit veritatis amet odit consequuntur repudiandae repellat illo repellendus voluptates rem quis.
            </p>
          ))}
        </div>

        <MainContent />
        
      </div>

      <div className="sticky bottom-0 w-full">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8">
          <ChatInput location="home" />
        </div>
      </div>
    </div> 
  );
}
