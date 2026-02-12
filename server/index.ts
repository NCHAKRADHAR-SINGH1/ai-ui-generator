import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Planner } from './agents/Planner';
import { Generator } from './agents/Generator';
import { Explainer } from './agents/Explainer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const planner = new Planner();
const generator = new Generator();
const explainer = new Explainer();

// Store generations in memory
const generations = new Map();
let currentVersion = 0;

// MOCK RESPONSES - Works without OpenAI API key
const MOCK_RESPONSES = {
  dashboard: `export default function GeneratedUI() {
  return (
    <div className="p-6 space-y-6">
      <Navbar 
        title="Dashboard"
        links={[
          { label: 'Home', href: '#' },
          { label: 'Analytics', href: '#' },
          { label: 'Settings', href: '#' }
        ]}
      />
      
      <div className="flex gap-6">
        <Sidebar>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">🏠 Home</Button>
            <Button variant="ghost" className="w-full justify-start">📊 Analytics</Button>
            <Button variant="ghost" className="w-full justify-start">⚙️ Settings</Button>
            <Button variant="ghost" className="w-full justify-start">👥 Users</Button>
          </div>
        </Sidebar>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Total Revenue">
              <p className="text-2xl font-bold text-gray-900">$54,239</p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </Card>
            <Card title="Active Users">
              <p className="text-2xl font-bold text-gray-900">2,345</p>
              <p className="text-sm text-green-600">↑ 8% from last month</p>
            </Card>
            <Card title="Conversion Rate">
              <p className="text-2xl font-bold text-gray-900">3.45%</p>
              <p className="text-sm text-red-600">↓ 2% from last month</p>
            </Card>
          </div>
          
          <Card title="Sales Overview">
            <Chart type="line" />
          </Card>

          <Card title="Recent Orders">
            <Table 
              headers={['Order ID', 'Customer', 'Amount', 'Status']}
              data={[
                { id: '#12345', customer: 'John Doe', amount: '$234', status: 'Completed' },
                { id: '#12346', customer: 'Jane Smith', amount: '$567', status: 'Processing' },
                { id: '#12347', customer: 'Bob Johnson', amount: '$89', status: 'Completed' },
                { id: '#12348', customer: 'Alice Brown', amount: '$432', status: 'Pending' }
              ]}
              renderRow={(row) => (
                <>
                  <td className="p-2 text-sm">{row.id}</td>
                  <td className="p-2 text-sm">{row.customer}</td>
                  <td className="p-2 text-sm">{row.amount}</td>
                  <td className="p-2 text-sm">
                    <span className={\`px-2 py-1 rounded-full text-xs \${
                      row.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      row.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }\`}>
                      {row.status}
                    </span>
                  </td>
                </>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}`,

  login: `export default function GeneratedUI() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card title="Welcome Back" className="w-96 shadow-xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-sm text-gray-600 mt-1">Enter your credentials to access your account</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              label="Email"
              type="email"
              placeholder="you@example.com"
            />
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Button variant="ghost" size="sm">
                Forgot Password?
              </Button>
            </div>
            
            <Button variant="primary" className="w-full">
              Sign In
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                Google
              </Button>
              <Button variant="outline">
                GitHub
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Button variant="ghost" size="sm" className="inline text-blue-600">
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}`,

  table: `export default function GeneratedUI() {
  const [search, setSearch] = useState('');
  
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button variant="primary">
          + Add User
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline">
            Export
          </Button>
        </div>
      </Card>
      
      <Card>
        <Table 
          headers={['ID', 'Name', 'Email', 'Role', 'Status', 'Actions']}
          data={filteredData}
          renderRow={(row) => (
            <>
              <td className="p-3 text-sm">{row.id}</td>
              <td className="p-3 text-sm font-medium">{row.name}</td>
              <td className="p-3 text-sm">{row.email}</td>
              <td className="p-3 text-sm">
                <span className={\`px-2 py-1 rounded-full text-xs \${
                  row.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                  row.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }\`}>
                  {row.role}
                </span>
              </td>
              <td className="p-3 text-sm">
                <span className={\`px-2 py-1 rounded-full text-xs \${
                  row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }\`}>
                  {row.status}
                </span>
              </td>
              <td className="p-3 text-sm">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">Edit</Button>
                  <Button size="sm" variant="ghost" className="text-red-600">Delete</Button>
                </div>
              </td>
            </>
          )}
        />
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} users
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Previous</Button>
            <Button size="sm" variant="outline">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}`,

  modal: `export default function GeneratedUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-500">Receive email notifications</p>
            </div>
            <div className={\`w-12 h-6 rounded-full \${
              settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
            } relative cursor-pointer transition-colors\`}
              onClick={() => setSettings({...settings, notifications: !settings.notifications})}
            >
              <div className={\`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all \${
                settings.notifications ? 'right-0.5' : 'left-0.5'
              }\`} />
            </div>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)}>
            Open Settings Modal
          </Button>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input 
              type="checkbox" 
              checked={settings.darkMode}
              onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto Save</span>
            <input 
              type="checkbox" 
              checked={settings.autoSave}
              onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
              className="rounded"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}`
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: process.env.OPENAI_API_KEY ? 'live' : 'mock' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { intent, existingCode, version } = req.body;
    
    // Sanitize input
    const sanitizedIntent = intent.replace(/[<>{}[\]$]/g, '');
    
    let plan, code, explanation;
    
    // Check if we have API key
    if (!process.env.OPENAI_API_KEY) {
      console.log('🎭 MOCK MODE - Intent:', sanitizedIntent);
      
      // Create plan
      plan = {
        structure: sanitizedIntent.includes('dashboard') ? 'dashboard' : 
                  sanitizedIntent.includes('login') ? 'single-column' : 
                  sanitizedIntent.includes('table') ? 'two-column' : 'single-column',
        components: [
          { type: 'Card', props: { title: 'Generated UI' } }
        ],
        theme: {
          spacing: 'comfortable',
          variant: 'default'
        }
      };
      
      // Select mock response
      if (sanitizedIntent.includes('dashboard') || sanitizedIntent.includes('sales') || sanitizedIntent.includes('analytics')) {
        code = MOCK_RESPONSES.dashboard;
        explanation = "I created a sales dashboard with a sidebar navigation, key metrics cards, a sales chart, and a recent orders table. This layout gives you a complete overview of your business performance at a glance.";
      } else if (sanitizedIntent.includes('login') || sanitizedIntent.includes('sign in')) {
        code = MOCK_RESPONSES.login;
        explanation = "I built a clean login form with email/password fields, remember me checkbox, and social login options. The gradient background and card design create a modern, welcoming interface.";
      } else if (sanitizedIntent.includes('table') || sanitizedIntent.includes('users') || sanitizedIntent.includes('data')) {
        code = MOCK_RESPONSES.table;
        explanation = "I created a user management table with search functionality, role badges, status indicators, and action buttons. The layout includes an 'Add User' button and export option for complete data management.";
      } else if (sanitizedIntent.includes('modal') || sanitizedIntent.includes('settings')) {
        code = MOCK_RESPONSES.modal;
        explanation = existingCode 
          ? "I added a settings modal to your existing UI. The modal includes toggle switches for various preferences and follows the same design language as your current interface."
          : "I created a settings panel with a modal dialog. The main card shows current settings, and clicking the button opens a modal where users can modify preferences.";
      } else {
        // Default response
        code = existingCode || MOCK_RESPONSES.login;
        explanation = existingCode 
          ? `I've modified your UI based on: "${sanitizedIntent}". I preserved your existing structure while adding the requested changes.`
          : `I created a ${sanitizedIntent.includes('form') ? 'form' : 'UI component'} based on your request. The layout uses Card components with proper spacing and a clean, professional design.`;
      }
    } else {
      // Real API mode - use OpenAI
      console.log('🤖 LIVE MODE - Using OpenAI API');
      plan = await planner.plan(sanitizedIntent, existingCode);
      code = await generator.generate(plan);
      explanation = await explainer.explain(plan, sanitizedIntent, !!existingCode);
    }
    
    // Store generation
    const versionId = ++currentVersion;
    generations.set(versionId, {
      id: versionId,
      intent: sanitizedIntent,
      plan,
      code,
      explanation,
      timestamp: new Date().toISOString(),
      parentVersion: version || null
    });
    
    console.log(`✅ Generated version ${versionId} for: "${sanitizedIntent}"`);
    
    res.json({
      success: true,
      data: {
        id: versionId,
        plan,
        code,
        explanation,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
  console.error('❌ Generation failed:', error);
  const errorMessage = error instanceof Error ? error.message : 'Generation failed';
  res.status(500).json({
    success: false,
    error: errorMessage
  });
}
});

app.get('/api/history', (req, res) => {
  const history = Array.from(generations.entries())
    .map(([id, gen]) => ({
      id,
      intent: gen.intent,
      timestamp: gen.timestamp,
      parentVersion: gen.parentVersion
    }))
    .sort((a, b) => b.id - a.id);
  
  res.json({ success: true, data: history });
});

app.get('/api/history/:id', (req, res) => {
  const generation = generations.get(parseInt(req.params.id));
  if (!generation) {
    return res.status(404).json({ success: false, error: 'Version not found' });
  }
  res.json({ success: true, data: generation });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✓ Present' : '✗ Missing - Using MOCK mode'}`);
  console.log(`🎯 API endpoint: http://localhost:${PORT}/api`);
  console.log('================================\n');
});