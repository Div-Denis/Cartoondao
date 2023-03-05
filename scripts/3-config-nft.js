import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

//设置NFT数据

(async () => {
    try {
        const edtionDrop = await sdk.getContract("0x92d21179B0685f7b505714D43CBB7B1a255B62fA", "edition-drop");
        await edtionDrop.createBatch([
           {
            name: "Dragon Balls",
            description:"This NFT will give you access to CartoonDAO!",
            image:readFileSync("scripts/assets/dragon-balls-one.png")
           },
        ]);
        console.log("✔️ Successfully created a new NFT in the CartoonDAO!");
    } catch (error) {
        console.error("failed to create the new NFT",error);
    }
})();