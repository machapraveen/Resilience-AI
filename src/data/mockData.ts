import { Server, Incident, AuditLog, ChangeRequest, ChatMessage, CPUMetric } from "@/types";

// Helper function to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const hoursAgo = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

const minutesAgo = (minutes: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date;
};

// Generate CPU metrics with optional spike patterns
const generateCPUMetrics = (
  hours: number, 
  intervalMinutes: number, 
  baseLoad: number, 
  variation: number, 
  spikes: Array<{ hour: number, value: number }> = []
): CPUMetric[] => {
  const metrics: CPUMetric[] = [];
  const now = new Date();
  const totalPoints = (hours * 60) / intervalMinutes;
  
  for (let i = 0; i < totalPoints; i++) {
    const timestamp = new Date(now);
    timestamp.setMinutes(now.getMinutes() - (i * intervalMinutes));
    
    // Calculate which hour this data point belongs to
    const hourOfHour = Math.floor(i * intervalMinutes / 60);
    
    // Check if there's a spike defined for this hour
    const spikeForHour = spikes.find(spike => spike.hour === hourOfHour);
    
    let value;
    if (spikeForHour) {
      // Use the spike value with some small random variation
      value = spikeForHour.value + (Math.random() * variation * 0.5);
    } else {
      // Use the base load with random variation
      value = baseLoad + (Math.random() * variation * 2 - variation);
    }
    
    // Keep the value between 0 and 100
    value = Math.min(Math.max(value, 0), 100);
    
    metrics.push({
      timestamp,
      value,
      predicted: false
    });
  }
  
  // Add a few predicted values in the future
  const futurePoints = 5;
  for (let i = 1; i <= futurePoints; i++) {
    const timestamp = new Date(now);
    timestamp.setMinutes(now.getMinutes() + (i * intervalMinutes));
    
    // For the prediction, show a concerning trend
    const lastRealValue = metrics[0].value;
    let predictedValue = lastRealValue + (i * 5);
    
    // If the last server has a spike pattern, make its predictions show high CPU
    if (metrics[0].value > 70) {
      predictedValue = Math.min(lastRealValue + (i * 3), 98);
    }
    
    metrics.push({
      timestamp,
      value: predictedValue,
      predicted: true
    });
  }
  
  // Sort metrics by timestamp ascending
  return metrics.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Generate mock servers
export const mockServers: Server[] = [
  {
    id: "srv-001",
    name: "prod-web-01",
    ip: "10.1.0.101",
    status: "online",
    riskScore: 25,
    cpuMetrics: generateCPUMetrics(24, 15, 40, 10),
    lastUpdated: minutesAgo(5),
    environment: "production",
    assignmentGroup: "Cloud Operations",
    location: "us-east-1a"
  },
  {
    id: "srv-002",
    name: "prod-web-02",
    ip: "10.1.0.102",
    status: "online",
    riskScore: 40,
    cpuMetrics: generateCPUMetrics(24, 15, 45, 15),
    lastUpdated: minutesAgo(3),
    environment: "production",
    assignmentGroup: "Cloud Operations",
    location: "us-east-1b"
  },
  {
    id: "srv-003",
    name: "prod-db-01",
    ip: "10.1.0.201",
    status: "online",
    riskScore: 85, // High risk
    cpuMetrics: generateCPUMetrics(24, 15, 50, 10, [{ hour: 1, value: 92 }]), // Spike 1 hour ago
    lastUpdated: minutesAgo(2),
    environment: "production",
    assignmentGroup: "Database Operations",
    location: "us-east-1a"
  },
  {
    id: "srv-004",
    name: "prod-cache-01",
    ip: "10.1.0.150",
    status: "auto-remediated",
    riskScore: 60,
    cpuMetrics: generateCPUMetrics(24, 15, 55, 20, [{ hour: 2, value: 88 }]), // Spike 2 hours ago
    lastUpdated: minutesAgo(15),
    environment: "production",
    assignmentGroup: "Cloud Operations",
    location: "us-east-1c"
  },
  {
    id: "srv-005",
    name: "stage-web-01",
    ip: "10.2.0.101",
    status: "maintenance",
    riskScore: 15,
    cpuMetrics: generateCPUMetrics(24, 15, 30, 10),
    lastUpdated: hoursAgo(2),
    environment: "staging",
    assignmentGroup: "Cloud Operations",
    location: "us-east-1a"
  },
];

// Generate mock incidents
export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    serverId: "srv-003",
    serverName: "prod-db-01",
    number: "INC0010042",
    shortDescription: "High CPU utilization predicted on prod-db-01",
    description: "Machine learning model has predicted CPU utilization to exceed 85% within the next 5 minutes. Auto-remediation has been initiated.",
    priority: 2,
    status: "in_progress",
    assignmentGroup: "Database Operations",
    createdAt: minutesAgo(5),
    updatedAt: minutesAgo(2),
    autoRemediated: true
  },
  {
    id: "inc-002",
    serverId: "srv-004",
    serverName: "prod-cache-01",
    number: "INC0010041",
    shortDescription: "High CPU utilization detected on prod-cache-01",
    description: "CPU utilization reached 88% at 2:15 PM. Auto-remediation has successfully restarted the service.",
    priority: 3,
    status: "resolved",
    assignmentGroup: "Cloud Operations",
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(1),
    autoRemediated: true
  },
];

