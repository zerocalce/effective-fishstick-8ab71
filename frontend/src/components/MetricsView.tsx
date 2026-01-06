import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Target, Zap, Clock } from 'lucide-react';

const data = [
  { epoch: 1, loss: 0.89, accuracy: 0.45, val_loss: 0.95, val_accuracy: 0.42 },
  { epoch: 2, loss: 0.65, accuracy: 0.58, val_loss: 0.72, val_accuracy: 0.55 },
  { epoch: 3, loss: 0.48, accuracy: 0.72, val_loss: 0.55, val_accuracy: 0.68 },
  { epoch: 4, loss: 0.35, accuracy: 0.81, val_loss: 0.42, val_accuracy: 0.75 },
  { epoch: 5, loss: 0.28, accuracy: 0.88, val_loss: 0.38, val_accuracy: 0.82 },
  { epoch: 6, loss: 0.22, accuracy: 0.92, val_loss: 0.35, val_accuracy: 0.85 },
  { epoch: 7, loss: 0.18, accuracy: 0.94, val_loss: 0.32, val_accuracy: 0.87 },
  { epoch: 8, loss: 0.15, accuracy: 0.96, val_loss: 0.31, val_accuracy: 0.88 },
  { epoch: 9, loss: 0.12, accuracy: 0.97, val_loss: 0.29, val_accuracy: 0.89 },
  { epoch: 10, loss: 0.10, accuracy: 0.98, val_loss: 0.28, val_accuracy: 0.90 },
];

const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</div>
      <Icon size={18} className={color} />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className={`text-[10px] mt-1 ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
      {trend} from last run
    </div>
  </div>
);

const MetricsView: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-950 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Model Evaluation</h1>
          <p className="text-slate-400 text-sm">Real-time training metrics and performance analysis</p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-slate-300 font-medium">Training in progress...</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Current Accuracy" value="98.2%" icon={Target} trend="+2.4%" color="text-blue-400" />
        <MetricCard title="Current Loss" value="0.102" icon={Activity} trend="-0.045" color="text-red-400" />
        <MetricCard title="Throughput" value="1,240 img/s" icon={Zap} trend="+120" color="text-amber-400" />
        <MetricCard title="Time Elapsed" value="00:14:22" icon={Clock} trend="+00:01:05" color="text-slate-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Loss Curve</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="loss" stroke="#ef4444" fillOpacity={1} fill="url(#colorLoss)" />
                <Area type="monotone" dataKey="val_loss" stroke="#f87171" strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Accuracy Curve</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="val_accuracy" stroke="#60a5fa" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsView;
