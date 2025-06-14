// FIXED ResilienceAI Service - transforms data to match component expectations
import { mockIncidents, mockAuditLogs } from '@/data/mockData';

interface ServiceNowConfig {
  instance: string;
  username: string;
  password: string;
  apiVersion: string;
}

interface TableAPIResponse<T> {
  result: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface FlowResponse {
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
}

interface AIAgentResponse {
  agentId: string;
  response: string;
  confidence: number;
  actions: string[];
  timestamp: string;
}

class ServiceNowAPIClient {
  private config: ServiceNowConfig;
  private baseUrl: string;

  constructor(config: ServiceNowConfig) {
    this.config = config;
    this.baseUrl = `https://${config.instance}.service-now.com/api/now`;
  }

  async getTableRecords<T>(tableName: string, query?: string, limit = 100): Promise<TableAPIResponse<T>> {
    // Return mock data that follows ServiceNow patterns
    return this.mockServiceNowResponse<T>(tableName);
  }

  async createRecord<T>(tableName: string, data: Partial<T>): Promise<T> {
    const mockRecord = {
      ...data,
      sys_id: this.generateSysId(),
      sys_created_on: new Date().toISOString(),
      sys_updated_on: new Date().toISOString(),
      sys_created_by: 'resai_system',
      sys_updated_by: 'resai_system'
    };

    console.log(`✅ Creating record in ${tableName}:`, mockRecord);
    return mockRecord as T;
  }

  async updateRecord<T>(tableName: string, sysId: string, data: Partial<T>): Promise<T> {
    const updatedRecord = {
      ...data,
      sys_id: sysId,
      sys_updated_on: new Date().toISOString(),
      sys_updated_by: 'resai_system'
    };

    console.log(`✅ Updating record ${sysId} in ${tableName}:`, updatedRecord);
    return updatedRecord as T;
  }

  async executeFlow(flowName: string, inputs: Record<string, any>): Promise<FlowResponse> {
    console.log(`✅ Executing flow: ${flowName}`, inputs);
    
    const executionId = this.generateSysId();
    
    return {
      executionId,
      status: 'running',
      output: {
        message: `Flow ${flowName} started successfully`,
        inputs
      }
    };
  }

  async getFlowExecution(executionId: string): Promise<FlowResponse> {
    return {
      executionId,
      status: 'completed',
      output: {
        message: 'Flow completed successfully',
        actions_taken: ['incident_created', 'remediation_applied', 'notifications_sent']
      }
    };
  }

  async invokeAIAgent(agentName: string, prompt: string, context?: Record<string, any>): Promise<AIAgentResponse> {
    console.log(`✅ Invoking AI Agent: ${agentName}`, { prompt, context });

    const responses = {
      'resai_AutoRemediateBot': this.generateRemediationResponse(context),
      'resai_RiskAssessmentBot': this.generateRiskAssessmentResponse(context)
    };

    return responses[agentName as keyof typeof responses] || {
      agentId: agentName,
      response: 'AI agent response not available',
      confidence: 0.5,
      actions: [],
      timestamp: new Date().toISOString()
    };
  }

  async sendVirtualAgentMessage(topic: string, message: string, userId?: string): Promise<any> {
    console.log(`✅ Sending Virtual Agent message - Topic: ${topic}, Message: ${message}`);
    
    return {
      messageId: this.generateSysId(),
      topic,
      message,
      status: 'sent',
      timestamp: new Date().toISOString(),
      recipients: userId ? [userId] : ['all_affected_users']
    };
  }

  async getRiskScore(configurationItem: string): Promise<number> {
    const riskScores: Record<string, number> = {
      'prod-web-01': 25,
      'prod-web-02': 40,
      'prod-db-01': 85,
      'prod-cache-01': 60,
      'stage-web-01': 15
    };

    return riskScores[configurationItem] || Math.floor(Math.random() * 50) + 25;
  }

  // 🚀 FIXED: Generate ServiceNow-style mock incidents
  private generateMockIncidents(): any[] {
    const now = Date.now();
    return [
      {
        sys_id: this.generateSysId(),
        number: 'INC0010042',
        short_description: 'High CPU utilization predicted on prod-db-01',
        description: 'AI detected CPU spike - auto-remediation initiated',
        state: 'in_progress', 
        priority: '2',
        assignment_group: 'Cloud Operations',
        server_id: 'prod-db-01',
        sys_created_on: new Date(now - 300000).toISOString(), // 5 minutes ago
        sys_updated_on: new Date(now - 120000).toISOString(), // 2 minutes ago
        auto_remediated: 'true'
      },
      {
        sys_id: this.generateSysId(),
        number: 'INC0010043',
        short_description: 'Resolved CPU spike on prod-cache-01',
        description: 'AI successfully remediated CPU spike through service restart',
        state: 'resolved',
        priority: '3', 
        assignment_group: 'Cloud Operations',
        server_id: 'prod-cache-01',
        sys_created_on: new Date(now - 7200000).toISOString(), // 2 hours ago
        sys_updated_on: new Date(now - 3600000).toISOString(), // 1 hour ago
        auto_remediated: 'true'
      }
    ];
  }

