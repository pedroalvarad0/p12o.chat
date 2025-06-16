export interface Chat {
    id: string;
    user_id: string;
    name: string;
    updated_at: string;
}

export interface Message {
    id: string;
    chat_id: string;
    role: string;
    status: string;
    content: string;
    created_at: string;
    metadata: Record<string, string>;
}