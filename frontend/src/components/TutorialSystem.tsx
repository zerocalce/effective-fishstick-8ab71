import React, { useState } from 'react';
import { BookOpen, ChevronRight, CheckCircle2, FileText, Search, ExternalLink, GraduationCap } from 'lucide-react';

const tutorials = [
  {
    id: '1',
    title: 'Getting Started with AI Studio',
    steps: [
      'Create a new project',
      'Upload your first dataset',
      'Choose a runtime environment',
    ],
    duration: '5 min'
  },
  {
    id: '2',
    title: 'Building Neural Networks Visually',
    steps: [
      'Open the Visual Builder',
      'Drag a Conv2D layer',
      'Connect layers and configure parameters',
    ],
    duration: '10 min'
  },
  {
    id: '3',
    title: 'Training and Evaluation',
    steps: [
      'Write training script in Python',
      'Monitor real-time metrics',
      'Export model to ONNX format',
    ],
    duration: '15 min'
  }
];

const docs = [
  {
    category: 'Core Concepts',
    items: [
      { title: 'Sandbox Architecture', desc: 'Understanding isolated execution environments.' },
      { title: 'Resource Management', desc: 'Allocating CPU, GPU, and RAM for your models.' },
      { title: 'Dataset Lifecycle', desc: 'From ingestion to preprocessing and training.' },
      { title: 'One-Click Deployment', desc: 'Deploy models to AWS, GCP, or Azure with a single click.' },
      { title: 'Source Control & Versioning', desc: 'Track model experiments and code changes with Git.' },
      { title: 'Real-time Collaboration', desc: 'Invite teammates to your sandbox for pair programming.' }
    ]
  },
  {
    category: 'API Reference',
    items: [
      { title: 'Studio SDK', desc: 'Interact with the sandbox programmatically.' },
      { title: 'Deployment API', desc: 'Manage your active model endpoints.' },
      { title: 'Metrics Hook', desc: 'Custom logging for real-time visualization.' },
      { title: 'Model Exporting', desc: 'Export to ONNX, TFLite, or PyTorch formats.' },
      { title: 'Git Workflow', desc: 'CLI and UI methods for version control integration.' },
      { title: 'Collaboration API', desc: 'Programmatic project access and member management.' }
    ]
  }
];

const TutorialSystem: React.FC = () => {
  const [view, setView] = useState<'tutorials' | 'docs'>('tutorials');
  const [selectedTutorial, setSelectedTutorial] = useState(tutorials[0]);

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Learning Center</h1>
            <p className="text-slate-400 text-sm">Master AI development with step-by-step guides and documentation</p>
          </div>
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button 
              onClick={() => setView('tutorials')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                view === 'tutorials' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap size={16} />
              <span>Tutorials</span>
            </button>
            <button 
              onClick={() => setView('docs')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                view === 'docs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText size={16} />
              <span>Documentation</span>
            </button>
          </div>
        </div>

        {view === 'docs' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        {view === 'tutorials' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Available Tracks</h2>
              {tutorials.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTutorial(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTutorial.id === t.id 
                      ? 'bg-blue-600/10 border-blue-600 shadow-lg shadow-blue-600/5' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{t.title}</h3>
                      <div className="text-[10px] text-slate-400 flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {t.duration}
                      </div>
                    </div>
                    {selectedTutorial.id === t.id && <ChevronRight size={16} className="text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-black text-white mb-8 tracking-tight">{selectedTutorial.title}</h2>
                <div className="space-y-8">
                  {selectedTutorial.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-6">
                      <div className="mt-1 flex-shrink-0">
                        {index === 0 ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-600">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="border-b border-slate-800/50 pb-6 flex-grow last:border-0 last:pb-0">
                        <h4 className="text-slate-100 font-bold mb-2">Step {index + 1}: {step}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Learn how to perform this action within the AI Studio environment to advance your model development workflow. This step covers the essential configurations and best practices.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-xs text-slate-500 font-medium italic">
                    You've completed 1 of 3 steps in this track.
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20">
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {docs.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.title} className="group p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialSystem;
