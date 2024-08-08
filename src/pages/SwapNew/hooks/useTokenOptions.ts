// hooks/useTokenOptions.ts
import { useEffect, useState } from 'react';
import { fetchTokens } from '../helpers';
import { TokenType } from '../types';

export const useTokenOptions = () => {
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getTokens = async () => {
      try {
        const tokenData = await fetchTokens();
        setTokens(tokenData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    getTokens();
  }, []);

  return { tokens, loading, error };
};
