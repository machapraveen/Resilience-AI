
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, AlertCircle, Check, BarChart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to ResilienceAI",
      description: "Your AI-powered platform for IT operations resilience",
      icon: <Brain className="h-12 w-12 text-servicenow-blue" />,
      animation: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Incident Prevention",
      description: "Detect anomalies before they become incidents",
      icon: <AlertCircle className="h-12 w-12 text-risk-high" />,
      animation: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Automatic Remediation",
      description: "Resolve common issues automatically without human intervention",
      icon: <Check className="h-12 w-12 text-risk-low" />,
      animation: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Server Management",
      description: "Monitor and manage all your servers from a single dashboard",
      icon: <Server className="h-12 w-12 text-servicenow-blue" />,
      animation: {
        initial: { opacity: 0, rotate: -10 },
        animate: { opacity: 1, rotate: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Risk Analytics",
      description: "Identify and prioritize risks across your infrastructure",
      icon: <BarChart className="h-12 w-12 text-amber-500" />,
      animation: {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      }
    },
    {
      title: "Security Focused",
      description: "Protect your infrastructure with advanced security measures",
      icon: <Shield className="h-12 w-12 text-green-600" />,
      animation: {
        initial: { opacity: 0, scale: 1.2 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 }
      }
    }
  ];

  const currentStep = steps[step];
  
  useEffect(() => {
    if (step === steps.length) {
      // Animation complete
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
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[400px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-servicenow-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Getting everything ready...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-[400px] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          key={step}
          initial={currentStep.animation.initial}
          animate={currentStep.animation.animate}
          transition={currentStep.animation.transition}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            {currentStep.icon}
          </div>
          <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {currentStep.description}
          </p>
        </motion.div>
      </div>
      
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <motion.div 
              key={i}
              className={`h-2 w-8 rounded-full ${i === step ? 'bg-servicenow-blue' : 'bg-gray-200'}`}
              animate={{ 
                backgroundColor: i === step ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)'
              }}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkip}>Skip</Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
