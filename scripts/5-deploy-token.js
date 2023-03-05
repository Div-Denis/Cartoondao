import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

//创建治理代币

(async () => {
    try {
        //部署标准ERC20合约
        const tokenAddress = await sdk.deployer.deployToken({
            //代币名称
            name: "CartoonDAO Governance Token",
            //代币代号
            symbol: "CGT",
            //这将以防我们想出售我们的代币
            //因为我们不这样做，我们再次将其设置为AddressZero
            primary_sale_recipient: AddressZero,
        });

        //打印出代币合约地址:0xe10254FE786c18a61BAE88C79ED4fBCB412485bB
        console.log("Successfully deployed token contract ,address:", tokenAddress);

    } catch (error) {
        console.error("failed to deploy token contract",error);
    }
})();