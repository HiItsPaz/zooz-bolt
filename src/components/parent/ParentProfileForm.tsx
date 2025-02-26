import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useMockData } from '../../context/MockDataContext';
import { Parent } from '../../services/mockData';
import { Camera, Upload } from 'lucide-react-native';

const ParentProfileForm = () => {
  const { currentUser } = useMockData();
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePhotoSelect = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            setPhotoUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Update profile logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', formData);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card elevation="md" style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      
      <View style={styles.photoSection}>
        <TouchableOpacity
          style={styles.photoUpload}
          onPress={handlePhotoSelect}
        >
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photo}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={32} color={theme.colors.neutral[400]} />
            </View>
          )}
          <View style={styles.uploadOverlay}>
            <Upload size={16} color={theme.colors.neutral[0]} />
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHelperText}>
          Click to upload a profile photo
        </Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Display Name"
          value={formData.displayName}
          onChangeText={(value) => setFormData(prev => ({ ...prev, displayName: value }))}
          placeholder="Enter your name"
          required
        />
        
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="Enter your email"
          type="email"
          required
        />
        
        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="Enter your phone number"
        />
        
        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(value) => setFormData(prev => ({ ...prev, bio: value }))}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={3}
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <View style={styles.actions}>
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xl,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.xl,
  },
  photoUpload: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.neutral[100],
    marginBottom: theme.spacing.spacing.sm,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.spacing.xs,
    alignItems: 'center',
  },
  photoHelperText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  form: {
    gap: theme.spacing.spacing.md,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.spacing.xs,
  },
  actions: {
    marginTop: theme.spacing.spacing.lg,
    alignItems: 'flex-end',
  },
});

export default ParentProfileForm;