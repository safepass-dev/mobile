import { NativeModule, requireNativeModule } from 'expo';

import { NativeCryptoModuleEvents } from './NativeCrypto.types';

declare class NativeCryptoModule extends NativeModule<NativeCryptoModuleEvents> {
  PI: number;
  createMphAndPsk(): void;
  createMph(): void;
  getEncryptionKey(): string;
  setEncryptionKey(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<NativeCryptoModule>('NativeCrypto');
