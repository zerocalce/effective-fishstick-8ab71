import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, Clock, Plus, Check, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  hash: string;
}

const GitPanel: React.FC = () => {
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [stagedFiles, setStagedFiles] = useState([
    { name: 'model_training.py', status: 'modified' },
    { name: 'data_loader.py', status: 'added' }
  ]);
  const [unstagedFiles, setUnstagedFiles] = useState([
    { name: 'README.md', status: 'modified' },
    { name: 'config.yaml', status: 'modified' }
  ]);

  const commits: Commit[] = [
    { id: '1', message: 'Improve learning rate scheduler', author: 'AI Dev', date: '2 hours ago', hash: '8f3d2a1' },
    { id: '2', message: 'Update preprocessing pipeline', author: 'AI Dev', date: '5 hours ago', hash: '3e9b1c4' },
    { id: '3', message: 'Initial commit', author: 'AI Dev', date: 'Yesterday', hash: 'a1b2c3d' }
  ];

  const handleStage = (file: any, isUnstaged: boolean) => {
    if (isUnstaged) {
      setUnstagedFiles(unstagedFiles.filter(f => f.name !== file.name));
      setStagedFiles([...stagedFiles, file]);
    } else {
      setStagedFiles(stagedFiles.filter(f => f.name !== file.name));
      setUnstagedFiles([...unstagedFiles, file]);
    }
  };

  const handleCommit = () => {
    if (commitMessage && stagedFiles.length > 0) {
      alert(`Committed: ${commitMessage}`);
      setCommitMessage('');
      setStagedFiles([]);
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitBranch size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold text-white">Source Control</h2>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Branch:</span>
          <span className="text-xs text-blue-400 font-mono">{branch}</span>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Side: Changes */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            {/* Staged Changes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Staged Changes</h3>
                <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">
                  {stagedFiles.length}
                </span>
              </div>
              <div className="space-y-1">
                {stagedFiles.map(file => (
                  <div key={file.name} className="group flex items-center justify-between p-2 rounded hover:bg-slate-900 transition-colors">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-300 font-mono">{file.name}</span>
                      <span className="text-[10px] text-green-500 font-bold uppercase">M</span>
                    </div>
                    <button 
                      onClick={() => handleStage(file, false)}
                      className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Unstaged Changes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Changes</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">
                  {unstagedFiles.length}
                </span>
              </div>
              <div className="space-y-1">
                {unstagedFiles.map(file => (
                  <div key={file.name} className="group flex items-center justify-between p-2 rounded hover:bg-slate-900 transition-colors">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-300 font-mono">{file.name}</span>
                      <span className="text-[10px] text-amber-500 font-bold uppercase">M</span>
                    </div>
                    <button 
                      onClick={() => handleStage(file, true)}
                      className="p-1 text-slate-500 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commit Input Area */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <textarea 
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message..."
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-all"
            />
            <button 
              onClick={handleCommit}
              disabled={!commitMessage || stagedFiles.length === 0}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <GitCommit size={16} />
              <span>Commit to {branch}</span>
            </button>
          </div>
        </div>

        {/* Right Side: History & Sync */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-slate-950/50">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <ArrowDown size={14} />
                <span>Pull (0)</span>
              </button>
              <button className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <ArrowUp size={14} />
                <span>Push (2)</span>
              </button>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded transition-all">
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Commit History</h3>
            {commits.map(commit => (
              <div key={commit.id} className="relative pl-6 pb-6 border-l border-slate-800 last:pb-0">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950" />
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3 hover:border-slate-700 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{commit.message}</span>
                    <span className="text-[10px] font-mono text-slate-500">{commit.hash}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                    <span className="font-bold text-blue-500/70">{commit.author}</span>
                    <span>•</span>
                    <span>{commit.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors">
              <GitPullRequest size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">PRs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-400 transition-colors">
              <GitMerge size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Merge</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors">
              <Clock size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitPanel;
