import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  result: string;
};

export type NativeCryptoModuleEvents = {
  onResult: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type NativeCryptoViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
