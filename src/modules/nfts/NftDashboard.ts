import { inject, injectable } from "inversify";
import { IDS } from "../../types";

@injectable()
export class NftDashboard {
    @inject(IDS.SERVICE.WEB3.ContractFactory) _contractFactory: Function
    @inject(IDS.CONFIG.NftReadAsProxy.ContractAddress) _constractAddress:string
    @inject(IDS.CONFIG.NftReadAsProxy.Abi) _abi

    async getLastTokenIds(count: number){
        const contract = this._contractFactory(this._abi, this._constractAddress),
            totalSupplyStr = await contract.methods.totalSupply().call(),
            totalSupply = parseInt(totalSupplyStr),
            end = totalSupply >= count ? totalSupply - count : 0

        const tokens:any[] = []

        for(let id = totalSupply; id > end; id--){
            const idStr = `80001${id.toString().padStart(12,'0')}`
            tokens.push({tokenId: idStr} as any)
        }

        return tokens
    }
}