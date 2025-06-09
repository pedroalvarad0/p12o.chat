'use server'
import { createClient } from '@/utils/supabase/server'

export async function handleSignIn(email: string) {
  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    }
  });

  if (signInError) {
    throw new Error(signInError.message);
  }
  
}

export async function handleVerifyOTP(email: string, otp: string) {
  const supabase = await createClient();
  
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (verifyError) {
    throw new Error(verifyError.message);
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If there's an auth session missing error, just return null silently
    if (error && error.message.includes('Auth session missing')) {
      return null;
    }
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    // Catch any other unexpected errors and return null
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
}

export async function handleSignOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}