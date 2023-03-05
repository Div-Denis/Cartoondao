import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

//创建DAO的提案

(async () => {
    try {
        //治理合约
        const vote = await sdk.getContract("0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a","vote");
        //代币合约
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //向社区金库铸造420000个新代币的提案
        const amount = 420_000;
        //提案内容
        const description = "Should the DAO mint an additional" + amount + "tokens into the treaury?";
        const executions = [
            {
                //我们实际执行铸造代币厂的代币合约
                toAddress: token.getAddress(),
                //我们的原生代币是ETH。nativeTokenValue是我们希望在此提案中发送的ETH数量。
                //在本例中，我们发送0个ETH。
                //我们只是在社区金库铸造新的代币，因此，设置为0.
                nativeTokenValue: 0,
                //我们正在mint！而且我们正在铸造投票，这是我们的社区金库。
                //在这种情况下，我们需要使用ethers.js将金额转换为正确的格式。
                //这是因为它需要的数量在wei中
                transactionData: token.encoder.encode(
                    "mintTo",[
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(),18),
                    ]
                ),
            }
        ];
        
        //在治理合约中提交提案内容和实际行动
        await vote.propose(description,executions);
        console.log("😀 Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1)
    }

    try {
        const vote = await sdk.getContract("0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a","vote");
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB", "token");
        //创建提案以转移给我们自己6900个代币
        const amount = 6_900;
        const description = "Should the DAO transfer" + amount + "tokens from the treasury to" + process.env.WALLET_ADDRESS + "for being swesome?";
        const executions =[
            {
                //同样，我们给自己发送0ETH.只发送我们自己的代币
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    //我们正在从社区金库转移到我们的钱包
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(),18),
                    ]
                ),
                toAddress: token.getAddress(),
            }
        ];
        await vote.propose(description, executions);

        console.log("🦊 Successfully created to reward ourselves from the treasury, let's hope people vote for it!");
    } catch (error) {
        console.error("failed to create second proposal",error);
    }
})();