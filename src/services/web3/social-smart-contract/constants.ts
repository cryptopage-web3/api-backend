import { maticCmmunityAbi, mumbaiCommunityAbi, mumbaiSingleReadAllCommentsAbi, mumbaiSingleReadPostAbi } from "./mumbai/abi";

interface IContract {
    address: string,
    abi: any
}

export interface IChainConf {
    communityContract : IContract,
    cryptoPageNftContractAddress : string,

    plugins : {
        singleReadPost: IContract,
        singleReadAllComments: IContract
    }
}

export const mumbaiSmartContracts:IChainConf = {
    communityContract : {
        address: '0x7e754f7d127eea39a3f7078ad4a8e9c61d6cd534',
        abi: mumbaiCommunityAbi
    },
    cryptoPageNftContractAddress : '0xc0fc66ba41bea0a1266c681bbc781014e7c67612',

    plugins : {
        singleReadPost:{
            address: '0x9e5224d23f22a6d0daa46d942305d0c94d3739ee0bd58cb2725e2f7f71c2ff73',
            abi: mumbaiSingleReadPostAbi,
        } ,
        singleReadAllComments: {
            address: '0x4109142687fb920f2169e9f03a6c4544f567cb8d156347cdfbdb34b589e10879',
            abi: mumbaiSingleReadAllCommentsAbi,
        }
    }
}; 

export const maticSmartContracts:IChainConf = {
    communityContract : {
        address: '0x522a97008c8744aeeb06b0795025572976DA922B',
        abi: maticCmmunityAbi,
    },
    cryptoPageNftContractAddress : '0x52C89dBdF1511E91f857BF4743eEA0FaB775E7Ca',

    plugins : {
        singleReadPost: {
            address: '0x9e5224d23f22a6d0daa46d942305d0c94d3739ee0bd58cb2725e2f7f71c2ff73',
            abi: mumbaiSingleReadPostAbi,
        },
        singleReadAllComments: {
            address: '0x4109142687fb920f2169e9f03a6c4544f567cb8d156347cdfbdb34b589e10879',
            abi: mumbaiSingleReadAllCommentsAbi,
        }
    }
}