// Generate mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: minutesAgo(5),
    action: "Anomaly Detection",
    actor: "resai_AnomalyModel",
    serverId: "srv-003",
    serverName: "prod-db-01",
    riskScore: 85,
    outcome: "Initiated remediation",
    details: "CPU utilization predicted to exceed 85% threshold within 5 minutes"
  },
  {
    id: "log-002",
    timestamp: minutesAgo(4),
    action: "Risk Assessment",
    actor: "resai_RiskCheck",
    serverId: "srv-003",
    serverName: "prod-db-01",
    riskScore: 85,
    outcome: "High risk detected",
    details: "Server risk score >= 70, creating change request"
  },
  {
    id: "log-003",
    timestamp: minutesAgo(3),
    action: "Change Creation",
    actor: "resai_AutoRemediateBot",
    serverId: "srv-003",
    serverName: "prod-db-01",
    riskScore: 85,
    outcome: "Change request created",
    details: "Emergency change CHG0010055 created for Security Operations review"
  },
  {
    id: "log-004",
    timestamp: hoursAgo(2),
    action: "Anomaly Detection",
    actor: "resai_AnomalyModel",
    serverId: "srv-004",
    serverName: "prod-cache-01",
    riskScore: 60,
    outcome: "Initiated remediation",
    details: "CPU utilization exceeded 85% threshold"
  },
  {
    id: "log-005",
    timestamp: hoursAgo(1),
    action: "VM Restart",
    actor: "resai_RemediationFlow",
    serverId: "srv-004",
    serverName: "prod-cache-01",
    riskScore: 60,
    outcome: "Success",
    details: "Virtual machine restarted successfully"
  },
];

// Generate mock change requests
export const mockChangeRequests: ChangeRequest[] = [
  {
    id: "chg-001",
    number: "CHG0010055",
    serverId: "srv-003",
    serverName: "prod-db-01",
    shortDescription: "Emergency resource allocation for prod-db-01",
    description: "Increase resource allocation to handle predicted CPU spike and validate database integrity.",
    type: "emergency",
    risk: "high",
    status: "approve",
    assignmentGroup: "Security Operations",
    createdAt: minutesAgo(3),
    updatedAt: minutesAgo(2)
  },
];

// Generate mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-001",
    sender: "agent",
    content: "Welcome to ResilienceAI Virtual Agent. How can I assist you today?",
    timestamp: minutesAgo(10)
  },
  {
    id: "msg-002",
    sender: "system",
    content: "🔔 [ResilienceAI] High CPU predicted on server prod-db-01. Auto-remediation in progress—please save your work.",
    timestamp: minutesAgo(5),
    isAlert: true,
    serverId: "srv-003"
  },
  {
    id: "msg-003",
    sender: "user",
    content: "What's happening with server prod-db-01?",
    timestamp: minutesAgo(4)
  },
  {
    id: "msg-004",
    sender: "agent",
    content: "The ML model has predicted a CPU spike above 85% on prod-db-01 within the next 5 minutes. I've created incident INC0010042 and initiated auto-remediation. A change request CHG0010055 was also created due to the high risk score (85) of this server. Security Operations team is reviewing the change now.",
    timestamp: minutesAgo(3)
  }
];

// Function to get a formatted risk level based on score
export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
};
