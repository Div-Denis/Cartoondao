import sdk from "./1-initialize-sdk.js";

//设置空投

(async () => {
    try {
        //ERC1155会员NFT的合约地址
        const editionDrop = await sdk.getContract("0x92d21179B0685f7b505714D43CBB7B1a255B62fA","edition-drop");
        //ERC20代币的合约地址
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //获取拥有我们会员NFT的人的所有地址
        //该NFT 的ID从0开始
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);
        
        //如果没人拥有会员NFT ，打印这条
        if(walletAddress.length === 0){
            console.log("No NFTs have been claimed yet, maybe get some friends to climed your free NFTs");
            process.exit(0);
        }
      
        //遍历地址数组
        const airdropTagets = walletAddress.map((address) => {
            //在1000到10000之间随机选择一个
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 +1) + 1000);
            console.log("Going to airdrop", randomAmount, "tokens to", address);
            
            //设置目标
            const airdropTaget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTaget;
        });
         
        console.log("Starting airdrop...");
        await token.transferBatch(airdropTagets);
        console.log("Successfully airdropped tokens to all the holders of the NFT!");



       
    } catch (error) {
        console.error("failed to airdrop tokens",error);
    }
})();