import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fromNano, toNano } from 'ton-core';
import PresaleContract from '../contracts/presale';

export function usePresaleContract() {
    const { client, loading: clientLoading } = useTonClient();
    const { sender, connected } = useTonConnect();

    const contract = PresaleContract.createForAddress(PresaleContract.ADDRESS);

    const { data: balance, isLoading: balanceLoading } = useQuery(
        ['presaleBalance'],
        async () => {
            if (!client) return '0';
            try {
                const state = await client.getContractState(PresaleContract.ADDRESS);
                const balance = state.balance;
                return balance ? fromNano(balance) : '0';
            } catch (error) {
                console.error('Error fetching balance:', error);
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
            await contract.sendPurchase(client, sender, amountInNano);
        }
    );

    return {
        balance,
        purchase,
        connected,
        loading: clientLoading || balanceLoading || purchaseLoading
    };
}
