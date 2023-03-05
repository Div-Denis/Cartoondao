import sdk from "./1-initialize-sdk.js";

//撤销角色

(async () => {
    try {
        const token = await sdk.getContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
        //记录当前角色
        const allRoles = await token.roles.getAll();

        console.log(" Roles that exist right now:",allRoles);

        //撤销你的钱包在ERC-20合约上拥有的所有超能力
        await token.roles.setAll({admin:[], minter: []});
        console.log("Roles after revoking ourselves", await token.roles.getAll());
        console.log("😀 Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from DAO trasury",error);
    }
})();