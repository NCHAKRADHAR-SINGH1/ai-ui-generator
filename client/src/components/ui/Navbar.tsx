import React from 'react';

export interface NavbarProps {
  title: string;
  onRollback?: (id: number) => void;
  history?: Array<{ id: number; intent: string; timestamp: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ title, onRollback, history = [] }) => {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Fixed Components
          </span>
        </div>
        
        {history.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            >
              History ({history.length})
            </button>
            
            {showHistory && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-2 z-50">
                <h3 className="text-sm font-medium p-2">Previous Versions</h3>
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onRollback?.(item.id);
                      setShowHistory(false);
                    }}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                  >
                    <div className="font-medium">{item.intent}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};