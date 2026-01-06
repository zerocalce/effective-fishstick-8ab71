import React from 'react';
import { Database, FileText, Download, Upload, Trash2, Search, Filter } from 'lucide-react';

const datasets = [
  { id: '1', name: 'mnist_train.csv', size: '12.4 MB', format: 'CSV', samples: 60000, lastUsed: '2 hours ago' },
  { id: '2', name: 'cifar10_labels.json', size: '2.1 MB', format: 'JSON', samples: 10, lastUsed: '1 day ago' },
  { id: '3', name: 'nlp_corpus.parquet', size: '450.8 MB', format: 'Parquet', samples: 1250000, lastUsed: '3 days ago' },
];

const DatasetManager: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-950 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dataset Management</h1>
          <p className="text-slate-400 text-sm">Upload, manage and preprocess your training data</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
          <Upload size={18} />
          <span>Upload Dataset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Storage</div>
          <div className="text-2xl font-bold text-white">465.3 MB</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full w-[45%]"></div>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 text-right">4.5 GB / 10 GB</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center flex flex-col items-center justify-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Datasets</div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center flex flex-col items-center justify-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Last Preprocessed</div>
          <div className="text-sm font-bold text-white">mnist_train.csv</div>
          <div className="text-[10px] text-slate-500">2 hours ago</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search datasets..." 
              className="bg-slate-950 border border-slate-800 rounded pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800/50">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Format</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Samples</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {datasets.map((ds) => (
              <tr key={ds.id} className="text-sm text-slate-300 hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <FileText size={18} className="text-blue-400" />
                    <span className="font-medium text-slate-200">{ds.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">{ds.format}</span>
                </td>
                <td className="px-6 py-4">{ds.size}</td>
                <td className="px-6 py-4">{ds.samples.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"><Download size={16} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetManager;
