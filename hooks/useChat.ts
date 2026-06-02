"use client";
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { Message } from '../types';
import * as chatService from '../services/chat.service';
import useToast from './useToast';

interface ChatState {
  currentConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  setConversation: (id: string) => void;
  send: (prompt: string) => Promise<void>;
  startNew: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
}

const toast = useToast.getState().addToast;

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const errorText =
        typeof error.response.data === 'object' && error.response.data !== null && 'message' in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined;
      return `Request failed with status ${status}${errorText ? `: ${errorText}` : ''}`;
    }
    if (error.request) {
      return 'The request was sent but no response was received.';
    }
    return error.message;
  }

  return error instanceof Error ? error.message : 'Unexpected API error';
};

export const useChat = create<ChatState>((set, get) => ({
  currentConversation: null,
  messages: [],
  isLoading: false,
  setConversation: (id: string) => set({ currentConversation: id }),
  send: async (prompt: string) => {
    const state = get();
    set({ isLoading: true });
    try {
      let convId = state.currentConversation;
      if (!convId) {
        const conv = await chatService.createConversation();
        convId = conv.id;
        set({ currentConversation: convId });
        toast('success', 'Created a new conversation.');
      }

      // Add user message to local state immediately so it renders in real-time
      const userMsg: Message = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        conversationId: convId as string,
        role: 'user',
        content: prompt,
        createdAt: new Date().toISOString(),
      };
      set({ messages: [...get().messages, userMsg] });

      const msg = await chatService.sendMessage(convId as string, prompt);
      set({ messages: [...get().messages, msg] });
      toast('success', 'Message sent successfully.');
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast('error', `Could not send message: ${message}`);
    } finally {
      set({ isLoading: false });
    }
  },
  startNew: async () => {
    try {
      const conv = await chatService.createConversation();
      set({ currentConversation: conv.id, messages: [], isLoading: false });
      toast('success', 'Started a new conversation.');
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast('error', `Could not start a new conversation: ${message}`);
    }
  },
  loadConversation: async (id: string) => {
    set({ isLoading: true });
    try {
      const data = await chatService.getConversation(id);
      set({ currentConversation: id, messages: data?.messages ?? [] });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast('error', `Could not load conversation: ${message}`);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useChatState = useChat;

export const useChatHook = () => useChat();

export default useChat;
