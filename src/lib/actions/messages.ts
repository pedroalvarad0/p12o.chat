'use server'

import { createClient } from "@/utils/supabase/server";
import { Message } from "../types";

export async function getMessages(chatId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMessage(chatId: string, content: string, role: string): Promise<Message> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      content: content,
      role: role
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}