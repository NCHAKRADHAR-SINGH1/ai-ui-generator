import { useState } from 'react';

const API_URL = 'http://localhost:3001';

export const useCodeGeneration = () => {
  const [loading, setLoading] = useState(false);

  const generate = async (
    intent: string,
    existingCode?: string,
    parentVersion?: number
  ) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, existingCode, version: parentVersion })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
};