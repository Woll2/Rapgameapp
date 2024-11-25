import { Address, beginCell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export default class PresaleContract implements Contract {
    static readonly ADDRESS = Address.parse('EQDBziMwzxZBqZ0nvyuLdR0-6DUqcNTVCJAMjqQ-Y5dbGLAO');
    
    constructor(readonly address: Address) {}

    static createForAddress(address: Address) {
        return new PresaleContract(address);
    }

    async getBalance(provider: ContractProvider) {
        try {
            const { stack } = await provider.get('get_balance', []);
            return stack.readBigNumber();
        } catch (e) {
            try {
                const state = await provider.getContractState();
                if (!state) return 0n;
                return state.balance;
            } catch (error) {
                console.error('Failed to get contract state:', error);
                return 0n;
            }
        }
    }

    async sendPurchase(provider: ContractProvider, via: Sender, amount: bigint) {
        await provider.internal(via, {
            value: amount,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x595f07bc, 32) // op для purchase
                .endCell(),
        });
    }
}