  // 🚀 FIXED: Generate ServiceNow-style mock audit logs  
  private generateMockAuditLogs(): any[] {
    const now = Date.now();
    return [
      {
        sys_id: this.generateSysId(),
        timestamp: new Date(now - 300000).toISOString(),
        action: 'Anomaly Detection',
        actor: 'resai_AnomalyModel',
        server_id: 'prod-db-01',
        resource_id: 'prod-db-01',
        outcome: 'Initiated remediation',
        details: 'CPU utilization predicted to exceed 85% threshold within 5 minutes'
      },
      {
        sys_id: this.generateSysId(),
        timestamp: new Date(now - 240000).toISOString(),
        action: 'Risk Assessment',
        actor: 'resai_RiskAssessmentBot',
        server_id: 'prod-db-01',
        resource_id: 'prod-db-01',
        outcome: 'High risk detected',
        details: 'Server risk score >= 70, creating change request'
      },
      {
        sys_id: this.generateSysId(),
        timestamp: new Date(now - 180000).toISOString(),
        action: 'Auto Remediation',
        actor: 'resai_AutoRemediateBot',
        server_id: 'prod-db-01',
        resource_id: 'prod-db-01',
        outcome: 'Remediation initiated',
        details: 'Creating incident and initiating service restart flow'
      }
    ];
  }

  private generateRemediationResponse(context?: Record<string, any>): AIAgentResponse {
    return {
      agentId: 'resai_AutoRemediateBot',
      response: `✅ High CPU detected on ${context?.server_id || 'unknown server'}. Initiating automated remediation: creating incident, checking risk score, and preparing service restart.`,
      confidence: 0.92,
      actions: ['create_incident', 'check_risk_score', 'prepare_remediation'],
      timestamp: new Date().toISOString()
    };
  }

  private generateRiskAssessmentResponse(context?: Record<string, any>): AIAgentResponse {
    const riskScore = context?.risk_score || 75;
    return {
      agentId: 'resai_RiskAssessmentBot',
      response: `✅ Risk assessment complete. Server ${context?.server_id || 'unknown'} has risk score ${riskScore}. ${riskScore >= 70 ? 'Creating emergency change request due to high risk.' : 'Risk level acceptable, proceeding with standard remediation.'}`,
      confidence: 0.88,
      actions: riskScore >= 70 ? ['create_change_request', 'notify_security'] : ['proceed_standard'],
      timestamp: new Date().toISOString()
    };
  }

  private generateSysId(): string {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    );
  }

  private mockServiceNowResponse<T>(tableName: string): TableAPIResponse<T> {
    const mockData: Record<string, any[]> = {
      'x_yourcompany_resilience_ai_resai_incident': this.generateMockIncidents(),
      'x_yourcompany_resilience_ai_resai_audit_log': this.generateMockAuditLogs(),
      'cmdb_ci_server': []
    };

    const data = mockData[tableName] || [];
    
    return {
      result: data as T[],
      meta: {
        total: data.length,
        limit: 100,
        offset: 0
      }
    };
  }
}

// 🚀 MAIN SERVICE CLASS WITH PROPER DATA TRANSFORMATION
export class ResilienceAIService {
  private apiClient: ServiceNowAPIClient;

  constructor(config: ServiceNowConfig) {
    this.apiClient = new ServiceNowAPIClient(config);
  }

  async triggerAutomaticRemediation(serverId: string, cpuValue: number): Promise<void> {
    try {
      console.log(`🤖 ResilienceAI: Triggering automatic remediation for ${serverId} (${cpuValue}% CPU)`);
      
      // 1. Get risk score
      const riskScore = await this.apiClient.getRiskScore(serverId);
      
      // 2. Invoke AI agent
      const agentResponse = await this.apiClient.invokeAIAgent('resai_AutoRemediateBot', 
        `CPU utilization ${cpuValue}% detected on ${serverId}`, 
        { server_id: serverId, cpu_value: cpuValue, risk_score: riskScore }
      );

      // 3. Execute remediation flow
      const flowResponse = await this.apiClient.executeFlow('resai_RemediationFlow', {
        server_id: serverId,
        cpu_value: cpuValue,
        risk_score: riskScore
      });

      // 4. Send notifications
      await this.apiClient.sendVirtualAgentMessage('resai_PerformanceAlert',
        `🔔 [ResilienceAI] Auto-remediation initiated for ${serverId}. CPU: ${cpuValue}%`
      );

      console.log('✅ Automatic remediation triggered successfully', {
        agent: agentResponse,
        flow: flowResponse
      });

    } catch (error) {
      console.error('❌ Failed to trigger automatic remediation:', error);
      throw error;
    }
  }

