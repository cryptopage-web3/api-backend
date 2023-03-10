import { injectable } from 'inversify';

@injectable()
export class TestAlchemyMock {
    nft = {
        getNftsForOwner: function(){}
    }
    core = {
        getAssetTransfers: function(){}
    }
}


export function testAlchemyMockFactory(){
    return new TestAlchemyMock()
}