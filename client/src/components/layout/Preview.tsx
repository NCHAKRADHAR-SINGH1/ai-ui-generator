import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';
import * as Components from '../ui/index';

interface PreviewProps {
  code: string;
  onError?: (error: string) => void;
}

export const Preview: React.FC<PreviewProps> = ({ code, onError }) => {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    try {
      console.log('🔍 RAW CODE:', code);
      
      // Step 1: Transpile JSX to JavaScript using Babel
      const transpiled = Babel.transform(code, {
        presets: ['react'],
        filename: 'dynamic.tsx'
      }).code;
      
      console.log('✨ TRANSPILED CODE:', transpiled);
      
      // Step 2: Create function from transpiled code
      const functionBody = `
        // Return the component function
        return ${transpiled};
      `;

      const fn = new Function(
        'React',
        ...Object.keys(Components),
        functionBody
      );

      const GeneratedComponent = fn(
        React,
        ...Object.values(Components)
      );

      console.log('✅ Component created:', GeneratedComponent);
      setComponent(() => GeneratedComponent);
      setError(null);
      onError?.('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Error:', errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
      setComponent(null);
    }
  }, [code, onError]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] border border-gray-200">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">⚠️ Rendering Error</h3>
          <pre className="text-sm text-red-600 whitespace-pre-wrap bg-red-50 p-2 rounded">
            {error}
          </pre>
          <p className="text-sm text-gray-600 mt-2">
            {error.includes('Unexpected token') 
              ? 'JSX transpilation failed. Make sure your code has proper function wrapper.'
              : 'Make sure you\'re using only: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart'}
          </p>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px] border border-gray-200">
      <div className="preview-content">
        <Component />
      </div>
    </div>
  );
};