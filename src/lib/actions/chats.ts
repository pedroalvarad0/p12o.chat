'use server'

import { createClient } from "@/utils/supabase/server";
import { Chat } from "../types";

export async function getChats(): Promise<Chat[]> {
  const supabase = await createClient();

  const { error: authError } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message);
  }

  const { data: chats, error: dbError } = await supabase
    .from('chats')
    .select('*')
    .order('updated_at', { ascending: false });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return chats;
}

export async function createChat(): Promise<Chat> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message);
  }

  const { data: chat, error: dbError } = await supabase
    .from('chats')
    .insert({ user_id: user?.id, name: 'New Chat' })
    .select()
    .single();

  if (dbError) {
    throw new Error(dbError.message);
  }

  return chat;
}

export async function renameChat(chatId: string, name: string) {
  const supabase = await createClient();

  const { error: authError } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message);
  }

  const { error: dbError } = await supabase
    .from('chats')
    .update({ name })
    .eq('id', chatId)
    .select()
    .single();

  if (dbError) {
    throw new Error(dbError.message);
  }
}

export async function deleteChat(chatId: string) {
  const supabase = await createClient();

  const { error: authError } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message);
  }
  
  const { error: dbError } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  if (dbError) {
    throw new Error(dbError.message);
  }
}