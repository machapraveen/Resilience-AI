
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import WelcomeAnimation from '@/components/auth/WelcomeAnimation';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  
  const [activeTab, setActiveTab] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" />;
  }

  const handleAnimationComplete = () => {
    setActiveTab('signin');
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);
    
    const { success, error } = await signIn(email, password);
    
    if (!success) {
      setError(error || 'Failed to sign in. Please check your credentials.');
    } else {
      navigate('/');
    }
    
    setProcessing(false);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setProcessing(true);
    const { success, error } = await signUp(email, password);
    
    if (!success) {
      setError(error || 'Failed to sign up. Please try again.');
    } else {
      setActiveTab('signin');
    }
    
    setProcessing(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-servicenow-blue">ResilienceAI</h1>
          <p className="text-sm text-muted-foreground mt-2">x_YourCompany_resilience_ai</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to ResilienceAI</CardTitle>
            <CardDescription>
              {activeTab === 'welcome' 
                ? 'Discover how ResilienceAI can transform your IT operations'
                : 'Sign in to your account or create a new one to continue'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid grid-cols-${activeTab === 'welcome' ? '1' : '2'} w-full mb-6 ${activeTab === 'welcome' ? 'hidden' : ''}`}>
                {activeTab !== 'welcome' && (
                  <>
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </>
                )}
              </TabsList>
              
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="welcome">
                <WelcomeAnimation onComplete={handleAnimationComplete} />
              </TabsContent>
              
              <TabsContent value="signin">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={processing}
                    >
                      {processing ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="signup">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={processing}
                    >
                      {processing ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Built with ServiceNow AI and machine learning capabilities
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
