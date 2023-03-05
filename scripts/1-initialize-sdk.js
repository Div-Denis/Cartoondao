import { ThirdwebSDK } from "@thirdweb-dev/sdk";
//导入和配置用于安全存储环境变量的.env文档
import dotenv from "dotenv";
dotenv.config();

//初始化SDK

//通过一些检查以确保我们的.env正常工作
if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === ""){
    console.log("Private key not found!");
}

if(!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === ""){
    console.log("Wallet Addrss not found!");
}

if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === ""){
    console.log("Api URL not found!");
}

const sdk = ThirdwebSDK.fromPrivateKey(
    //你的钱包私钥。始终保持私密，不要与任何人分享，将其添加到.env文档中，不要将该文档提交到github
    process.env.PRIVATE_KEY,
    //RPC URL,我们将使用来自.env文档的Alchemy API URL
    process.env.ALCHEMY_API_URL
);

//SDK initialized by address: 0xb7394a449DCd972761ad15c8c06a2b4b7689BBb9
(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK initialized by address:", address);
    } catch (error) {
        console.error("Failed to get apps from the sdk",error);
        process.exit(1);
    }
})();

export default sdk;