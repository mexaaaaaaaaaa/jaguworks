import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Lock, User, Chrome, Shield, Zap, CheckCircle2 } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(50, "Full name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  const oauthHandledRef = useRef(false);

  useEffect(() => {
    // Run once: handle OAuth callback params / recovery mode safely with HashRouter
    if (oauthHandledRef.current) return;
    oauthHandledRef.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const rawHash = window.location.hash?.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;

    const hashQueryParams = (() => {
      if (!rawHash) return new URLSearchParams();

      // HashRouter format: "/auth?x=y" -> parse only the query part after "?"
      if (rawHash.includes("?")) {
        return new URLSearchParams(rawHash.split("?").slice(1).join("?"));
      }

      // Non-router hash format: "error=...&error_description=..."
      if (!rawHash.startsWith("/")) {
        return new URLSearchParams(rawHash);
      }

      return new URLSearchParams();
    })();

    const getParam = (key: string) => hashQueryParams.get(key) ?? searchParams.get(key);

    const type = getParam("type");
    if (type === "recovery") {
      setIsRecoveryMode(true);
      return;
    }

    const error = getParam("error");
    const errorDescription = getParam("error_description");
    if (error || errorDescription) {
      const msg = decodeURIComponent(
        (errorDescription || error || "Authentication failed").replace(/\+/g, " ")
      );

      toast({
        title: "Login failed",
        description: msg,
        variant: "destructive",
      });

      // Clean URL to keep HashRouter stable
      window.history.replaceState(null, "", `${window.location.pathname}#/auth`);
      return;
    }

    const code = getParam("code");
    if (code) {
      setLoading(true);
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        })
        .finally(() => {
          setLoading(false);
          window.history.replaceState(null, "", `${window.location.pathname}#/auth`);
        });
    }
  }, [toast]);

  useEffect(() => {
    if (user && !isRecoveryMode) {
      navigate("/");
    }
  }, [user, isRecoveryMode, navigate]);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        let errorMessage = "An error occurred during login.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email or password is incorrect. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email before logging in.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login successful! 🎉",
        description: "Welcome back!",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/auth`,
          data: {
            username: values.username,
            full_name: values.fullName,
          },
        },
      });

      if (signUpError) {
        let errorMessage = signUpError.message;
        
        if (signUpError.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Please login instead.";
        } else if (signUpError.message.includes("Password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        }
        
        toast({
          title: "Signup failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // If auto-confirm is enabled, user gets a session immediately
      if (data?.session) {
        toast({
          title: "Account created & logged in! 🎉",
          description: "Welcome to JaguWorks!",
        });
        setTimeout(() => navigate("/"), 1000);
      } else {
        // Email confirmation required
        toast({
          title: "Account created! 📧",
          description: "Please check your email to verify your account before logging in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/#/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("provider is not enabled") || error.message.includes("not configured")) {
          errorMessage = "Google login is not configured yet. Please use email & password for now.";
        } else if (error.message.includes("invalid_client")) {
          errorMessage = "Google OAuth configuration error. Please contact support.";
        }
        
        toast({
          title: "Google login unavailable",
          description: errorMessage,
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    toast({
      title: "Discord login unavailable",
      description: "Discord login isn't available right now. Please use Email/Password (or Google if enabled).",
      variant: "destructive",
    });
  };

  const handleForgotPassword = async () => {
    const email = loginForm.getValues("email");
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email in the login form first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/auth`,
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: "Could not start password reset. Please check your email and try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Reset link sent! ✉️",
        description: "Check your email inbox for a password reset link.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password updated successfully! ✅",
        description: "You can now login with your new password.",
      });

      setTimeout(() => {
        setIsRecoveryMode(false);
        navigate("/auth");
        window.location.hash = '';
      }, 1500);
    } finally {
      setLoading(false);
    }
  };


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show password reset form if in recovery mode
  if (isRecoveryMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10 p-4">
        <Card className="w-full max-w-md glass-card border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reset Your Password
            </CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Brand messaging */}
        <div className="hidden lg:block space-y-6 px-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Welcome to JaguWorks
            </h1>
            <p className="text-xl text-muted-foreground">
              Your gateway to premium development services, project management, and exclusive content.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 glass-card p-4 rounded-lg border border-primary/20">
              <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Your data is encrypted and protected</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 glass-card p-4 rounded-lg border border-accent/20">
              <Zap className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Fast Access</h3>
                <p className="text-sm text-muted-foreground">Instant access to all your projects and orders</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 glass-card p-4 rounded-lg border border-secondary/20">
              <CheckCircle2 className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Powered by JaguWorks</h3>
                <p className="text-sm text-muted-foreground">Professional backend infrastructure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <Card className="w-full glass-card border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JaguWorks
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Button
                variant="outline"
                className="w-full hover:bg-accent/10 hover:border-accent/50 transition-all"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full hover:bg-accent/10 hover:border-accent/50 transition-all"
                onClick={handleDiscordLogin}
                disabled={loading}
              >
                <SiDiscord className="mr-2 h-4 w-4" />
                Continue with Discord
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="your@email.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      variant="hero"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="mt-2 w-full text-xs text-primary hover:underline disabled:opacity-50"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="johndoe"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="John Doe"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="your@email.com"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      variant="hero"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      By creating an account, you agree to our basic terms of use.
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
