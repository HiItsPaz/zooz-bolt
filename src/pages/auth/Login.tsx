import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link, useNavigate } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by useAuth
    }
  };
  
  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to manage your family's activities and rewards"
    >
      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          type="email"
          leftIcon={<Mail size={20} color={theme.colors.neutral[400]} />}
          required
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          type="password"
          leftIcon={<Lock size={20} color={theme.colors.neutral[400]} />}
          required
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />
        
        <View style={styles.links}>
          <Link to="/auth/register" style={styles.link}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text>
            </Text>
          </Link>
          
          <Link to="/auth/forgot-password" style={styles.link}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </Link>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.spacing.md,
  },
  button: {
    marginTop: theme.spacing.spacing.sm,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    textAlign: 'center',
  },
  links: {
    marginTop: theme.spacing.spacing.lg,
    gap: theme.spacing.spacing.md,
    alignItems: 'center',
  },
  link: {
    padding: theme.spacing.spacing.xs,
    textDecoration: 'none',
  },
  linkText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  linkHighlight: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.medium,
  },
});