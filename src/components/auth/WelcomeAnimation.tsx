import React, { useEffect, useState } from 'react';
import { Shield, Server, AlertCircle, Check, BarChart, Brain, Eye, Zap, TrendingUp, Lock } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "ResilienceAI",
      subtitle: "Enterprise IT Intelligence Platform",
      description: "Transform your IT operations with AI-powered resilience and automation",
      icon: <Brain className="h-16 w-16 text-white" />,
      features: [
        { icon: <Eye className="h-6 w-6" />, text: "Real-time\nMonitoring" },
        { icon: <Brain className="h-6 w-6" />, text: "AI\nIntelligence" },
        { icon: <Zap className="h-6 w-6" />, text: "Auto\nResolution" },
        { icon: <Shield className="h-6 w-6" />, text: "Enterprise\nSecurity" }
      ],
      gradient: "from-blue-500 via-purple-500 to-purple-600",
      animation: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Intelligent Prevention",
      subtitle: "Stop Problems Before They Start",
      description: "Advanced AI algorithms continuously analyze patterns to predict and prevent incidents",
      icon: <AlertCircle className="h-16 w-16 text-white" />,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      stats: [
        { value: "99.9%", label: "Uptime" },
        { value: "85%", label: "Prevention" },
        { value: "60%", label: "MTTR Cut" }
      ],
      animation: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Autonomous Remediation",
      subtitle: "Self-Healing Infrastructure",
      description: "Intelligent automation instantly resolves common issues without human intervention",
      icon: <Check className="h-16 w-16 text-white" />,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      automations: [
        "Auto-scaling resources",
        "Memory leak detection", 
        "Service restart protocols",
        "Performance optimization"
      ],
      animation: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Unified Server Management",
      subtitle: "Complete Infrastructure Visibility",
      description: "Monitor, manage, and optimize all your servers from a single intelligent dashboard",
      icon: <Server className="h-16 w-16 text-white" />,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      metrics: [
        { icon: <Server className="h-5 w-5" />, label: "Servers", value: "1,247" },
        { icon: <TrendingUp className="h-5 w-5" />, label: "Regions", value: "12" },
        { icon: <BarChart className="h-5 w-5" />, label: "Efficiency", value: "94%" }
      ],
      animation: {
        initial: { opacity: 0, rotate: -10 },
        animate: { opacity: 1, rotate: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Predictive Risk Analytics",
      subtitle: "Data-Driven Decision Making", 
      description: "Advanced analytics identify, assess, and prioritize risks across your infrastructure",
      icon: <BarChart className="h-16 w-16 text-white" />,
      gradient: "from-violet-500 via-purple-500 to-pink-500",
      risks: [
        { level: "Critical", count: 2, color: "bg-red-400" },
        { level: "High", count: 8, color: "bg-orange-400" },
        { level: "Medium", count: 15, color: "bg-yellow-400" },
        { level: "Low", count: 23, color: "bg-green-400" }
      ],
      animation: {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Enterprise Security",
      subtitle: "Zero-Trust Architecture",
      description: "Military-grade security protocols protect your infrastructure with continuous monitoring",
      icon: <Shield className="h-16 w-16 text-white" />,
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      security: [
        { feature: "End-to-end Encryption", status: "Active" },
        { feature: "Multi-factor Auth", status: "Enforced" },
        { feature: "Threat Detection", status: "Real-time" },
        { feature: "Compliance Monitor", status: "SOC 2" }
      ],
      animation: {
        initial: { opacity: 0, scale: 1.2 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 }
      }
    }
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  
  useEffect(() => {
    if (step === steps.length) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [step, steps.length, onComplete]);

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (step === steps.length) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 transition-opacity duration-500">
        <div className="text-center text-white">
          <div className="h-12 w-12 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white/80">Initializing ResilienceAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        key={step}
        className={`absolute inset-0 bg-gradient-to-br ${currentStep.gradient} transition-opacity duration-600`}
      />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"
          style={{
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          style={{
            animation: 'float-reverse 10s ease-in-out infinite'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full min-h-[500px] text-white">
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            key={step}
            className="text-center max-w-4xl transition-all duration-800 ease-out"
            style={{
              opacity: 1,
              transform: 'translateY(0px)'
            }}
          >
            {/* Icon */}
            <div className="mx-auto mb-6 relative">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl animate-pulse">
                {currentStep.icon}
              </div>
            </div>

            {/* Title and subtitle */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {currentStep.title}
              </h1>
              {currentStep.subtitle && (
                <h2 className="text-lg md:text-xl font-light text-white/90 mb-3">
                  {currentStep.subtitle}
                </h2>
              )}
              <p className="text-white/80 leading-relaxed max-w-2xl mx-auto">
                {currentStep.description}
              </p>
            </div>

            {/* Dynamic content based on step */}
            <div className="mt-8">
              {/* Welcome step features */}
              {currentStep.features && (
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {currentStep.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="text-white mb-2 flex justify-center">
                        {feature.icon}
                      </div>
                      <p className="text-xs font-medium text-white/90 leading-tight whitespace-pre-line text-center">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats for prevention */}
              {currentStep.stats && (
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {currentStep.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Automations list */}
              {currentStep.automations && (
                <div className="max-w-md mx-auto space-y-3">
                  {currentStep.automations.map((automation, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                    >
                      <Check className="h-5 w-5 text-white" />
                      <span className="text-white/90">{automation}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics for monitoring */}
              {currentStep.metrics && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {currentStep.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center"
                    >
                      <div className="text-white mb-2 flex justify-center">
                        {metric.icon}
                      </div>
                      <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
                      <div className="text-white/70 text-xs">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Risk levels */}
              {currentStep.risks && (
                <div className="max-w-sm mx-auto space-y-3">
                  {currentStep.risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                        <span className="text-white/90">{risk.level}</span>
                      </div>
                      <span className="font-bold text-white">{risk.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Security features */}
              {currentStep.security && (
                <div className="max-w-md mx-auto space-y-3">
                  {currentStep.security.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                    >
                      <span className="text-white/90">{item.feature}</span>
                      <span className="text-sm font-medium text-white">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress and Controls - FIXED LAYOUT */}
        <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            {/* Progress info - Better spacing and layout */}
            <div className="flex justify-center items-center mb-3">
              <div className="text-center">
                <div className="text-white/70 text-sm font-medium mb-1">
                  Step {step + 1} of {steps.length}
                </div>
                <div className="text-white/60 text-xs">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === step 
                      ? 'w-8 bg-white shadow-lg' 
                      : i < step 
                        ? 'w-6 bg-white/70' 
                        : 'w-4 bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center">
              <button 
                onClick={handleSkip}
                className="text-white/80 hover:text-white hover:bg-white/10 border border-white/30 rounded-full px-6 py-2 text-sm transition-all duration-200"
              >
                Skip Tour
              </button>
              
              <button 
                onClick={handleNext}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-full px-8 py-2 text-sm shadow-lg backdrop-blur-sm transition-all duration-300"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(-20px) translateX(-10px) rotate(0deg); }
          50% { transform: translateY(20px) translateX(10px) rotate(5deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(30px) translateX(20px); }
          50% { transform: translateY(-30px) translateX(-20px); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeAnimation;