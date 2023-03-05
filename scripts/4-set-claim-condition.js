import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

//设置铸造规则

(async () => {
    try {
        const editionDrop = await sdk.getContract("0x92d21179B0685f7b505714D43CBB7B1a255B62fA", "edition-drop");
        //我们定义我们的声明条件，这是一个对象数组
        //因为如果需要，我们可以在不同的时间开始多个阶段
        const claimConditions = [{
            //当人们能够开始认领NFT时间（现在）
            startTime: new Date(),
            //可以领取的最大NFT数量
            maxClaimable: 50_000,
            //我们的NFT的价格（免费）
            price: 0,
            //人们可以在一次交易中领取的NFT数量
            maxClaimablePerWallet: 1,
            //我们将交易之间的等待设置为无限制
            //这意味着人们只允许声明一次
            waitInseconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Sucessfully set claim condition!");
    } catch (error) {
        console.error("Failed to set claim condition",error);
    }
})();