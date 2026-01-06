import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Database, 
  BarChart3, 
  Settings, 
  Play, 
  Save, 
  Share2,
  ChevronDown,
  Layers,
  Rocket,
  BookOpen,
  GitBranch,
  Loader2
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import VisualBuilder from './components/VisualBuilder';
import DatasetManager from './components/DatasetManager';
import MetricsView from './components/MetricsView';
import TutorialSystem from './components/TutorialSystem';
import DeploymentView from './components/DeploymentView';
import ModelInferenceTest from './components/ModelInferenceTest';
import CollaborationPanel from './components/CollaborationPanel';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import GitPanel from './components/GitPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogOut, User as UserIcon, CloudCheck, Cloud, Bot } from 'lucide-react';

const queryClient = new QueryClient();

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={`p-3 cursor-pointer transition-colors ${active ? 'bg-studio-accent text-white' : 'text-slate-400 hover:bg-slate-800'}`}
    title={label}
  >
    <Icon size={24} />
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [code, setCode] = useState(() => {
    return localStorage.getItem('studio_code') || '# AI Development in Python\nimport torch\nimport numpy as np\n\nprint("Hello AI Studio")';
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('studio_token') !== null;
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('studio_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Auto-save logic
  useEffect(() => {
    if (saveStatus === 'saved') return;
    
    const timeout = setTimeout(() => {
      setSaveStatus('saving');
      localStorage.setItem('studio_code', code);
      // Mock API call delay
      setTimeout(() => {
        setSaveStatus('saved');
      }, 1000);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [code, saveStatus]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setSaveStatus('unsaved');
  };

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('studio_token', token);
    localStorage.setItem('studio_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('studio_token');
    localStorage.removeItem('studio_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-full bg-studio-bg overflow-hidden text-slate-200">
        {/* Primary Sidebar */}
        <div className="w-16 bg-studio-sidebar border-r border-slate-700 flex flex-col items-center py-4 space-y-4">
          <SidebarItem 
            icon={FileCode} 
            label="Editor" 
            active={activeTab === 'editor'} 
            onClick={() => setActiveTab('editor')} 
          />
          <SidebarItem 
            icon={Layers} 
            label="Visual Builder" 
            active={activeTab === 'builder'} 
            onClick={() => setActiveTab('builder')} 
          />
          <SidebarItem 
            icon={Database} 
            label="Datasets" 
            active={activeTab === 'datasets'} 
            onClick={() => setActiveTab('datasets')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Metrics" 
            active={activeTab === 'metrics'} 
            onClick={() => setActiveTab('metrics')} 
          />
          <SidebarItem 
            icon={Rocket} 
            label="Deployments" 
            active={activeTab === 'deployments'} 
            onClick={() => setActiveTab('deployments')} 
          />
          <SidebarItem 
            icon={Play} 
            label="Inference Test" 
            active={activeTab === 'inference'} 
            onClick={() => setActiveTab('inference')} 
          />
          <SidebarItem 
            icon={GitBranch} 
            label="Source Control" 
            active={activeTab === 'git'} 
            onClick={() => setActiveTab('git')} 
          />
          <SidebarItem 
            icon={BookOpen} 
            label="Tutorials" 
            active={activeTab === 'tutorials'} 
            onClick={() => setActiveTab('tutorials')} 
          />
          <div className="flex-grow" />
          
          <div className="relative group">
            <div className="p-3 cursor-pointer text-slate-400 hover:text-white">
              <UserIcon size={24} />
            </div>
            <div className="absolute left-full bottom-0 ml-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl hidden group-hover:block z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800">
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-500">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-3 text-sm text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <SidebarItem icon={Settings} label="Settings" />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Header */}
          <div className="h-12 bg-studio-sidebar border-b border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-studio-accent tracking-tighter text-xl">AI STUDIO</span>
              <div className="h-4 w-[1px] bg-slate-700" />
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>my-first-project</span>
                <ChevronDown size={14} />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider">
                {saveStatus === 'saved' ? (
                  <>
                    <CloudCheck size={14} className="text-green-500" />
                    <span className="text-slate-400">Cloud Saved</span>
                  </>
                ) : saveStatus === 'saving' ? (
                  <>
                    <Loader2 size={14} className="text-blue-500 animate-spin" />
                    <span className="text-blue-400">Saving...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={14} className="text-amber-500" />
                    <span className="text-amber-400">Unsaved Changes</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setShowCollaboration(!showCollaboration)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                title="Collaborate with team"
              >
                <Share2 size={16} />
                <span>Collaborate</span>
              </button>
              <button 
                onClick={() => setShowAssistant(!showAssistant)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-all shadow-lg ${showAssistant ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                title="Open AI Assistant"
              >
                <Bot size={16} />
                <span>Assistant</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded bg-studio-accent hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                <Play size={16} />
                <span>Run Model</span>
              </button>
              <button className="p-1.5 rounded hover:bg-slate-800 text-slate-400">
                <Save size={20} />
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-grow relative">
            {activeTab === 'editor' && (
              <div className="h-full w-full">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  defaultValue={code}
                  theme="vs-dark"
                  onChange={(value) => handleCodeChange(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
            
            {activeTab === 'builder' && <VisualBuilder />}
            {activeTab === 'datasets' && <DatasetManager />}
            {activeTab === 'metrics' && <MetricsView />}
            {activeTab === 'deployments' && <DeploymentView />}
            {activeTab === 'inference' && <ModelInferenceTest />}
            {activeTab === 'git' && <GitPanel />}
            {activeTab === 'tutorials' && <TutorialSystem />}

            {/* Collaboration Overlay */}
            {showCollaboration && (
              <div className="absolute top-0 right-0 h-full w-80 shadow-2xl z-10">
                <CollaborationPanel onClose={() => setShowCollaboration(false)} />
              </div>
            )}

            {/* AI Assistant Sidebar */}
            <AIAssistant 
              activePanelId={activeTab} 
              isOpen={showAssistant} 
              onClose={() => setShowAssistant(false)} 
            />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
