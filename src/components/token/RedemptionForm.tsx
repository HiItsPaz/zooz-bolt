import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import TokenDisplay from '../ui/TokenDisplay';
import Card from '../ui/Card';
import {  as Gamepad2,  as Coins,  as AlertCircle } from 'lucide-react-native';

interface RedemptionFormProps {
  availableTokens: number;
  onSubmit: (data: RedemptionData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface RedemptionData {
  platform: string;
  amount: number;
  accountId: string;
  notes?: string;
}

const GAMING_PLATFORMS = [
  { value: 'roblox', label: 'Roblox', conversionRate: 10 }, // 1 token = 10 Robux
  { value: 'minecraft', label: 'Minecraft', conversionRate: 5 }, // 1 token = 5 Minecoins
  { value: 'fortnite', label: 'Fortnite', conversionRate: 8 }, // 1 token = 8 V-Bucks
];

const RedemptionForm: React.FC<RedemptionFormProps> = ({
  availableTokens,
  onSubmit,
  onCancel,
  loading = false,
  error,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RedemptionData>({
    platform: '',
    amount: 0,
    accountId: '',
    notes: '',
  });
  
  const selectedPlatform = GAMING_PLATFORMS.find(p => p.value === formData.platform);
  const gameAmount = formData.amount * (selectedPlatform?.conversionRate || 0);
  const isValidAmount = formData.amount > 0 && formData.amount <= availableTokens;
  
  const handleSubmit = () => {
    if (step === 1 && isValidAmount && formData.platform) {
      setStep(2);
      return;
    }
    
    if (step === 2 && formData.accountId) {
      onSubmit(formData);
    }
  };
  
  return (
    <Card elevation="md" style={styles.container}>
      <ScrollView>
        {step === 1 ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Redeem Tokens</Text>
              <Text style={styles.subtitle}>
                Convert your tokens into gaming currency
              </Text>
            </View>
            
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TokenDisplay amount={availableTokens} size="lg" />
            </View>
            
            <View style={styles.formSection}>
              <Select
                label="Gaming Platform"
                value={formData.platform}
                onChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                options={GAMING_PLATFORMS.map(p => ({
                  value: p.value,
                  label: p.label,
                }))}
                placeholder="Select a gaming platform"
                required
                leftIcon={<Gamepad2 size={20} color={theme.colors.neutral[400]} />}
              />
              
              {formData.platform && (
                <View style={styles.amountSection}>
                  <Input
                    label="Amount to Redeem"
                    value={formData.amount.toString()}
                    onChangeText={(value) => {
                      const amount = parseInt(value) || 0;
                      setFormData(prev => ({ ...prev, amount }));
                    }}
                    type="number"
                    placeholder="Enter amount of tokens"
                    required
                    leftIcon={<Coins size={20} color={theme.colors.neutral[400]} />}
                  />
                  
                  {formData.amount > 0 && (
                    <View style={styles.conversionPreview}>
                      <Text style={styles.conversionText}>
                        {formData.amount} tokens = {gameAmount} {selectedPlatform?.label} currency
                      </Text>
                    </View>
                  )}
                  
                  {formData.amount > availableTokens && (
                    <View style={styles.errorMessage}>
                      <AlertCircle size={16} color={theme.colors.semantic.error} />
                      <Text style={styles.errorText}>
                        Amount exceeds available balance
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Account Details</Text>
              <Text style={styles.subtitle}>
                Enter your gaming account information
              </Text>
            </View>
            
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform</Text>
                <Text style={styles.summaryValue}>{selectedPlatform?.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <View style={styles.summaryAmount}>
                  <TokenDisplay amount={formData.amount} size="sm" />
                  <Text style={styles.summaryEquals}>=</Text>
                  <Text style={styles.gameAmount}>{gameAmount}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Input
                label="Gaming Account ID"
                value={formData.accountId}
                onChangeText={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                placeholder={`Enter your ${selectedPlatform?.label} username/ID`}
                required
              />
              
              <Input
                label="Notes (Optional)"
                value={formData.notes || ''}
                onChangeText={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                placeholder="Add any additional notes"
                multiline
                numberOfLines={3}
              />
            </View>
          </>
        )}
        
        {error && (
          <View style={styles.errorMessage}>
            <AlertCircle size={16} color={theme.colors.semantic.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            disabled={loading}
            style={styles.cancelButton}
          />
          {step === 2 && (
            <Button
              title="Back"
              variant="outline"
              onPress={() => setStep(1)}
              disabled={loading}
              style={styles.cancelButton}
            />
          )}
          <Button
            title={step === 1 ? 'Continue' : 'Submit'}
            onPress={handleSubmit}
            disabled={
              loading ||
              (step === 1 && (!formData.platform || !isValidAmount)) ||
              (step === 2 && !formData.accountId)
            }
            loading={loading}
          />
        </View>
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.lg,
  },
  balanceLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  formSection: {
    gap: theme.spacing.spacing.md,
    marginBottom: theme.spacing.spacing.lg,
  },
  amountSection: {
    gap: theme.spacing.spacing.sm,
  },
  conversionPreview: {
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
  },
  conversionText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.primary[700],
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.lg,
    gap: theme.spacing.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  summaryAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.xs,
  },
  summaryEquals: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  gameAmount: {
    ...theme.typography.textStyle.body,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.bold,
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.semantic.error + '10',
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.md,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginLeft: theme.spacing.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.spacing.sm,
  },
  cancelButton: {
    marginRight: theme.spacing.spacing.xs,
  },
});

export default RedemptionForm;