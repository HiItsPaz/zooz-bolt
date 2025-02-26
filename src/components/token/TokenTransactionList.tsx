import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Select from '../ui/Select';
import Input from '../ui/Input';
import TokenDisplay from '../ui/TokenDisplay';
import { Transaction } from '../../services/mockData';
import { formatDate } from '../../utils/dateUtils';
import {  as ArrowUpRight,  as ArrowDownRight,  as Search,  as Filter } from 'lucide-react-native';

interface TokenTransactionListProps {
  transactions: Transaction[];
  onSelectTransaction?: (transaction: Transaction) => void;
  showFilters?: boolean;
  maxItems?: number;
}

const TokenTransactionList: React.FC<TokenTransactionListProps> = ({
  transactions,
  onSelectTransaction,
  showFilters = true,
  maxItems,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'earned' | 'spent'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => 
        typeFilter === 'earned' ? t.amount > 0 : t.amount < 0
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(query) ||
        t.platform?.toLowerCase().includes(query)
      );
    }
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    // Apply max items limit
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }
    
    return filtered;
  }, [transactions, typeFilter, searchQuery, sortOrder, maxItems]);
  
  const renderTransaction = ({ item: transaction }: { item: Transaction }) => {
    const isEarned = transaction.amount > 0;
    
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onSelectTransaction?.(transaction)}
      >
        <View style={styles.transactionIcon}>
          {isEarned ? (
            <ArrowUpRight 
              size={24} 
              color={theme.colors.semantic.success} 
              style={styles.icon}
            />
          ) : (
            <ArrowDownRight 
              size={24} 
              color={theme.colors.semantic.error} 
              style={styles.icon}
            />
          )}
        </View>
        
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {transaction.description || 'Token Transaction'}
          </Text>
          <Text style={styles.transactionMeta}>
            {formatDate(transaction.createdAt)}
            {transaction.platform && ` • ${transaction.platform}`}
          </Text>
        </View>
        
        <View style={styles.transactionAmount}>
          <TokenDisplay 
            amount={Math.abs(transaction.amount)} 
            size="sm"
            showPlus={isEarned}
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {showFilters && (
        <View style={styles.filters}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            leftIcon={<Search size={20} color={theme.colors.neutral[400]} />}
            containerStyle={styles.searchInput}
          />
          
          <View style={styles.filterRow}>
            <Select
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as typeof typeFilter)}
              options={[
                { value: 'all', label: 'All Transactions' },
                { value: 'earned', label: 'Earned' },
                { value: 'spent', label: 'Spent' },
              ]}
              containerStyle={styles.filterSelect}
            />
            
            <Select
              value={sortOrder}
              onChange={(value) => setSortOrder(value as typeof sortOrder)}
              options={[
                { value: 'desc', label: 'Newest First' },
                { value: 'asc', label: 'Oldest First' },
              ]}
              containerStyle={styles.filterSelect}
            />
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No transactions found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `No transactions match "${searchQuery}"`
                : typeFilter !== 'all'
                ? `No ${typeFilter} transactions to show`
                : "You don't have any transactions yet"}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    marginBottom: theme.spacing.spacing.md,
  },
  searchInput: {
    marginBottom: theme.spacing.spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.sm,
  },
  filterSelect: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.spacing.sm,
    paddingHorizontal: theme.spacing.spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.md,
  },
  icon: {
    marginRight: -2, // Visual adjustment for arrow icons
    marginTop: -2,
  },
  transactionInfo: {
    flex: 1,
    marginRight: theme.spacing.spacing.md,
  },
  transactionTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  transactionMeta: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 64, // Align with content after icon
  },
  emptyState: {
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
  },
  emptyStateTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default TokenTransactionList;