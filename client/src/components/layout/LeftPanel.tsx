import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface LeftPanelProps {
  onGenerate: (intent: string, isModification: boolean) => void;
  loading: boolean;
  currentIntent: string;
  explanation: string;
  validationError: string | null;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  onGenerate,
  loading,
  currentIntent,
  explanation,
  validationError
}) => {
  const [intent, setIntent] = useState('');
  const [isModification, setIsModification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.trim()) {
      onGenerate(intent, isModification);
      setIntent('');
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <Card title="🤖 Chat with AI" variant="minimal" className="mb-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Describe what you want to build..."
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="modify"
              checked={isModification}
              onChange={(e) => setIsModification(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="modify" className="text-sm text-gray-600">
              Modify existing UI (preserve changes)
            </label>
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !intent.trim()}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate UI'}
          </Button>
        </form>
      </Card>

      {validationError && (
        <Card variant="bordered" className="mb-4 border-red-300 bg-red-50">
          <p className="text-sm text-red-600">⚠️ {validationError}</p>
        </Card>
      )}

      {currentIntent && (
        <Card title="📝 Last Request" variant="minimal" className="mb-4">
          <p className="text-sm text-gray-800">"{currentIntent}"</p>
        </Card>
      )}

      {explanation && (
        <Card title="💡 AI Explanation" variant="minimal" className="flex-1">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {explanation}
          </p>
        </Card>
      )}

      {!explanation && !currentIntent && (
        <Card title="✨ Examples" variant="minimal" className="flex-1">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try saying:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>"Create a login form"</li>
              <li>"Make a sales dashboard"</li>
              <li>"Show me a user table"</li>
              <li>"Add a settings modal"</li>
              <li>"Make it more minimal"</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};