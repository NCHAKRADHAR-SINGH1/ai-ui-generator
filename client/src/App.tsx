import React, { useState } from 'react';
import { LeftPanel } from './components/layout/LeftPanel';
import { RightPanel } from './components/layout/RightPanel';
import { Preview } from './components/layout/Preview';
import { Navbar } from './components/ui/Navbar';
import { useGenerationHistory } from './hooks/useGenerationHistory';
import { useCodeGeneration } from './hooks/useCodeGeneration';

function App() {
  const [currentCode, setCurrentCode] = useState<string>(`export default function GeneratedUI() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="🎨 AI UI Generator" variant="bordered">
        <div className="space-y-4">
          <p className="text-gray-600">
            Describe what you want to build in the left panel. For example:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Card variant="minimal">
              <p className="font-medium">"Create a login form"</p>
            </Card>
            <Card variant="minimal">
              <p className="font-medium">"Make a sales dashboard"</p>
            </Card>
            <Card variant="minimal">
              <p className="font-medium">"Show me a user table"</p>
            </Card>
            <Card variant="minimal">
              <p className="font-medium">"Add a settings modal"</p>
            </Card>
          </div>
          <Button variant="primary" className="mt-4">
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
}`);
  
  const [currentIntent, setCurrentIntent] = useState('');
  const [explanation, setExplanation] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { history, addGeneration, rollback } = useGenerationHistory();
  const { generate, loading } = useCodeGeneration();

  const handleGenerate = async (intent: string, isModification: boolean) => {
    try {
      setValidationError(null);
      
      const result = await generate(
        intent,
        isModification ? currentCode : undefined,
        isModification ? history[0]?.id : undefined
      );
      
      setCurrentCode(result.code);
      setExplanation(result.explanation);
      setCurrentIntent(intent);
      
      addGeneration({
        id: result.id,
        intent,
        code: result.code,
        explanation: result.explanation,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Generation failed:', error);
      setValidationError(error instanceof Error ? error.message : 'Generation failed');
    }
  };

  const handleRollback = (versionId: number) => {
    const version = rollback(versionId);
    if (version) {
      setCurrentCode(version.code);
      setExplanation(version.explanation);
      setCurrentIntent(version.intent);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar 
        title="AI UI Generator"
        onRollback={handleRollback}
        history={history}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
          <LeftPanel
            onGenerate={handleGenerate}
            loading={loading}
            currentIntent={currentIntent}
            explanation={explanation}
            validationError={validationError}
          />
        </div>
        
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <RightPanel
            code={currentCode}
            onCodeChange={setCurrentCode}
          />
        </div>
        
        <div className="w-1/3 bg-white overflow-y-auto">
  <div className="p-4">
    <h2 className="text-lg font-semibold mb-4 text-gray-900">
      Live Preview
    </h2>
    <Preview code={currentCode} />
  </div>
</div>
      </div>
    </div>
  );
}

export default App;