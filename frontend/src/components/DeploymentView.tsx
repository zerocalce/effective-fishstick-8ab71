import React, { useState } from 'react';
import { Rocket, Globe, Shield, Zap, Server, Code, ExternalLink, RefreshCw, X, CheckCircle, Loader2, Download, FileJson } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../services/api';

interface Deployment {
  id: string;
  modelId: string;
  status: string;
  endpoint: string;
  platform: string;
  resourceType: string;
  instanceCount: number;
  createdAt: string;
}

interface Model {
  id: string;
  name: string;
  version: string;
  framework: string;
}

const DeploymentView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedModelForExport, setSelectedModelForExport] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('ONNX');
  const [newDeployment, setNewDeployment] = useState({
    modelId: '',
    platform: 'AWS Lambda',
    resourceType: 'GPU-Small',
    instanceCount: 1
  });

  const queryClient = useQueryClient();

  const { data: models, isLoading: isLoadingModels } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: async () => {
      const response = await api.get('/models');
      return response.data;
    }
  });

  const { data: deployments, isLoading } = useQuery<Deployment[]>({
    queryKey: ['deployments'],
    queryFn: async () => {
      const response = await api.get('/deployments');
      return response.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (deployment: typeof newDeployment) => {
      const response = await api.post('/deployments', deployment, {
        timeout: 15000 // 15 second timeout
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Deployment failed:', errorMessage);
    }
  });

  const exportMutation = useMutation({
    mutationFn: async ({ id, format }: { id: string, format: string }) => {
      const response = await api.post(`/models/${id}/export`, { format });
      return response.data;
    },
    onSuccess: (data) => {
      alert(`Model exported successfully! Download link: ${data.downloadUrl}`);
      setIsExportModalOpen(false);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert(`Export failed: ${error.response?.data?.error || error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/deployments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert(`Delete failed: ${error.response?.data?.error || error.message}`);
    }
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/deployments');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      alert(`Clear failed: ${error.response?.data?.error || error.message}`);
    }
  });

  const openDeploymentModal = () => {
    mutation.reset();
    if (models && models.length > 0 && !newDeployment.modelId) {
      setNewDeployment(prev => ({ ...prev, modelId: models[0].id }));
    }
    setIsModalOpen(true);
  };

  const handleDeploy = () => {
    mutation.mutate(newDeployment);
  };

  const handleExport = (modelId: string) => {
    exportMutation.reset();
    setSelectedModelForExport(modelId);
    setIsExportModalOpen(true);
  };

  const confirmExport = () => {
    if (selectedModelForExport) {
      exportMutation.mutate({ id: selectedModelForExport, format: exportFormat });
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Model Deployment</h1>
          <p className="text-slate-400 text-sm">Deploy your models as scalable API endpoints</p>
        </div>
        <div className="flex items-center space-x-3">
          {deployments && deployments.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all deployments?')) {
                  clearAllMutation.mutate();
                }
              }}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded font-medium transition-colors border border-slate-700"
              disabled={clearAllMutation.isPending}
            >
              <X size={18} />
              <span>{clearAllMutation.isPending ? 'Clearing...' : 'Clear All'}</span>
            </button>
          )}
          <button 
            onClick={openDeploymentModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            <Rocket size={18} />
            <span>New Deployment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase mb-2">
            <Globe size={14} />
            <span>Active Endpoints</span>
          </div>
          <div className="text-2xl font-bold text-white">{deployments?.length || 0}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase mb-2">
            <Zap size={14} />
            <span>Avg. Latency</span>
          </div>
          <div className="text-2xl font-bold text-white">42ms</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase mb-2">
            <Shield size={14} />
            <span>System Health</span>
          </div>
          <div className="text-2xl font-bold text-green-500">99.9%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase mb-2">
            <Server size={14} />
            <span>Total Requests</span>
          </div>
          <div className="text-2xl font-bold text-white">1.2M</div>
        </div>
      </div>

      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Current Deployments</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {deployments?.map((dep) => (
            <div key={dep.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-600/10 rounded-lg">
                    <Code className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-bold">{dep.modelId}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-1.5 ${dep.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        {dep.status}
                      </span>
                      <span>•</span>
                      <span>{dep.platform}</span>
                      <span>•</span>
                      <span>{dep.resourceType}</span>
                      <span>•</span>
                      <span>{dep.instanceCount} Instances</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-400 overflow-hidden truncate max-w-[300px]">
                    {dep.endpoint}
                  </div>
                  <button 
                    onClick={() => handleExport(dep.modelId)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                    title="Export Model"
                  >
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                    <ExternalLink size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                    <RefreshCw size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this deployment?')) {
                        deleteMutation.mutate(dep.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete Deployment"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === dep.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <X size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {deployments?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-lg">
              <p className="text-slate-500 italic">No active deployments found.</p>
            </div>
          )}
        </div>
      )}

      {/* New Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Rocket size={20} className="text-blue-500" />
                New Model Deployment
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Model to Deploy</label>
                <div className="relative">
                  <select 
                    value={newDeployment.modelId}
                    onChange={(e) => setNewDeployment({...newDeployment, modelId: e.target.value})}
                    disabled={isLoadingModels}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
                  >
                    {isLoadingModels ? (
                      <option value="">Loading models...</option>
                    ) : (
                      <>
                        {models?.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name} (v{model.version})
                          </option>
                        ))}
                        {(!models || models.length === 0) && (
                          <option value="" disabled>No models available</option>
                        )}
                      </>
                    )}
                  </select>
                  {isLoadingModels && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 size={16} className="animate-spin text-slate-500" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Target Platform</label>
                <select 
                  value={newDeployment.platform}
                  onChange={(e) => setNewDeployment({...newDeployment, platform: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="AWS Lambda">AWS Lambda (Serverless)</option>
                  <option value="GCP Vertex AI">GCP Vertex AI</option>
                  <option value="Azure ML">Azure Machine Learning</option>
                  <option value="On-Premise">On-Premise (K8s)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Resource Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {['CPU-Optimized', 'GPU-Small', 'GPU-Medium', 'GPU-Large'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setNewDeployment({...newDeployment, resourceType: tier})}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        newDeployment.resourceType === tier 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                          : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Instance Count: {newDeployment.instanceCount}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={newDeployment.instanceCount}
                  onChange={(e) => setNewDeployment({...newDeployment, instanceCount: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {mutation.isError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start space-x-2">
                  <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-400 leading-relaxed">
                    {(mutation.error as AxiosError<{error: string}>)?.response?.data?.error || mutation.error.message}
                  </p>
                </div>
              )}

              <button 
                type="button"
                onClick={handleDeploy}
                disabled={mutation.isPending || !newDeployment.modelId}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 mt-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    <span>Launch Deployment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Model Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download size={20} className="text-green-500" />
                Export Model: {selectedModelForExport}
              </h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Select Export Format</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'ONNX', name: 'ONNX', desc: 'Universal format' },
                    { id: 'TFLITE', name: 'TF Lite', desc: 'Mobile & Edge' },
                    { id: 'COREML', name: 'CoreML', desc: 'Apple Devices' },
                    { id: 'PYTORCH', name: 'TorchScript', desc: 'PyTorch Native' }
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        exportFormat === format.id 
                          ? 'bg-green-600/10 border-green-500 ring-1 ring-green-500' 
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${exportFormat === format.id ? 'text-green-400' : 'text-white'}`}>
                          {format.name}
                        </span>
                        <FileJson size={16} className={exportFormat === format.id ? 'text-green-500' : 'text-slate-600'} />
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{format.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/10 border border-blue-800/50 rounded-lg p-3">
                <p className="text-xs text-blue-400 leading-relaxed">
                  Exporting will optimize the model weights and graph for the selected format. This process may take a few minutes.
                </p>
              </div>

              <button 
                onClick={confirmExport}
                disabled={exportMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Optimizing & Exporting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Confirm & Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentView;
