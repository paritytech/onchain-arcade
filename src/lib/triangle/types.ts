/** Wallet account returned from host or browser extension */
export interface WalletAccount {
  address: string;
  name?: string;
  signer: any;
}

/** Chat message content — tagged union */
export type ChatMessageContent = { tag: 'Text'; value: string };

/** Connection status from the host */
export interface ConnectionStatus {
  isConnected: boolean;
}

/** Account connection status from the host */
export interface AccountConnectionStatus {
  connected: boolean;
  accounts: WalletAccount[];
}
