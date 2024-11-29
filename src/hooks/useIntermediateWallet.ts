import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Address, fromNano, toNano } from 'ton-core';
import IntermediateWallet from '../contracts/intermediateWallet';

// Адрес промежуточного кошелька (нужно заменить на реальный после деплоя)
const INTERMEDIATE_WALLET_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

export function useIntermediateWallet() {
    const { client, loading: clientLoading } = useTonClient();
    const { sender, connected } = useTonConnect();

    const contract = IntermediateWallet.createForAddress(INTERMEDIATE_WALLET_ADDRESS);

    const { data: balance, isLoading: balanceLoading } = useQuery(
        ['intermediateWalletBalance'],
        async () => {
            if (!client) return '0';
            try {
                const state = await client.getContractState(INTERMEDIATE_WALLET_ADDRESS);
                const balance = state.balance;
                return balance ? fromNano(balance) : '0';
            } catch (error) {
                console.error('Error fetching intermediate wallet balance:', error);
                return '0';
            }
        },
        { 
            enabled: !!client && !clientLoading,
            refetchInterval: 3000,
            retry: 1
        }
    );

    const { mutateAsync: purchase, isLoading: purchaseLoading } = useMutation(
        async (amount: number) => {
            if (!client || !sender) throw new Error('Client or sender not initialized');
            
            // Проверка минимальной и максимальной суммы покупки
            if (amount < 0.5) throw new Error('Minimum purchase amount is 0.5 TON');
            if (amount > 1000) throw new Error('Maximum purchase amount is 1,000 TON');
            
            const amountInNano = toNano(amount.toString());
            await contract.sendToPresale(client, sender, amountInNano);
        }
    );

    const { mutateAsync: withdrawEmergency, isLoading: withdrawLoading } = useMutation(
        async (toAddress: string) => {
            if (!client || !sender) throw new Error('Client or sender not initialized');
            await contract.withdrawEmergency(client, sender, Address.parse(toAddress));
        }
    );

    return {
        balance,
        purchase,
        withdrawEmergency,
        connected,
        loading: clientLoading || balanceLoading || purchaseLoading || withdrawLoading
    };
}
