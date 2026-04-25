export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  getSigner: () => EthereumSigner;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

export interface EthereumSigner {
  signMessage: (message: string | Uint8Array) => Promise<string>;
  getAddress: () => Promise<string>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
