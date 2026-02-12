import React, { useMemo,useState } from 'react';
import * as Components from '../ui/index';
import { ComponentValidator } from '../validation/ComponentValidator';

interface PreviewProps {
  code: string;
  onError?: (error: string) => void;
}

export const Preview: React.FC<PreviewProps> = ({ code, onError }) => {
  const [error, setError] = useState<string | null>(null);
  
  const GeneratedComponent = useMemo(() => {
    try {
      ComponentValidator.validate(code);
      
      const componentFunction = new Function(
        'React',
        ...Object.keys(Components),
        `
        try {
          ${code}
          return GeneratedUI;
        } catch (err) {
          throw new Error('Render failed: ' + err.message);
        }
        `
      );

      return componentFunction(
        React,
        ...Object.values(Components)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    }
  }, [code]); // Only re-create when code changes

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] border border-gray-200">
      {error && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-700">⚠️ {error}</p>
        </div>
      )}
      <div className="preview-content">
        {GeneratedComponent && <GeneratedComponent />}
      </div>
    </div>
  );
};