export const mumbaiCommunityAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes32","name":"pluginName","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"bool","name":"newStatus","type":"bool"}],"name":"ChangePluginStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetAccount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetBank","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetCommentData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetCommunityData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetExecutor","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes32","name":"pluginName","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"address","name":"pluginContract","type":"address"}],"name":"SetPlugin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetPostData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetProfitDistribution","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetRule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetSafeDeal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetSoulBound","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetSubscription","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetSuperAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"oldValue","type":"address"},{"indexed":false,"internalType":"address","name":"newValue","type":"address"}],"name":"SetUniV3Pool","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"origin","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"bool","name":"enable","type":"bool"}],"name":"SetVotingContract","type":"event"},{"inputs":[],"name":"EMPTY_NAME","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"account","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bank","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_pluginName","type":"bytes32"},{"internalType":"uint256","name":"_version","type":"uint256"}],"name":"changePluginStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"commentData","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"communityData","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dao","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"executor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_pluginName","type":"bytes32"},{"internalType":"uint256","name":"_version","type":"uint256"}],"name":"getPlugin","outputs":[{"internalType":"bool","name":"enable","type":"bool"},{"internalType":"address","name":"pluginContract","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_pluginName","type":"bytes32"},{"internalType":"uint256","name":"_version","type":"uint256"}],"name":"getPluginContract","outputs":[{"internalType":"address","name":"pluginContract","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_dao","type":"address"},{"internalType":"address","name":"_treasury","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_pluginName","type":"bytes32"},{"internalType":"uint256","name":"_version","type":"uint256"}],"name":"isEnablePlugin","outputs":[{"internalType":"bool","name":"enable","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"isVotingContract","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"postData","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"profitDistribution","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rule","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"safeDeal","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"setAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setBank","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setCommentData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setCommunityData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setExecutor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_pluginName","type":"bytes32"},{"internalType":"uint256","name":"_version","type":"uint256"},{"internalType":"address","name":"_pluginContract","type":"address"}],"name":"setPlugin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setPostData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setProfitDistribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setRule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setSafeDeal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setSoulBound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setSubscription","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"setSuperAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"setUniV3Pool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"setVotingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"soulBound","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"subscription","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"superAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniV3Pool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}]

export const mumbaiSingleReadPostAbi = [{"inputs":[{"internalType":"address","name":"_registry","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PLUGIN_NAME","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_postId","type":"uint256"}],"name":"read","outputs":[{"components":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"currentOwner","type":"address"},{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"uint256","name":"upCount","type":"uint256"},{"internalType":"uint256","name":"downCount","type":"uint256"},{"internalType":"uint256","name":"commentCount","type":"uint256"},{"internalType":"uint256","name":"encodingType","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"payAmount","type":"uint256"},{"internalType":"uint256","name":"paymentType","type":"uint256"},{"internalType":"uint256","name":"minimalPeriod","type":"uint256"},{"internalType":"bool","name":"isView","type":"bool"},{"internalType":"bool","name":"isEncrypted","type":"bool"},{"internalType":"bool","name":"isSensitive","type":"bool"},{"internalType":"bool","name":"isCommented","type":"bool"}],"internalType":"struct DataTypes.SinglePostInfo","name":"outData","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registry","outputs":[{"internalType":"contract IRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

export const mumbaiSingleReadAllCommentsAbi = [{"inputs":[{"internalType":"address","name":"_registry","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PLUGIN_NAME","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_postId","type":"uint256"}],"name":"read","outputs":[{"components":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"communityId","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"gasConsumption","type":"uint256"},{"internalType":"bool","name":"up","type":"bool"},{"internalType":"bool","name":"down","type":"bool"},{"internalType":"bool","name":"isView","type":"bool"},{"internalType":"bool","name":"isEncrypted","type":"bool"},{"internalType":"bool","name":"isGasCompensation","type":"bool"},{"internalType":"string","name":"ipfsHash","type":"string"}],"internalType":"struct DataTypes.CommentInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registry","outputs":[{"internalType":"contract IRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]