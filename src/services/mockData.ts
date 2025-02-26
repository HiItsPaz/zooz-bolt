Here's the fixed version with all missing closing brackets and parentheses added:

```typescript
200);
      const transaction = mockData.transactions.find(t => t.id === id);
      if (!transaction) throw new Error(`Transaction with ID ${id} not found`);
      return { ...transaction };
    },
    
    // Get transactions for child
    getForChild: async (childId: string) => {
      await delay(300);
      return mockData.transactions
        .filter(t => t.childId === childId)
        .map(t => ({ ...t }));
    },
    
    // Create transaction
    create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      await delay(500);
      const newTransaction = {
        ...transaction,
        id: `transaction${mockData.transactions.length + 1}`,
        createdAt: new Date(),
      };
      mockData.transactions.push(newTransaction);
      
      // Update child's token balance
      if (transaction.childId) {
        const childIndex = mockData.users.findIndex(u => u.id === transaction.childId);
        if (childIndex !== -1 && mockData.users[childIndex].role === 'child') {
          const child = mockData.users[childIndex] as Child;
          mockData.users[childIndex] = {
            ...child,
            tokenBalance: child.tokenBalance + transaction.amount,
          };
        }
      }
      
      return { ...newTransaction };
    },
    
    // Delete transaction
    delete: async (id: string) => {
      await delay(400);
      const index = mockData.transactions.findIndex(t => t.id === id);
      if (index === -1) throw new Error(`Transaction with ID ${id} not found`);
      
      mockData.transactions.splice(index, 1);
      return true;
    },
  },
  
  // Notifications collection
  notifications: {
    // Get all notifications
    getAll: async () => {
      await delay(300);
      return [...mockData.notifications];
    },
    
    // Get notification by ID
    getById: async (id: string) => {
      await delay(200);
      const notification = mockData.notifications.find(n => n.id === id);
      if (!notification) throw new Error(`Notification with ID ${id} not found`);
      return { ...notification };
    },
    
    // Get notifications for user
    getForUser: async (userId: string) => {
      await delay(300);
      return mockData.notifications
        .filter(n => n.userId === userId)
        .map(n => ({ ...n }));
    },
    
    // Get unread notifications for user
    getUnreadForUser: async (userId: string) => {
      await delay(300);
      return mockData.notifications
        .filter(n => n.userId === userId && !n.read)
        .map(n => ({ ...n }));
    },
    
    // Create notification
    create: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      await delay(500);
      const newNotification = {
        ...notification,
        id: `notification${mockData.notifications.length + 1}`,
        createdAt: new Date(),
      };
      mockData.notifications.push(newNotification);
      return { ...newNotification };
    },
    
    // Mark notification as read
    markAsRead: async (id: string) => {
      await delay(300);
      const index = mockData.notifications.findIndex(n => n.id === id);
      if (index === -1) throw new Error(`Notification with ID ${id} not found`);
      
      mockData.notifications[index] = {
        ...mockData.notifications[index],
        read: true,
      };
      
      return { ...mockData.notifications[index] };
    },
    
    // Delete notification
    delete: async (id: string) => {
      await delay(400);
      const index = mockData.notifications.findIndex(n => n.id === id);
      if (index === -1) throw new Error(`Notification with ID ${id} not found`);
      
      mockData.notifications.splice(index, 1);
      return true;
    },
  },
};
```