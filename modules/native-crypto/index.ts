// Reexport the native module. On web, it will be resolved to NativeCryptoModule.web.ts
// and on native platforms to NativeCryptoModule.ts
export { default } from './src/NativeCryptoModule';
export * from  './src/NativeCrypto.types';
