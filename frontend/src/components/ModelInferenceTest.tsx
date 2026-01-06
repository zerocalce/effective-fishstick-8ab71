import React, { useState, useEffect } from 'react';
import { Play, Send, CheckCircle, AlertCircle, Loader2, Code, Terminal, Clipboard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Deployment {
  id: string;
  modelId: string;
  status: string;
  endpoint: string;
  platform: string;
}

interface InferenceResult {
  prediction: number;
  confidence: number;
  latency: string;
  timestamp: string;
}

const ModelInferenceTest: React.FC = () => {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [inputData, setInputData] = useState('{\n  "input": [[0.1, 0.2, ...]]\n}');
  const [inferenceResult, setInferenceResult] = useState<InferenceResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: deployments, isLoading } = useQuery<Deployment[]>({
    queryKey: ['deployments'],
    queryFn: async () => {
      const response = await api.get('/deployments');
      return response.data;
    }
  });

  useEffect(() => {
    if (deployments && deployments.length > 0 && !selectedDeployment) {
      setSelectedDeployment(deployments[0]);
    }
  }, [deployments, selectedDeployment]);

  const handleTest = async () => {
    if (!selectedDeployment) return;
    
    setIsTesting(true);
    setError(null);
    setInferenceResult(null);

    try {
      const payload = JSON.parse(inputData);
      const response = await api.post(`/deployments/${selectedDeployment.id}/test`, payload);
      setInferenceResult(response.data);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON payload');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to perform inference');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const copyEndpoint = () => {
    if (selectedDeployment?.endpoint) {
      navigator.clipboard.writeText(selectedDeployment.endpoint);
    }
  };

  return (
    <div className="h-full w-full bg-slate-950 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Model Inference Testing</h1>
          <p className="text-slate-400 text-sm">Test your deployed models with custom payloads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Target Deployment</h2>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-blue-500" size={24} />
              </div>
            ) : (
              <div className="space-y-3">
                {deployments?.map((dep) => (
                  <div 
                    key={dep.id}
                    onClick={() => setSelectedDeployment(dep)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedDeployment?.id === dep.id 
                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-600/5' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{dep.modelId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold border border-green-500/20 uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{dep.platform}</div>
                  </div>
                ))}
                {deployments?.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-4">No active deployments found.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">API Endpoint</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-[10px] font-mono text-slate-400 overflow-hidden truncate">
                    {selectedDeployment?.endpoint || 'Select a deployment...'}
                  </div>
                  <button 
                    onClick={copyEndpoint}
                    disabled={!selectedDeployment}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors disabled:opacity-50"
                  >
                    <Clipboard size={14} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Auth Method</label>
                <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300">
                  Bearer Token (JWT)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-300">Request Payload (JSON)</span>
              </div>
              <button 
                onClick={handleTest}
                disabled={!selectedDeployment || isTesting}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all"
              >
                {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>{isTesting ? 'Sending...' : 'Test Inference'}</span>
              </button>
            </div>
            <div className="p-0">
              <textarea 
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="w-full h-48 bg-slate-950 p-4 text-xs font-mono text-blue-300 focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center px-5 py-3 border-b border-slate-800 bg-slate-900/50">
              <Code size={16} className="text-green-500 mr-2" />
              <span className="text-xs font-bold text-slate-300">Inference Response</span>
            </div>
            <div className="p-5 min-h-[160px] bg-slate-950">
              {inferenceResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Prediction</div>
                      <div className="text-lg font-bold text-green-400">{inferenceResult.prediction}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confidence</div>
                      <div className="text-lg font-bold text-blue-400">{(inferenceResult.confidence * 100).toFixed(2)}%</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Latency</div>
                      <div className="text-lg font-bold text-amber-400">{inferenceResult.latency}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-800/50">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                      <div className="text-lg font-bold text-slate-300 flex items-center">
                        <CheckCircle size={16} className="text-green-500 mr-1.5" />
                        200 OK
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded border border-slate-800/50">
                    <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">
                      {JSON.stringify(inferenceResult, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-red-400">
                  <AlertCircle size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <Play size={32} className="mb-2 opacity-20" />
                  <p className="text-sm italic">Execute a test to see inference results here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInferenceTest;
