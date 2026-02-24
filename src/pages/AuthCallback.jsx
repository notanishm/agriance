import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    let isMounted = true;
    
    const handleAuthCallback = async () => {
      try {
        // Get session from URL hash (Supabase stores it there after OAuth)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session:', session, 'Error:', error);
        
        if (error) {
          console.error('Session error:', error);
          // Try to continue anyway
        }
        
        if (session && isMounted) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, onboarding_completed')
              .eq('id', session.user.id)
              .single();
            
            if (!profile) {
              setTimeout(() => navigate('/roles'), 1500);
            } else if (!profile.onboarding_completed) {
              setTimeout(() => navigate(`/${profile.role}/register`), 1500);
            } else {
              setTimeout(() => navigate(`/${profile.role}/dashboard`), 1500);
            }
          } catch (err) {
            console.log('Profile query failed, redirecting to roles');
            setTimeout(() => navigate('/roles'), 1500);
          }
        } else if (isMounted) {
          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event, 'Session:', session);
            if (event === 'SIGNED_IN' && session && isMounted) {
              subscription.unsubscribe();
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              await new Promise(resolve => setTimeout(resolve, 500));
              
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role, onboarding_completed')
                  .eq('id', session.user.id)
                  .single();
                
                if (!profile) {
                  setTimeout(() => navigate('/roles'), 1500);
                } else if (!profile.onboarding_completed) {
                  setTimeout(() => navigate(`/${profile.role}/register`), 1500);
                } else {
                  setTimeout(() => navigate(`/${profile.role}/dashboard`), 1500);
                }
              } catch (err) {
                setTimeout(() => navigate('/roles'), 1500);
              }
            }
          });
          
          // Extended timeout for OAuth
          setTimeout(() => {
            if (isMounted && status !== 'success') {
              setStatus('error');
              setMessage('Authentication failed. Please try again.');
              setTimeout(() => navigate('/login'), 2000);
            }
          }, 5000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        if (isMounted) {
          setStatus('error');
          setMessage(error.message || 'Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    };

    handleAuthCallback();
    
    return () => { isMounted = false; };
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ marginBottom: '1.5rem' }}
            >
              <Loader2 size={48} color="var(--primary)" />
            </motion.div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Please Wait</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <CheckCircle size={48} color="var(--success)" />
            </motion.div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Success!</h2>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <AlertCircle size={48} color="#ef4444" />
            </motion.div>
            <h2 style={{ marginBottom: '0.5rem', color: '#ef4444' }}>Error</h2>
          </>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{message}</p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
