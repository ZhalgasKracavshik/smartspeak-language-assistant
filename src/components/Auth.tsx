import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../lib/supabase';
import { getUserProfileService } from '../services/userProfileService';
import { logSecurityEvent } from '../services/securityLogger';
import { logGuestAccessAction } from '../app/actions/security';
import { rateLimiter } from '../services/rateLimiter';

interface AuthProps {
    onLogin: () => void;
}

export function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordValidation = useMemo(() => {
        const hasMinLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const strength = [hasMinLength, hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length;

        return {
            hasMinLength,
            hasLetter,
            hasNumber,
            hasSpecialChar,
            isStrong: strength >= 3,
            strength: strength === 4 ? 'strong' : strength === 3 ? 'medium' : strength === 2 ? 'weak' : 'very-weak'
        };
    }, [password]);

    const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
    const isValidPassword = password.length >= 8 && passwordValidation.hasLetter && passwordValidation.hasNumber;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate Limit Check
        const rateCheck = rateLimiter.check('signup');
        if (!rateCheck.allowed) {
            setError(`Too many signup attempts. Please try again in ${rateCheck.waitTime} seconds.`);
            return;
        }

        if (!isValidEmail || !isValidPassword || !fullName.trim()) {
            setError('Please fill all fields correctly');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } }
            });

            if (error) throw error;

            if (data.user) {
                // Clear guest flag when creating real account
                localStorage.removeItem('smartspeak-is-guest');

                await logSecurityEvent({
                    ip_address: 'client',
                    user_id: data.user.id,
                    action: 'signup',
                    is_guest: false,
                    metadata: { email }
                });

                await getUserProfileService().saveProfile({
                    name: fullName,
                    level: 'A1',
                    levelNumber: 1,
                    xp: 0,
                    streak: 0,
                    interests: [],
                    hasCompletedOnboarding: false,
                    createdAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString(),
                    lastLoginDate: new Date().toISOString()
                });

                onLogin();
            } else {
                // Check if email confirmation is required
                alert('Registration successful! Please check your email to verify your account.');
            }
        } catch (error: any) {
            rateLimiter.increment('signup'); // Count failed attempts
            await logSecurityEvent({
                ip_address: 'client',
                action: 'failed_login',
                is_guest: false,
                metadata: { email, error: error.message }
            });
            setError(error.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate Limit Check
        const rateCheck = rateLimiter.check('login');
        if (!rateCheck.allowed) {
            setError(`Too many login attempts. Please try again in ${rateCheck.waitTime} seconds.`);
            return;
        }

        if (!isValidEmail) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                // Clear guest flag when logging in with real account
                localStorage.removeItem('smartspeak-is-guest');

                await logSecurityEvent({
                    ip_address: 'client',
                    user_id: data.user.id,
                    action: 'login',
                    is_guest: false,
                    metadata: { email }
                });
                onLogin();
            }
        } catch (error: any) {
            rateLimiter.increment('login'); // Count failed attempts
            await logSecurityEvent({
                ip_address: 'client',
                action: 'failed_login',
                is_guest: false,
                metadata: { email, error: error.message }
            });
            setError(error.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
            });
            if (error) throw error;
            setSuccessMessage('Password reset link sent! Check your email.');
        } catch (error: any) {
            setError(error.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsLoading(true);
        try {
            // Log guest access server-side to capture IP
            await logGuestAccessAction();

            localStorage.setItem('smartspeak-is-guest', 'true');
            onLogin();
        } catch (e) {
            console.error('Guest login error:', e);
            // Allow guest login even if logging fails
            localStorage.setItem('smartspeak-is-guest', 'true');
            onLogin();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuth = isForgotPassword ? handleResetPassword : (isLogin ? handleLogin : handleSignup);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                            {isForgotPassword
                                ? 'Enter your email to receive a reset link'
                                : (isLogin ? 'Enter your credentials to access your account' : 'Start your language learning journey today')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 text-sm text-green-500 bg-green-50 rounded-lg flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                {successMessage}
                            </div>
                        )}

                        {!isLogin && !isForgotPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="dark:text-gray-200">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input id="fullName" placeholder="John Doe" className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={fullName} onChange={(e) => setFullName(e.target.value)} required={!isLogin} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input id="email" type="email" placeholder="hello@example.com" className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        {!isForgotPassword && (
                            <div className="space-y-2">
                                <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {!isLogin && password && (
                                    <div className="space-y-2 mt-2">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i === 0 ? (passwordValidation.strength === 'very-weak' ? 'bg-red-500' : passwordValidation.strength === 'weak' ? 'bg-orange-500' : passwordValidation.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500') :
                                                    i === 1 ? (passwordValidation.strength === 'weak' ? 'bg-orange-500' : passwordValidation.strength === 'medium' ? 'bg-yellow-500' : passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200') :
                                                        i === 2 ? (passwordValidation.strength === 'medium' ? 'bg-yellow-500' : passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200') :
                                                            (passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200')
                                                    }`} />
                                            ))}
                                        </div>
                                        <div className="text-xs space-y-1">
                                            {[
                                                { check: passwordValidation.hasMinLength, text: 'At least 8 characters' },
                                                { check: passwordValidation.hasLetter, text: 'Contains letters' },
                                                { check: passwordValidation.hasNumber, text: 'Contains numbers' },
                                                { check: passwordValidation.hasSpecialChar, text: 'Contains special characters (optional)' }
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center gap-1 ${item.check ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {item.check ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {item.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02]" onClick={handleAuth} disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <>{isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')}<ArrowRight className="w-4 h-4 ml-2" /></>}
                        </Button>

                        {!isForgotPassword && (
                            <>
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t dark:border-gray-600" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">Or</span></div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                                    onClick={handleGuestLogin}
                                    disabled={isLoading}
                                >
                                    Continue as Guest
                                </Button>
                            </>
                        )}

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
                            {!isForgotPassword && isLogin && (
                                <button
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:underline block w-full mb-2"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    Forgot your password?
                                </button>
                            )}

                            {isForgotPassword ? (
                                <button
                                    className="text-indigo-600 hover:underline font-medium dark:text-indigo-400"
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        setIsLogin(true);
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    Back to Sign In
                                </button>
                            ) : (
                                <p>
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button className="text-indigo-600 hover:underline font-medium dark:text-indigo-400" onClick={() => setIsLogin(!isLogin)}>
                                        {isLogin ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
