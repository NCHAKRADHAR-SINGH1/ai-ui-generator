import { useState } from 'react';

// MOCK RESPONSES
const MOCK_RESPONSES = {
  dashboard: `function GeneratedUI() {
  return (
    <div className="p-6 space-y-6">
      <Navbar title="Dashboard" />
      <div className="flex gap-6">
        <Sidebar>
          <Button variant="ghost" className="w-full">Home</Button>
          <Button variant="ghost" className="w-full">Analytics</Button>
        </Sidebar>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            <Card title="Revenue">$45,231</Card>
            <Card title="Users">12,345</Card>
            <Card title="Conversion">3.2%</Card>
          </div>
          <Card title="Sales Chart">
            <Chart type="line" />
          </Card>
        </div>
      </div>
    </div>
  );
}`,

  login: `function GeneratedUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card title="Welcome Back" className="w-96 shadow-xl">
        <div className="space-y-4">
          <Input type="email" placeholder="Email" label="Email" />
          <Input type="password" placeholder="Password" label="Password" />
          <Button variant="primary" className="w-full">Sign In</Button>
        </div>
      </Card>
    </div>
  );
}`,

  spotify: `function GeneratedUI() {
  const [currentSong, setCurrentSong] = useState(null);
  const songs = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
    { id: 2, title: "Hotel California", artist: "Eagles" },
    { id: 3, title: "Imagine", artist: "John Lennon" }
  ];
  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <Navbar title="🎵 Songify" />
      <div className="mt-6 space-y-2">
        {songs.map(song => (
          <Card key={song.id} className="bg-gray-800 hover:bg-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
              <Button 
                variant="ghost" 
                className="text-green-500"
                onClick={() => setCurrentSong(song)}
              >
                ▶️ Play
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{currentSong.title}</p>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
            <Button variant="primary" className="bg-green-500">⏸️ Pause</Button>
          </div>
        </div>
      )}
    </div>
  );
}`,

  table: `function GeneratedUI() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' }
  ];
  return (
    <div className="p-6">
      <Card title="User Management">
        <div className="mb-4">
          <Input placeholder="Search users..." className="w-full" />
        </div>
        <Table 
          headers={['ID', 'Name', 'Email', 'Status', 'Actions']}
          data={data}
          renderRow={(row) => (
            <>
              <td className="p-2">{row.id}</td>
              <td className="p-2">{row.name}</td>
              <td className="p-2">{row.email}</td>
              <td className="p-2">
                <span className={\`px-2 py-1 rounded-full text-xs \${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}\`}>
                  {row.status}
                </span>
              </td>
              <td className="p-2">
                <Button size="sm" variant="ghost">Edit</Button>
              </td>
            </>
          )}
        />
      </Card>
    </div>
  );
}`,

  modal: `function GeneratedUI() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)}>
        Open Settings
      </Button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Modal content goes here</p>
          <Button onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}`
};

export const useCodeGeneration = () => {
  const [loading, setLoading] = useState(false);
  let versionCounter = 0;

  const generate = async (intent: string, existingCode?: string, parentVersion?: number) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let code = existingCode || '';
      let explanation = '';
      
      const lowerIntent = intent.toLowerCase();
      
      if (lowerIntent.includes('dashboard') || lowerIntent.includes('sales') || lowerIntent.includes('analytics')) {
        code = MOCK_RESPONSES.dashboard;
        explanation = "I created a sales dashboard with key metrics, a chart, and sidebar navigation.";
      } else if (lowerIntent.includes('login') || lowerIntent.includes('sign in')) {
        code = MOCK_RESPONSES.login;
        explanation = "I built a clean login form with email/password fields and a gradient background.";
      } else if (lowerIntent.includes('spotify') || lowerIntent.includes('songs') || lowerIntent.includes('music') || lowerIntent.includes('player')) {
        code = MOCK_RESPONSES.spotify;
        explanation = "I created a Spotify-style music app with a dark theme, song list, and player controls.";
      } else if (lowerIntent.includes('table') || lowerIntent.includes('users') || lowerIntent.includes('data')) {
        code = MOCK_RESPONSES.table;
        explanation = "I made a user management table with search, status badges, and action buttons.";
      } else if (lowerIntent.includes('modal') || lowerIntent.includes('settings') || lowerIntent.includes('dialog')) {
        if (existingCode) {
          code = existingCode + '\n\n' + MOCK_RESPONSES.modal;
          explanation = "I added a settings modal to your existing UI while preserving all components.";
        } else {
          code = MOCK_RESPONSES.modal;
          explanation = "I created a modal dialog example. Click the button to open the settings modal.";
        }
      } else if (lowerIntent.includes('minimal') || lowerIntent.includes('clean') || lowerIntent.includes('simple')) {
        if (existingCode) {
          code = existingCode.replace(/shadow-xl|shadow-lg|bg-gradient-to-br|border-2/g, '');
          explanation = "I made the UI more minimal by removing shadows and gradients.";
        } else {
          code = MOCK_RESPONSES.login;
          explanation = "I created a clean, minimal interface with subtle styling.";
        }
      } else if (existingCode) {
        explanation = `I modified your UI based on: "${intent}". I kept your existing layout and components.`;
      } else {
        code = MOCK_RESPONSES.login;
        explanation = "I created a UI based on your request. Try asking for a dashboard, Spotify clone, or user table!";
      }
      
      versionCounter++;
      
      return {
        id: versionCounter,
        code,
        explanation,
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
};


