import sdk from "./1-initialize-sdk.js";

//设置代币的总供应量

(async () => {
    try {
        //这是我们前面步骤中打印的ERC20合约的地址
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //最大供应量我1000000
        const amount = 1_000_000;
        //与你部署的ERC20合约互动并铸造代币
        await token.mint(amount);
        //总供应量
        const totalSupply = await token.totalSupply();
     
        //打印出我们现在有多少代币
        console.log("There now is ",totalSupply.displayValue, "$CKT in circulation");
    } catch (error) {
        console.error("failed to print momey",error);
    }
})();