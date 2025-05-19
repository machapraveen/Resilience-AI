
// Types for our ResilienceAI application

export interface Server {
  id: string;
  name: string;
  ip: string;
  ipAddress: string; // Added property
  status: 'online' | 'offline' | 'maintenance' | 'auto-remediated';
  riskScore: number;
  cpuMetrics: CPUMetric[];
  lastUpdated: Date;
  environment: 'production' | 'staging' | 'development';
  assignmentGroup: string;
  location: string;
  os: string; // Added property
  lastBooted: Date; // Added property
  statusMessage?: string; // Added optional property
}

export interface CPUMetric {
  timestamp: Date;
  value: number;
  predicted: boolean;
}

export interface Incident {
  id: string;
  serverId: string;
  serverName: string;
  number: string;
  shortDescription: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignmentGroup: string;
  createdAt: Date;
  updatedAt: Date;
  autoRemediated: boolean;
  resolutionNotes?: string; // Added optional property
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  serverId: string;
  serverName: string;
  resourceId: string; // Added property to align with usage
  riskScore: number;
  outcome: string;
  details: string;
}

export interface ChangeRequest {
  id: string;
  number: string;
  serverId: string;
  serverName: string;
  shortDescription: string;
  description: string;
  type: 'normal' | 'emergency' | 'standard';
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'assess' | 'approve' | 'implement' | 'review' | 'closed';
  assignmentGroup: string;
  createdAt: Date;
  updatedAt: Date;
  relatedIncidentId?: string; // Added optional property
  plannedStart?: Date; // Added optional property
  summary?: string; // Added optional property
}

export interface ChatMessage {
  id: string;
  sender: 'system' | 'user' | 'agent';
  content: string;
  timestamp: Date;
  isAlert?: boolean;
  serverId?: string;
}
