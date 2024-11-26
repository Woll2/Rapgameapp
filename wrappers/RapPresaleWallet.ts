import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, DictionaryValue, Sender, SendMode, toNano } from 'ton-core';

export type RapPresaleConfig = {
    balance: bigint;
    owner: Address;
    jettonMaster: Address;
    price: bigint;
    minPurchase: bigint;
    maxPurchase: bigint;
    totalSold: bigint;
    isActive: boolean;
    purchases: Dictionary<Address, bigint>;
};

export function rapPresaleConfigToCell(config: RapPresaleConfig): Cell {
    return beginCell()
        .storeCoins(config.balance)
        .storeAddress(config.owner)
        .storeAddress(config.jettonMaster)
        .storeCoins(config.price)
        .storeCoins(config.minPurchase)
        .storeCoins(config.maxPurchase)
        .storeCoins(config.totalSold)
        .storeBit(config.isActive)
        .storeDict(config.purchases)
        .endCell();
}

export class RapPresaleWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromConfig(config: RapPresaleConfig, code: Cell) {
        const data = rapPresaleConfigToCell(config);
        const init = { code, data };
        return new RapPresaleWallet(contractAddress(0, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano('0.1'),
            bounce: false
        });
    }

    async sendChangePrice(provider: ContractProvider, via: Sender, newPrice: bigint) {
        await provider.internal(via, {
            value: toNano('0.1'),
            body: beginCell()
                .storeUint(1, 32) // op: change_price
                .storeCoins(newPrice)
                .endCell()
        });
    }

    async sendSetActive(provider: ContractProvider, via: Sender, isActive: boolean) {
        await provider.internal(via, {
            value: toNano('0.1'),
            body: beginCell()
                .storeUint(2, 32) // op: set_active
                .storeBit(isActive)
                .endCell()
        });
    }

    async sendWithdrawTokens(provider: ContractProvider, via: Sender, amount: bigint) {
        await provider.internal(via, {
            value: toNano('0.1'),
            body: beginCell()
                .storeUint(3, 32) // op: withdraw_tokens
                .storeCoins(amount)
                .endCell()
        });
    }

    async getPresaleData(provider: ContractProvider) {
        const { stack } = await provider.get('get_presale_data', []);
        return {
            balance: stack.readBigNumber(),
            owner: stack.readAddress(),
            jettonMaster: stack.readAddress(),
            price: stack.readBigNumber(),
            minPurchase: stack.readBigNumber(),
            maxPurchase: stack.readBigNumber(),
            totalSold: stack.readBigNumber(),
            isActive: stack.readBoolean()
        };
    }

    async getIsActive(provider: ContractProvider) {
        const { stack } = await provider.get('get_is_active', []);
        return stack.readBoolean();
    }

    async getWalletPurchases(provider: ContractProvider, address: Address) {
        const { stack } = await provider.get('get_wallet_purchases', [
            { type: 'slice', cell: beginCell().storeAddress(address).endCell() }
        ]);
        return stack.readBigNumber();
    }
}
