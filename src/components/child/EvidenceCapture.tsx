import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import { Activity } from '../../services/mockData';
import { Camera, X } from 'lucide-react-native';

interface EvidenceCaptureProps {
  activity: Activity;
  onSubmit: (data: { notes: string; photo?: File | null }) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

const EvidenceCapture: React.FC<EvidenceCaptureProps> = ({
  activity,
  onSubmit,
  onCancel,
  loading = false,
  error,
}) => {
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Handle photo selection
  const handleSelectPhoto = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          setPhoto(file);
          
          const reader = new FileReader();
          reader.onload = () => {
            setPhotoPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } else {
      // For mobile, we'd use expo-image-picker
      // This is just a mock implementation
      setPhotoPreview('https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=300&h=200&fit=crop');
      setPhoto({} as File);
    }
  };
  
  // Remove photo
  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };
  
  // Submit evidence
  const handleSubmit = () => {
    if (activity.requiresEvidence && !photo) {
      // Show error
      return;
    }
    
    onSubmit({
      notes,
      photo,
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Quest</Text>
      <Text style={styles.subtitle}>{activity.title}</Text>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>How did you complete this quest?</Text>
        <TextArea
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe how you completed the quest..."
          minHeight={100}
          maxHeight={200}
          disabled={loading}
        />
      </View>
      
      {activity.requiresEvidence && (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            Photo Evidence <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>
            Please provide a photo showing that you completed this quest
          </Text>
          
          {!photoPreview ? (
            <TouchableOpacity 
              style={styles.photoUpload}
              onPress={handleSelectPhoto}
              disabled={loading}
            >
              <View style={styles.photoPlaceholder}>
                <Camera size={40} color={theme.colors.neutral[400]} />
                <Text style={styles.uploadText}>
                  Tap to select a photo
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.photoPreviewContainer}>
              <Image 
                source={{ uri: photoPreview }} 
                style={styles.photoPreview}
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={handleRemovePhoto}
                disabled={loading}
              >
                <X size={16} color={theme.colors.neutral[0]} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.actionButtons}>
        <Button 
          title="Cancel" 
          variant="outline" 
          onPress={onCancel} 
          disabled={loading}
          style={styles.cancelButton}
        />
        <Button 
          title="Submit" 
          onPress={handleSubmit}
          disabled={loading || !notes.trim() || (activity.requiresEvidence && !photo)}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xl,
  },
  formSection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  required: {
    color: theme.colors.semantic.error,
  },
  helperText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.sm,
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.spacing.borderRadius.md,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[50],
  },
  uploadText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.spacing.sm,
  },
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: theme.spacing.borderRadius.md,
    overflow: 'hidden',
    ...theme.spacing.shadow.sm,
  },
  photoPreview: {
    width: '100%',
    height: 200,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.spacing.md,
  },
  cancelButton: {
    marginRight: theme.spacing.spacing.sm,
  },
});

export default EvidenceCapture;