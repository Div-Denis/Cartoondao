import sdk from "./1-initialize-sdk.js";

//治理合约

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            //为治理合约命名
            name: "My amazing DAO",
            //这是我们的治理代币，我们的erc20代币合约地址
            voting_token_address: "0xe10254FE786c18a61BAE88C79ED4fBCB412485bB",
           
            //这些参数以块数指定，假设区块时间约为13.14秒(对于以太坊)
            
            //创建填后，成员何时开始可以投票？我们将其设置为立刻
            voting_delay_in_blocks:0,
            //创建提案后，成员必须对提案进行多长时间的投票？
            //我们将它设置为1天， 1天= 6570块
            voting_period_in_blocks:6570,
            //需要投票的总供应量的最低百分比，提案在提案时间结束后有效
            voting_quorum_fraction:0,
            //允许用户创建提案所需的最少个代币是多少？我将设置为0，这意味着允许用户创建提案不需要代币
            proposal_token_threshold:0,
        });

        //打印治理合约的地址：0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a
        console.log("😀 Successfully deployed vote contract, address",voteContractAddress);
    } catch (error) {
        console.error("failed to deploy vote contract",error);
    }
})();