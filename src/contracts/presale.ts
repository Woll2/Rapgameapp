import { Address, beginCell, Contract, ContractProvider, Sender, SendMode } from 'ton-core';

export default class PresaleContract implements Contract {
    static readonly ADDRESS = Address.parse('EQDBziMwzxZBqZ0nvyuLdR0-6DUqcNTVCJAMjqQ-Y5dbGLAO');
    
    constructor(readonly address: Address) {}

    static createForAddress(address: Address) {
        return new PresaleContract(address);
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
