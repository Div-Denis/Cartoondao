import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

//创建一个ERC-1155集合

(async () => {
    try {
        //部署标准ERC-1155合约
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            //集合的名称
            name: "CartoonDAO Membership",
            //集合的描述
            description: "A DAO for fans of Cartoon",
            //将保存在我们的NFT标题上的图像！
            image:readFileSync("scripts/assets/Badguy.png"),
            //我们需要子啊合约中传递将收到NFT销售收益的人的地址
            //我们计划不向人们收费，所以我们将传入0x0地址
            //如果你想收取费用，可以将其设置为你自己的钱包地址
            primary_sale_recipient:AddressZero,
        });

        //此初始化返回我们的合约的地址
        //我们使用它来初始化第三方SDK上的合约
        // address: 0x92d21179B0685f7b505714D43CBB7B1a255B62fA
        const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");
        
        //有了这个，我们可以获取合约的元数据
        const metadata = await editionDrop.metadata.get();

        console.log("Successfully deployed edtionDrop contract, address:", editionDropAddress,);
        console.log("edtionDrop metadata:", metadata);
    } catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();