import { NativeModule, requireNativeModule } from 'expo';

import { NativeCryptoModuleEvents } from './NativeCrypto.types';

declare class NativeCryptoModule extends NativeModule<NativeCryptoModuleEvents> {
  PI: number;
  createMphAndPsk(password: string, email: string): void;
  createMph(password: string, email: string): void;
  getEncryptionKey(): string;
  setEncryptionKey(psk: string, keys: string): string;
  removeEncryptionKey(): boolean;
  encryptWithChaCha20(data: string, key: string): string;
  decryptWithChaCha20(data: string, key: string): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<NativeCryptoModule>('NativeCrypto');
