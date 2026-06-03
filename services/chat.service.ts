import api from './api';

export const sendMessage = async (conversationId: string, prompt: string) => {
  const res = await api.post('/api/chat', { conversationId, prompt });
  return res.data.data;
};

export const createConversation = async (provider?: string, model?: string) => {
  const res = await api.post('/api/conversations', { provider, model });
  return res.data.data;
};

export const listConversations = async () => {
  const res = await api.get('/api/conversations');
  return res.data.data;
};

export const getConversation = async (id: string) => {
  const res = await api.get(`/api/conversations/${id}`);
  return res.data.data;
};
