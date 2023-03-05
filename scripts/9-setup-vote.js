import sdk from "./1-initialize-sdk.js";

//设置社区金库 ENS的做法是50%在社区，25空投，另外25给核心团队+奉献者

(async () => {
    try {
        //这是我们的治理合约
        const vote = await sdk.getContract("0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a","vote");
        //这是我们的代币合约
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //如果需要，让我们的财政部有权铸造额外的代币
        await token.roles.grant("minter",vote.getAddress());

        console.log("Successfully gave vote contract permissions to act on token contract");
        
    } catch (error) {
        console.error("failed to grant vote contract permissions to act on tken contract",error);
        process.exit(1)
    }

    try {
        //这是我们的治理合约
        const vote = await sdk.getContract("0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a","vote");
        //这是我们的代币合约
        const token  = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //抓住我们的钱包的代币余额，记住-我们现在基本上持有全部供应
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        //抢夺我们持有的90%的供应
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        //将90%的供应转移到我们的投票合约中
        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("👍 Successfully transferred" + percent90 + "tokens to vote contract" );
    } catch (err) {
        console.error("failed to transfer token to vote contract",err);
    }
})();