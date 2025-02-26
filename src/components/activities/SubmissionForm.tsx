import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Card from '../ui/Card';
import { Camera, X } from 'lucide-react-native';

interface SubmissionFormProps {
  activityId: string;
  activityTitle: string;
  requiresEvidence: boolean;
  onSubmit: (data: { notes: string; photo?: File | null }) => void;
  onCancel: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  activityId,
  activityTitle,
  requiresEvidence,
  onSubmit,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSelectPhoto = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          setPhotoFile(file);
          
          const reader = new FileReader();
          reader.onload = () => {
            setPhotoPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } else {
      // For mobile, we'd use expo-image-picker in a real app
      // This is just a mock implementation
      setPhotoPreview('https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=300&h=200&fit=crop');
      setPhotoFile({} as File);
    }
  };
  
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };
  
  const handleSubmit = () => {
    setError(null);
    
    if (requiresEvidence && !photoFile) {
      setError('Please provide photo evidence for this activity');
      return;
    }
    
    if (!notes.trim()) {
      setError('Please describe how you completed this activity');
      return;
    }
    
    onSubmit({
      notes,
      photo: photoFile,
    });
  };
  
  return (
    <Card elevation="md" padding="lg">
      <Text style={styles.title}>Complete Activity</Text>
      <Text style={styles.activityTitle}>{activityTitle}</Text>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>How did you complete this activity?</Text>
        <TextArea
          label="Activity Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe how you completed this activity..."
          minHeight={100}
          maxHeight={200}
          required
          error={!notes.trim() ? 'Please describe how you completed this activity' : undefined}
        />
      </View>
      
      {requiresEvidence && (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            Photo Evidence <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.helperText}>
            Please provide a photo showing that you completed this activity
          </Text>
          
          {!photoPreview ? (
            <TouchableOpacity 
              style={styles.photoUpload}
              onPress={handleSelectPhoto}
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
          style={styles.cancelButton}
        />
        <Button 
          title="Submit" 
          onPress={handleSubmit} 
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  activityTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
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
    backgroundColor: theme.colors.neutral[50],
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
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

export default SubmissionForm;