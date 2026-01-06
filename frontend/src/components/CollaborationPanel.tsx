import React from 'react';
import { Users, UserPlus, Shield, MessageSquare, Lock, Globe, X } from 'lucide-react';

const collaborators = [
  { id: '1', name: 'Alex Johnson', role: 'Owner', status: 'Online', avatar: 'AJ' },
  { id: '2', name: 'Sarah Smith', role: 'Editor', status: 'Editing train_model.py', avatar: 'SS' },
  { id: '3', name: 'ML Bot', role: 'Viewer', status: 'Offline', avatar: 'MB' },
];

interface CollaborationPanelProps {
  onClose?: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ onClose }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-80 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Users size={16} className="mr-2 text-blue-500" />
          Collaboration
        </h3>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <UserPlus size={18} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Now</h4>
          {collaborators.map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.status}</div>
                </div>
              </div>
              <div className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-slate-700 transition-colors">
                {user.role}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Project Access</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Lock size={14} className="text-amber-500" />
                <span>Private Project</span>
              </div>
              <Shield size={14} className="text-slate-600" />
            </div>
            <div className="flex items-center space-x-2 p-2 text-[10px] text-slate-500">
              <Globe size={12} />
              <span>Only invited members can view this sandbox.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-3 border-t border-slate-800">
        <button className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors shadow-lg shadow-blue-600/10">
          <MessageSquare size={14} />
          <span>Open Team Chat</span>
        </button>
      </div>
    </div>
  );
};

export default CollaborationPanel;