  async performRiskAssessment(serverId: string): Promise<any> {
    try {
      console.log(`🛡️ ResilienceAI: Performing risk assessment for ${serverId}`);
      
      const riskScore = await this.apiClient.getRiskScore(serverId);
      
      if (riskScore >= 70) {
        // High risk - create change request
        const changeRequest = await this.apiClient.createRecord('x_yourcompany_resilience_ai_resai_change_request', {
          short_description: `Emergency resource allocation for ${serverId}`,
          type: 'emergency',
          risk: 'high',
          server_id: serverId
        });

        await this.apiClient.invokeAIAgent('resai_RiskAssessmentBot', 
          `High risk detected on ${serverId}`, 
          { server_id: serverId, risk_score: riskScore }
        );

        console.log(`✅ High risk assessment complete: ${riskScore}`, { changeRequest });
        return { riskScore, changeRequest };
      }

      console.log(`✅ Risk assessment complete: ${riskScore} (acceptable)`);
      return { riskScore };
      
    } catch (error) {
      console.error('❌ Failed to perform risk assessment:', error);
      throw error;
    }
  }

  // 🚀 FIXED: Transform ServiceNow data to component-expected format
  async getDashboardData(): Promise<any> {
    try {
      console.log('🔄 ResilienceAI: Fetching dashboard data...');
      
      const [servers, incidents, auditLogs] = await Promise.all([
        this.apiClient.getTableRecords('cmdb_ci_server'),
        this.apiClient.getTableRecords('x_yourcompany_resilience_ai_resai_incident'),
        this.apiClient.getTableRecords('x_yourcompany_resilience_ai_resai_audit_log')
      ]);

      // 🎯 TRANSFORM ServiceNow data to mockData format
      const transformedData = {
        servers: servers.result || [],
        
        // ✅ FIXED: Transform incidents to proper format
        incidents: incidents.result.map((incident: any) => ({
          id: incident.sys_id,
          serverId: incident.server_id || 'unknown',
          serverName: incident.server_id || 'Unknown Server',
          number: incident.number || 'INC-UNKNOWN',
          shortDescription: incident.short_description || 'AI Generated Incident',
          description: incident.description || 'Auto-generated by ResilienceAI',
          priority: parseInt(incident.priority) || 3,
          status: incident.state === 'in_progress' ? 'in_progress' : 
                 incident.state === 'resolved' ? 'resolved' : 'new',
          assignmentGroup: incident.assignment_group || 'Cloud Operations',
          createdAt: new Date(incident.sys_created_on || Date.now()), // ✅ Date object!
          updatedAt: new Date(incident.sys_updated_on || Date.now()), // ✅ Date object!
          autoRemediated: incident.auto_remediated === 'true',
          resolutionNotes: 'AI-powered automatic remediation'
        })),
        
        // ✅ FIXED: Transform audit logs to proper format
        auditLogs: auditLogs.result.map((log: any) => ({
          id: log.sys_id,
          timestamp: new Date(log.timestamp || Date.now()), // ✅ Date object!
          action: log.action || 'Unknown Action',
          actor: log.actor || 'System',
          serverId: log.server_id || 'unknown',
          serverName: log.server_id || 'Unknown Server',
          resourceId: log.resource_id || log.sys_id,
          riskScore: 75, // Default risk score
          outcome: log.outcome || 'Completed',
          details: log.details || 'No details available'
        })),
        
        timestamp: new Date().toISOString()
      };

      console.log('✅ ResilienceAI dashboard data transformed:', {
        incidents: transformedData.incidents.length,
        auditLogs: transformedData.auditLogs.length
      });
      
      return transformedData;
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      
      // ✅ FALLBACK: Return mockData with proper format
      console.log('📊 Falling back to enhanced mock data...');
      return {
        servers: [],
        incidents: mockIncidents, // These already have proper Date objects
        auditLogs: mockAuditLogs, // These already have proper Date objects
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default ResilienceAIService;

export const DEMO_CONFIG: ServiceNowConfig = {
  instance: 'dev12345',
  username: 'resai.admin',
  password: 'demo_password',
  apiVersion: 'v1'
};