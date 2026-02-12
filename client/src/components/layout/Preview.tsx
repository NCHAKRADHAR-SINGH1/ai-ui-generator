import React, { useState } from 'react';
import * as Components from '../ui/index';
import { ComponentValidator } from '../validation/ComponentValidator';

interface PreviewProps {
  code: string;
  onError?: (error: string) => void;
}

export const Preview: React.FC<PreviewProps> = ({ code, onError }) => {
  const [error, setError] = useState<string | null>(null);

  const renderComponent = () => {
    try {
      ComponentValidator.validate(code);
      
      // ✅ FIX: Remove the 'export default' from the code
      const componentCode = code.replace('export default', 'return');
      
      // Create function body
      const functionBody = `
        const Component = () => {
          ${componentCode}
        };
        return Component;
      `;

      const componentFunction = new Function(
        'React',
        ...Object.keys(Components),
        functionBody
      );

      const GeneratedComponent = componentFunction(
        React,
        ...Object.values(Components)
      );

      return <GeneratedComponent />;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">⚠️ Rendering Error</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {errorMessage}
          </pre>
          <p className="text-sm text-gray-600 mt-2">
            Make sure you're using only: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
          </p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] border border-gray-200">
      {error && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-700">⚠️ {error}</p>
        </div>
      )}
      <div className="preview-content">
        {renderComponent()}
      </div>
    </div>
  );
};
