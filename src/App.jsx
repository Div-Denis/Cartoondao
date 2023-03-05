import { useEffect, useState, useMemo } from "react";
import { useAddress, ConnectWallet, useContract, useNFTBalance, Web3Button,useNetwork } from "@thirdweb-dev/react";
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {
  // 使用thirdweb提供给我们的钩子
  const address = useAddress();
  console.log("Address:",address);

  const network = useNetwork();
  console.log("Network:",network);
  
  //初始化我们的合约
  const editionDropAddress = "0x92d21179B0685f7b505714D43CBB7B1a255B62fA";
  const { contract: editionDrop } = useContract(editionDropAddress,"edition-drop");
  //初始化我们的token合约
  const { contract: token } = useContract("0xe10254FE786c18a61BAE88C79ED4fBCB412485bB","token");
  //初始化我们的治理合约
  const { contract :vote } = useContract("0x2fc8DB84674927cCc6F5b1909C0C29d5006bfB5a","vote");
  //钩子检查用户是否拥有我们的NFT
  const {data: nftBalance} = useNFTBalance(editionDrop,address,"0");
  
  //检查有没有会员NFT
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  },[nftBalance]);

  //保存每个成员在状态中拥有的代币数量
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  //保存所有成员地址的数组
  const [memberAddresses, setMemberAddresses] = useState([]);

  //缩短某人钱包地址的功能，无需显示整个内容
  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  //这个Effect抓取了持有我们NFT的会员的所有地址
  useEffect(() => {
    //如果不是会员返回出去
    if(!hasClaimedNFT){
      return;
    }
   
    //就像7.。js文档中所作的一样，抓住持有我们NFT的用户，从ID 0 开始
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
          0,
        );
        setMemberAddresses(memberAddresses);
        console.log("Member address:", memberAddresses);
      } catch (error) {
        console.error("failed to get member list",error);
      }
    };
    getAllAddresses();
  },[hasClaimedNFT,editionDrop?.history]);

  //这个useEffect抓住每个成员持有的代币
  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllBalances = async () => {
      try {
        //抓住会员的代币余额
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Amount:", amounts);
      } catch (error) {
        console.error("failed to get member balance", error);
      }
    };
    getAllBalances()
  },[hasClaimedNFT,token?.history]);

  //现在，我们将memberAddresses和memberTokenAmounts合并到一个数组中
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      //我们正在检查是否在memberTokenAmounts数组中找到地址。
      //如果时，我们将返回用户拥有的代币数量。否则返回0
      const member = memberTokenAmounts?.find(({holder}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      }
    }
    );
   
  },[memberAddresses, memberTokenAmounts]);


 

   //保存提案
   const [proposals, setProposals] = useState([]);
   //保存是否投票
   const [isVoting, setIsVoting] = useState(false);
   //保存是否投票过
   const [hasVoted, setHasVotes] = useState(false);

   //从合约中检索我们现有的所有提案
   useEffect(() => {
     if(!hasClaimedNFT){
      return;
     }

     //一个简单的调用vote.getAll()来获取提案。
     const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals");
      }
     };
     getAllProposals();
   },[hasClaimedNFT, vote]);

   //我们还需要检查用户是否已经投票
   useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    //如果我们还没有完成从上面的useEffect中检索提案，那么我们无法检查用户是否投票
    if(!proposals.length){
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        //检查这个地址是否已经对第一个提案投票
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVotes(hasVoted);
        if(hasVoted){
          console.log("😢 User has already voted");
        }else{
          console.log("😀 User has not voted yet");
        }
      } catch (error) {
        console.log("failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
   },[hasClaimedNFT,proposals,address,vote]);

   //检查是否连接到mumbai网络
   if(address && (network?.[0].data.chain.id !== ChainId.Mumbai)){
    return(
      <div className="unsupported-network">
        <h2>Please connect to Mumbai</h2>
        <p>
          This dapp only woeks on the Mumbai network ,please switch networks in your connected wallet.
        </p>
      </div>
    );
  };
  
  //这是用户还没有连接钱包的情况
  //到你的web应用，让他们调用connectWallet
  if(!address){
    return(
      <div className="landing">
        <h1>Wlcome to CartoonDAO</h1>
        <div className=""btn-hero>
          <ConnectWallet/>
        </div>
      </div>
    );
  }
  
  //如果用户已经认领了他们的NFT，我们希望向他们显示内部DAO页面
  //只有DAO成员才能看到这个，呈现所有成员+代币金融
  if(hasClaimedNFT){
    return(
      <div className="member-page">
        <h1>CartoonDAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2> Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Action Proposals</h2>
            <form
              onSubmit={async(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                //在我们做异步操作之前，我们想禁用按钮以防止双击
                setIsVoting(true);

                //让我们从表单中获取值的投票
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //默认弃权
                    vote:2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + '-' + vote.type,
                    );

                    if(elem.checked){
                      voteResult.vote = vote.type;
                      return;
                    };
                  });
                  return voteResult;
                });

                //首先，我们需要确保用户委托他们的代币投票
                try {
                  //我们将检查钱包是否仍然需要委托他们的代币才能投票
                  const delegation = await token.getDelegationOf(address);
                  //如果委派是0x0地址，则意味着他们尚未委派其治理代币
                  if(delegation === AddressZero){
                    //如果他们还没有委托他们的代币，我们会让他们在投票前委托他们
                    await token.delegateTo(address);
                  }

                  //然后我们需要对提案进行投票
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote:_vote}) => {
                        //在投票之前，我们首先需要检查提案是否开放投票
                        //我们首先需要获取提案的最新状态
                        const proposal = await vote.get(proposalId);
                        //然后我们检查提案是否开放投票(状态 === 1)表示它是开放的
                        if(proposal.state === 1){
                          //如果它开放投票，我们将对其进行投票
                          return vote.vote(proposalId,_vote);
                        }
                        //如果提案不开放投标，我们上面也不返回，让我们继续
                        return;
                      }),
                    );

                    try {
                      //如果任何道具准备好执行，我们需要执行它们
                      //如果提案处于状态4，则已准备好执行
                      await Promise.all(
                        votes.map(async ({proposalId}) => {
                        //我们将首先再次获得提案的最新状态，因为我们可能刚刚投过票
                        const proposal = await vote.get(proposalId);
                        //如果状态处于状态4(意味着它已准备好执行)，我们将执行提案
                        if(proposal.state === 4){
                          return vote.execute(proposalId);
                        }
                      }),
                      );
                      //如果我们到达这里，这意味着我们成功投票，所有让我们将hasVoted状态设置为true
                      setHasVotes(true);
                      //并打印成功消息
                      console.log("successfully voted");
                    } catch (error) {
                      console.error("failed to execute votes",error);
                    }
                  } catch (error) {
                    console.error("failed to vote",error);
                  }
                } catch (error) {
                  console.error("failed to delegate tokens",error);
                }finally {
                  //在任已情况下，我们需要将isVote状态设置为false以再次启动该按钮
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({type, label}) => (
                      <div key={type}>
                        <input 
                          type = "radio"
                          id={proposal.proposalId + '-' + type}
                          name={proposal.proposalId}
                          value={type}
                          //默认"弃权"选票为勾选
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? 'Voting...'
                  :  hasVoted
                  ? 'You already Voted'
                  : 'Submit Votes'}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  //这是我们有用户地址的情况
  //这意味着他们已经将钱包连接到我们的网站
  return (
    // <div className="landing">
    //   <h1>Wallet connected, now that!</h1>
    // </div>
    <div className="mint-nft">
      <h1>Mint your free CartoonDAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0,1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on Opensea:https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (Free)
        </Web3Button>
      </div>
    </div>
  );
};

export default App;
