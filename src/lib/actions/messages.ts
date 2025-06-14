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

export async function createMessage(chatId: string, content: string, role: string, status: string): Promise<Message> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      content: content,
      role: role,
      status: status
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMessage(messageId: string, content: string, status: string): Promise<Message> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('messages')
    .update({ content, status })
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}