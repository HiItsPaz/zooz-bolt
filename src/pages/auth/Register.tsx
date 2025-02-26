import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link, useNavigate } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { registerParent, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const handleRegister = async () => {
    try {
      await registerParent(email, password, displayName);
      navigate('/');
    } catch (err) {
      // Error is handled by useAuth
    }
  };
  
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to start managing your family's activities"
    >
      <View style={styles.form}>
        <Input
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
          leftIcon={<User size={20} color={theme.colors.neutral[400]} />}
          required
        />
        
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
          placeholder="Create a password"
          type="password"
          leftIcon={<Lock size={20} color={theme.colors.neutral[400]} />}
          required
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          style={styles.button}
        />
        
        <View style={styles.links}>
          <Link to="/auth/login" style={styles.link}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
            </Text>
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