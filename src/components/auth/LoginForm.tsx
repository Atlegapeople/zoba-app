"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Set loaded state after component mounts for animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setIsCodeSent(true);
      toast('Verification code sent!', {
        description: 'Please check your email',
        icon: '📧',
      });
    }, 1000);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false);
      toast('Welcome to ZOBA! 🎉', {
        description: 'Login successful',
      });
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto transition-all duration-700 ease-out"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      }}>
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-space-grotesk text-gunmetal dark:text-ghost-white"
          style={{
            textShadow: '0 2px 4px rgba(39, 52, 105, 0.3), 0 0 2px rgba(255, 255, 255, 0.5)',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-space-grotesk)',
          }}>
          Welcome to
        </h2>
        <div className="relative w-64 h-16 mx-auto mb-6">
          <Image 
            src="/images/logo-zoba.png" 
            alt="ZOBA" 
            fill
            className="object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(8px 12px 12px rgba(39, 52, 105, 0.5)) drop-shadow(-2px -2px 6px rgba(228, 217, 255, 0.2))',
            }}
            priority
          />
        </div>
        <p className="text-lg sm:text-xl mb-4 mx-auto"
          style={{ 
            color: '#273469',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 600,
            letterSpacing: '-0.3px',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 0 1px rgba(39, 52, 105, 0.1)'
          }}>
          {isCodeSent ? 'Enter verification code' : 'Enter your email to continue'}
        </p>
      </div>
      
      {!isCodeSent ? (
        <form onSubmit={handleSendCode} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gunmetal dark:text-periwinkle"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue/50 dark:text-periwinkle/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 text-base input-primary"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-8 rounded-lg transition-all duration-300 hover:translate-y-[-2px]"
            style={{ 
              backgroundColor: '#273469', 
              color: '#fafaff',
              boxShadow: '0 4px 14px rgba(39, 52, 105, 0.4)',
              fontFamily: 'var(--font-roboto-mono)',
              letterSpacing: '-0.5px'
            }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending code...
              </span>
            ) : (
              <span className="flex items-center">
                Send verification code
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="code" 
              className="block text-sm font-medium text-gunmetal dark:text-periwinkle"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Verification Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-delft-blue/50 dark:text-periwinkle/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 tracking-wider text-base input-primary"
                style={{ fontFamily: 'var(--font-roboto-mono)' }}
                placeholder="Enter 6-digit code"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
            <p className="text-sm text-delft-blue/70 dark:text-periwinkle/70 mt-2"
              style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Verification code sent to {email}
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-8 rounded-lg transition-all duration-300 hover:translate-y-[-2px]"
              style={{ 
                backgroundColor: '#273469', 
                color: '#fafaff',
                boxShadow: '0 4px 14px rgba(39, 52, 105, 0.4)',
                fontFamily: 'var(--font-roboto-mono)',
                letterSpacing: '-0.5px'
              }}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  Verify and continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setIsCodeSent(false)}
              className="w-full text-center text-sm text-delft-blue hover:text-space-cadet dark:text-periwinkle dark:hover:text-ghost-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Use a different email address
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
