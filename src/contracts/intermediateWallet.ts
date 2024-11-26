import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    ContractProvider, 
    Sender, 
    SendMode,
    toNano 
} from 'ton-core';

export default class IntermediateWallet implements Contract {
    static readonly PRESALE_ADDRESS = Address.parse('EQDBziMwzxZBqZ0nvyuLdR0-6DUqcNTVCJAMjqQ-Y5dbGLAO');
    
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createForAddress(address: Address) {
        return new IntermediateWallet(address);
    }

    async sendToPresale(
        provider: ContractProvider, 
        via: Sender,
        amount: bigint
    ) {
        await provider.internal(via, {
            value: amount,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x595f07bc, 32) // op для purchase
                .storeAddress(IntermediateWallet.PRESALE_ADDRESS)
                .storeCoins(amount - toNano('0.1')) // Оставляем 0.1 TON на газ
                .endCell(),
        });
    }

    // Метод для администратора чтобы забрать TON в случае проблем
    async withdrawEmergency(
        provider: ContractProvider,
        via: Sender,
        to: Address
    ) {
        await provider.internal(via, {
            value: toNano('0.1'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x77777777, 32) // op для emergency withdraw
                .storeAddress(to)
                .endCell(),
        });
    }
}
