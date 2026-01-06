export interface PanelInfo {
  id: string;
  title: string;
  purpose: string;
  useCases: string[];
  features: string[];
  inputsOutputs: string;
  integrations: string;
  shortcuts: { key: string; action: string }[];
  bestPractices: string[];
}

export const PANEL_DOCS: Record<string, PanelInfo> = {
  editor: {
    id: 'editor',
    title: 'Code Editor',
    purpose: 'Core development environment for writing AI models and scripts.',
    useCases: ['Writing training scripts', 'Data preprocessing', 'Custom model definitions'],
    features: ['Syntax highlighting', 'Auto-save', 'IntelliSense', 'Error checking'],
    inputsOutputs: 'Input: Python/JS code files. Output: Executable scripts and trained model weights.',
    integrations: 'Connects to Datasets for data input and Metrics for real-time training feedback.',
    shortcuts: [
      { key: 'Ctrl + S', action: 'Force save' },
      { key: 'Ctrl + Enter', action: 'Execute cell/block' },
      { key: 'Ctrl + F', action: 'Find in code' }
    ],
    bestPractices: [
      'Use modular code structures',
      'Keep training loops separate from data loading',
      'Leverage auto-save for long sessions'
    ]
  },
  builder: {
    id: 'builder',
    title: 'Visual Builder',
    purpose: 'Drag-and-drop interface for designing neural network architectures.',
    useCases: ['Rapid prototyping', 'Visualizing layer connections', 'Educational modeling'],
    features: ['Layer components', 'Automatic connection logic', 'Minimap navigation'],
    inputsOutputs: 'Input: Layer parameters and connections. Output: Generated model code/configuration.',
    integrations: 'Exports architecture definitions directly to the Code Editor.',
    shortcuts: [
      { key: 'Del', action: 'Remove selected layer' },
      { key: 'Space + Drag', action: 'Pan workspace' },
      { key: 'Ctrl + Z', action: 'Undo last change' }
    ],
    bestPractices: [
      'Start with standard architectures (CNN/RNN)',
      'Validate input/output shapes between layers',
      'Use the Minimap for large complex models'
    ]
  },
  datasets: {
    id: 'datasets',
    title: 'Dataset Manager',
    purpose: 'Centralized hub for managing and versioning training data.',
    useCases: ['Data ingestion', 'Format conversion', 'Dataset auditing'],
    features: ['Multi-format support (CSV, JSON, etc.)', 'Size monitoring', 'Path management'],
    inputsOutputs: 'Input: Raw data files. Output: Standardized datasets for training.',
    integrations: 'Feeds data directly into the Sandbox environment and Editor scripts.',
    shortcuts: [
      { key: 'Ctrl + U', action: 'Upload new file' },
      { key: 'Ctrl + R', action: 'Refresh dataset list' }
    ],
    bestPractices: [
      'Keep datasets under 2GB for optimal performance',
      'Use Parquet format for large tabular data',
      'Always include a description for dataset versions'
    ]
  },
  metrics: {
    id: 'metrics',
    title: 'Evaluation Metrics',
    purpose: 'Real-time visualization of model training performance.',
    useCases: ['Monitoring loss/accuracy', 'Hyperparameter tuning', 'Early stopping decisions'],
    features: ['Live charts', 'Comparison views', 'Epoch tracking'],
    inputsOutputs: 'Input: Log streams from training scripts. Output: Visual performance graphs.',
    integrations: 'Receives real-time data from scripts running in the Sandbox.',
    shortcuts: [
      { key: 'Ctrl + L', action: 'Clear current logs' },
      { key: 'Ctrl + P', action: 'Export charts as PDF' }
    ],
    bestPractices: [
      'Monitor validation loss to detect overfitting',
      'Use throughput metrics to optimize batch sizes',
      'Keep historical runs for performance comparison'
    ]
  },
  deployments: {
    id: 'deployments',
    title: 'Model Deployments',
    purpose: 'Production-ready hosting for trained AI models.',
    useCases: ['API generation', 'Edge deployment', 'Model exporting'],
    features: ['One-click cloud deploy', 'Endpoint monitoring', 'Multi-platform support'],
    inputsOutputs: 'Input: Trained model weights. Output: Scalable API endpoints.',
    integrations: 'Final stage of the workflow; uses models built and trained in previous steps.',
    shortcuts: [
      { key: 'Ctrl + D', action: 'Open deployment modal' },
      { key: 'Ctrl + E', action: 'Export selected model' }
    ],
    bestPractices: [
      'Select GPU tiers for latency-sensitive apps',
      'Test deployments in the Inference Test suite before production',
      'Monitor Avg. Latency to ensure system health'
    ]
  },
  git: {
    id: 'git',
    title: 'Source Control',
    purpose: 'Versioning and collaboration suite for AI projects.',
    useCases: ['Tracking code changes', 'Branching experiments', 'Team collaboration'],
    features: ['Staging/Committing', 'History timeline', 'Branch management'],
    inputsOutputs: 'Input: Code/Config changes. Output: Immutable project history.',
    integrations: 'Underpins the entire project; tracks changes across all IDE components.',
    shortcuts: [
      { key: 'Ctrl + G', action: 'Stage all changes' },
      { key: 'Ctrl + K', action: 'Focus commit message' }
    ],
    bestPractices: [
      'Write descriptive commit messages',
      'Commit frequently for complex experiments',
      'Use branches for major architectural changes'
    ]
  },
  inference: {
    id: 'inference',
    title: 'Inference Testing',
    purpose: 'Interactive sandbox for testing deployed model endpoints.',
    useCases: ['Validating predictions', 'Latency testing', 'Input payload debugging'],
    features: ['JSON payload editor', 'Confidence visualization', 'Raw response view'],
    inputsOutputs: 'Input: JSON data. Output: Model predictions and performance data.',
    integrations: 'Connects directly to active endpoints from the Deployments panel.',
    shortcuts: [
      { key: 'Ctrl + Enter', action: 'Send test request' },
      { key: 'Ctrl + I', action: 'Prettify JSON input' }
    ],
    bestPractices: [
      'Test edge cases in input payloads',
      'Compare confidence scores across different inputs',
      'Monitor round-trip latency for optimization'
    ]
  }
};
