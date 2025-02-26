import 'react-native';

declare module 'react-native' {
  interface ViewStyle {
    cursor?: string;
    userSelect?: string;
    transitionProperty?: string;
    transitionDuration?: string;
    outline?: string;
    outlineOffset?: string;
  }

  interface TextStyle {
    cursor?: string;
    userSelect?: string;
  }
}