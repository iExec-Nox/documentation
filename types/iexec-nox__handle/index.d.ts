/**
 * TODO: Remove this file and the types/ directory once @iexec-nox/handle is
 * published on npm. Install it as a dependency instead and remove the custom
 * typeRoots config in .vitepress/config.ts.
 *
 * Type declaration shim for @iexec-nox/handle.
 *
 * This file lets VitePress twoslash code blocks resolve the SDK types
 * without the package being published on npm.
 *
 * Keep in sync with the SDK's public API (src/index.ts + src/types/publicTypes.ts).
 */

declare module '@iexec-nox/handle' {
  // ============ Config ============

  export interface HandleClientConfig {
    gatewayUrl: `http://${string}` | `https://${string}`;
    smartContractAddress: `0x${string}`;
  }

  // ============ Types ============

  export type SolidityType =
    | 'bool'
    | 'address'
    | 'bytes'
    | 'string'
    | `uint${number}`
    | `int${number}`
    | `bytes${number}`;

  export type JsValue<T extends SolidityType> = T extends 'bool'
    ? boolean
    : T extends 'string'
      ? string
      : T extends 'address' | 'bytes' | `bytes${number}`
        ? string
        : T extends `uint${number}` | `int${number}`
          ? bigint
          : never;

  export type Handle<T extends SolidityType = SolidityType> = `0x${string}` & {
    __solidityType?: T;
  };

  // ============ Return types ============

  export type EncryptInputResult<T extends SolidityType> = {
    handle: Handle<T>;
    handleProof: `0x${string}`;
  };

  export type DecryptResult<T extends SolidityType> = {
    value: JsValue<T>;
    solidityType: T;
  };

  // ============ Client ============

  export class HandleClient {
    encryptInput<T extends SolidityType>(
      value: JsValue<T>,
      solidityType: T,
      applicationContract: `0x${string}`
    ): Promise<{ handle: Handle<T>; handleProof: `0x${string}` }>;

    decrypt<T extends SolidityType>(
      handle: Handle<T>
    ): Promise<{ value: JsValue<T>; solidityType: T }>;
  }

  // ============ Factory functions ============

  export function createEthersHandleClient(
    ethersClient: any,
    config?: Partial<HandleClientConfig>
  ): Promise<HandleClient>;

  export function createViemHandleClient(
    viemClient: any,
    config?: Partial<HandleClientConfig>
  ): Promise<HandleClient>;

  export function createHandleClient(
    blockchainClient: any,
    config?: Partial<HandleClientConfig>
  ): Promise<HandleClient>;
}
