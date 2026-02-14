import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface RightPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ code, onCodeChange }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(code);
  };

  const handleSave = () => {
    onCodeChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Generated Code</h2>
        <div className="space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card variant="minimal" className="flex-1">
        <div className="relative">
          {isEditing ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-96 font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          ) : (
            <pre className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </Card>
      
      <p className="text-xs text-gray-500 mt-2">
        ⚡ Code is editable - modify directly or use chat to iterate
      </p>
    </div>
  );
};