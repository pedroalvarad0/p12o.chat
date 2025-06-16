'use client'

function UseMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] p-3 rounded-lg relative group bg-muted">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-base leading-relaxed mb-0">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

function AssistantMessage({ message }: { message: string}) {
  return (
    <div className="flex justify-start mb-12">
      <div className="p-0 rounded-lg relative group bg-background w-full min-w-0">
        <div className="prose prose-sm max-w-none dark:prose-invert min-w-0 w-full">
          <p className="text-base mb-4 last:mb-0 leading-7 break-words">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

const simulatedMessages = [
  {
    role: 'user',
    content: 'What is p12o.chat?'
  },
  {
    role: 'assistant',
    content: 'p12o.chat is an intelligent chatbot designed to help you with your questions and conversations. I can assist you with a wide variety of topics!'
  },
  {
    role: 'user',
    content: 'What kind of questions can you answer?'
  },
  {
    role: 'assistant',
    content: 'I can help you with programming, technical explanations, problem solving, text analysis, translations, and much more. My goal is to be your intelligent assistant.'
  },
  {
    role: 'user',
    content: 'Do you support different AI models?'
  },
  {
    role: 'assistant',
    content: 'Yes! p12o.chat supports multiple AI models, giving you flexibility to choose the best model for your specific needs and use cases.'
  }
];

export function MainConversation() {

  return (
    <div
      className="flex-1 w-full max-w-4xl mx-auto px-3 mt-3 sm:px-6 md:px-8 py-4 overflow-y-auto min-w-0"
    >
      <div className="flex flex-col min-w-0">
        {simulatedMessages.map((message, index) => (
          message.role === 'user' ? (
            <UseMessage key={index} message={message.content} />
          ) : (
            <AssistantMessage key={index} message={message.content} />
          )
        ))}
      </div>
    </div>
  );
}
