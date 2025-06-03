
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import { mockChatMessages } from '@/data/mockData';
import { ChatMessage } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from '@/utils/uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerIcon } from 'lucide-react';

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI agent response after a short delay
    setTimeout(() => {
      let responseContent = '';
      
      // Simple response logic based on user input
      if (content.toLowerCase().includes('server') && content.toLowerCase().includes('prod-db-01')) {
        responseContent = "Server prod-db-01 is currently experiencing high CPU utilization. An incident (INC0010042) has been created and auto-remediation is in progress. The server has a risk score of 85, which triggered a change request (CHG0010055) for Security Operations review.";
      } else if (content.toLowerCase().includes('server')) {
        responseContent = "Which server would you like information about? We currently have 5 monitored servers in our environment.";
      } else if (content.toLowerCase().includes('incident')) {
        responseContent = "There are currently 2 active incidents in the system. The most recent is INC0010042 related to high CPU utilization on prod-db-01.";
      } else if (content.toLowerCase().includes('remediation') || content.toLowerCase().includes('fix')) {
        responseContent = "The ResilienceAI system provides automated remediation for performance issues. When the ML model predicts or detects high CPU utilization, it creates an incident, checks the server's risk score, and initiates appropriate remediation actions such as service restarts or resource allocation.";
      } else {
        responseContent = "I'm the ResilienceAI Virtual Agent. I can help you with information about server performance, incidents, and automated remediation actions. What would you like to know?";
      }
      
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const simulateAlert = () => {
    const alertMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'system',
      content: "🔔 [ResilienceAI] High CPU predicted on server prod-db-01. Auto-remediation in progress—please save your work.",
      timestamp: new Date(),
      isAlert: true,
      serverId: "srv-003"
    };
    
    setMessages(prev => [...prev, alertMessage]);
    
    toast({
      title: "Alert Notification",
      description: "Virtual Agent has sent a new system alert.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Virtual Agent</h1>
        <p className="text-muted-foreground">
          AI-powered assistant for system monitoring and communication
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[calc(100vh-12rem)]">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Virtual Agent Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <button 
                onClick={simulateAlert}
                className="w-full bg-servicenow-blue hover:bg-servicenow-blue/90 text-white px-4 py-2 rounded-md"
              >
                Simulate System Alert
              </button>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Sample Questions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-servicenow-blue cursor-pointer" onClick={() => handleSendMessage("What's happening with server prod-db-01?")}>
                    • What's happening with server prod-db-01?
                  </li>
                  <li className="hover:text-servicenow-blue cursor-pointer" onClick={() => handleSendMessage("How does auto-remediation work?")}>
                    • How does auto-remediation work?
                  </li>
                  <li className="hover:text-servicenow-blue cursor-pointer" onClick={() => handleSendMessage("Show me active incidents")}>
                    • Show me active incidents
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Server Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ServerIcon className="h-4 w-4 text-servicenow-blue mr-2" />
                    <span className="text-sm">prod-web-01</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-risk-low text-white">
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ServerIcon className="h-4 w-4 text-servicenow-blue mr-2" />
                    <span className="text-sm">prod-web-02</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-risk-low text-white">
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ServerIcon className="h-4 w-4 text-servicenow-blue mr-2" />
                    <span className="text-sm">prod-db-01</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-risk-high text-white animate-pulse-gentle">
                    Warning
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ServerIcon className="h-4 w-4 text-servicenow-blue mr-2" />
                    <span className="text-sm">prod-cache-01</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-risk-medium text-white">
                    Remediated
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
