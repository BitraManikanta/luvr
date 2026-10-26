import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';
import type { Conversation } from '@luvora/shared-types';

export function useConversations() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiClient.get<Conversation[]>('/conversations'),
    // Conversations also update via WebSocket – this is a fallback.
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ['conversations'] });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    refetch,
  };
}
