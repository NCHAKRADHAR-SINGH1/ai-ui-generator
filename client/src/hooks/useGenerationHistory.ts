import { useState } from 'react';

interface Generation {
  id: number;
  intent: string;
  code: string;
  explanation: string;
  timestamp: string;
}

export const useGenerationHistory = () => {
  const [history, setHistory] = useState<Generation[]>([]);

  const addGeneration = (generation: Generation) => {
    setHistory(prev => [generation, ...prev]);
  };

  const rollback = (versionId: number): Generation | null => {
    const version = history.find(h => h.id === versionId);
    if (version) {
      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== versionId);
        return [version, ...filtered];
      });
      return version;
    }
    return null;
  };

  return {
    history,
    addGeneration,
    rollback
  };
};