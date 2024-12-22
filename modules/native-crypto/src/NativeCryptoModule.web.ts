import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './NativeCrypto.types';

type NativeCryptoModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class NativeCryptoModule extends NativeModule<NativeCryptoModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(NativeCryptoModule);
