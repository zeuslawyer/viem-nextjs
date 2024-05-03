'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Address,
  createWalletClient,
  custom,
  parseEther,
  parseUnits,
  formatUnits,
  WalletClient,
} from 'viem';
import { sepolia } from 'viem/chains';
import { set } from 'zod';

export default function Page() {
  const WALLET_2 = '0x52eE5a881287486573cF5CB5e7E7D92F30b03014';

  const [account, setAccount] = useState<Address>();
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const [addr2Bal, setAddr2Bal] = useState<string | number>('?');

  useEffect(() => {
    if (typeof window !== undefined && window.ethereum) {
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window?.ethereum!),
      });
      setWalletClient(walletClient);
      console.log('wallet client set...');

      async function getWallet2Balance() {
        const startingBal = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [WALLET_2, null],
        });
        console.log('Starting balance:', parseInt(startingBal) / 1e18);
        setAddr2Bal(parseInt(startingBal) / 1e18);
      }
      walletClient && getWallet2Balance();
    }
  }, [addr2Bal]);

  const handleConnect = async () => {
    const [myAddr1, myAddr2] = await walletClient.requestAddresses();
    setAccount(myAddr1);
  };

  const sendTransaction = async () => {
    console.log('Sending some moolah to Zubin');
    if (!account) return;
    await walletClient.sendTransaction({
      chain: sepolia,
      account,
      to: WALLET_2,
      value: parseEther('0.000001'),
    });

    console.log('Transaction sent');
    const newBal = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [WALLET_2, null],
    });

    setAddr2Bal(parseInt(newBal) / 1e18);
    setTimeout(() => {
      window.alert(
        'please reload the window after Metamask confirms the transaction to see the updated Wallet 2 balance',
      );
    }, 5000);
  };

  if (!walletClient) return <div>Loading Window.Provider...</div>;

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div>
        <h1>
          Front end has gotten real crazy....give me distributed services in
          multiregion cloud VPNs any day 🤪
        </h1>
        <h2>Wallet 2 Balance: {addr2Bal}</h2>
        {!account && <button onClick={handleConnect}>Connect Wallet</button>}

        {account && (
          <>
            <div>Connected To Wallet: {account}</div>
            <button onClick={sendTransaction}>Send Transaction</button>
          </>
        )}
      </div>
    </main>
  );
}
