import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { APP_NAME } from '../../constants';

interface FooterLink {
  id: string;
  label: string;
  onPress: () => void;
}

interface FooterProps {
  links?: FooterLink[];
  showChildFooter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  links = [],
  showChildFooter = false,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <View style={[styles.footer, showChildFooter && styles.childFooter]}>
      <View style={styles.container}>
        {showChildFooter ? (
          <View style={styles.childFooterContent}>
            <Text style={styles.childFooterText}>
              Keep completing quests to earn more tokens! 🎮
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.footerSection}>
              <Text style={styles.copyright}>
                © {currentYear} {APP_NAME}. All rights reserved.
              </Text>
            </View>

            {links.length > 0 && (
              <View style={styles.linksContainer}>
                {links.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <TouchableOpacity onPress={link.onPress}>
                      <Text style={styles.link}>{link.label}</Text>
                    </TouchableOpacity>
                    {index < links.length - 1 && (
                      <Text style={styles.divider}>•</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: theme.colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.spacing.md,
  },
  childFooter: {
    backgroundColor: theme.colors.primary[600],
    borderTopWidth: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: theme.spacing.spacing.md,
  },
  footerSection: {
    marginVertical: theme.spacing.spacing.xs,
  },
  copyright: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.primary[500],
    marginHorizontal: theme.spacing.spacing.xs,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  divider: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.spacing.xs,
  },
  childFooterContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childFooterText: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[0],
  },
});

export default Footer;