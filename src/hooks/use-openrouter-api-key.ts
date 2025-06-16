'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'openrouter_api_key';
const API_KEY_CHANGED_EVENT = 'openrouter-api-key-changed';

export function useOpenRouterApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setApiKey(stored);
    } catch (error) {
      console.error('Error loading API key from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Escuchar cambios en la API key desde otros hooks
  useEffect(() => {
    const handleApiKeyChange = (event: CustomEvent) => {
      setApiKey(event.detail.apiKey);
    };

    window.addEventListener(API_KEY_CHANGED_EVENT, handleApiKeyChange as EventListener);
    
    return () => {
      window.removeEventListener(API_KEY_CHANGED_EVENT, handleApiKeyChange as EventListener);
    };
  }, []);

  const saveApiKey = (key: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
      
      // Notificar a otros hooks del cambio
      window.dispatchEvent(new CustomEvent(API_KEY_CHANGED_EVENT, {
        detail: { apiKey: key }
      }));
    } catch (error) {
      console.error('Error saving API key to localStorage:', error);
      throw new Error('Failed to save API key');
    }
  };

  const removeApiKey = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setApiKey(null);
      
      // Notificar a otros hooks del cambio
      window.dispatchEvent(new CustomEvent(API_KEY_CHANGED_EVENT, {
        detail: { apiKey: null }
      }));
    } catch (error) {
      console.error('Error removing API key from localStorage:', error);
      throw new Error('Failed to remove API key');
    }
  };

  return {
    apiKey,
    hasApiKey: !!apiKey,
    isLoading,
    saveApiKey,
    removeApiKey
  };
}

// Función helper para obtener la API key directamente desde localStorage
export function getOpenRouterApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
} 