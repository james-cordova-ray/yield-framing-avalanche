const { expect } = require("chai");
describe("Testing auction contract", function () {
    // it("General", async function () {
    //     const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //
    //     const MyToken = await ethers.getContractFactory("MyToken");
    //     const myToken = await MyToken.deploy("MyToken", "MTM");
    //     console.log("ERC20 Token contract address:%s", myToken.address);
    //     myToken.mint(addr1.address, 50);
    //     myToken.mint(addr2.address, 50);
    //
    //
    //     const NftToken = await ethers.getContractFactory("MamonNFT");
    //     const nftToken = await NftToken.deploy("Nft", "NFT", "base_uri");
    //     console.log("NFT Token contract address:%s", nftToken.address);
    //
    //     const NftAuction = await ethers.getContractFactory("NftAuction");
    //     const nftAuction = await NftAuction.deploy(nftToken.address, myToken.address, addr3.address, 50);
    //
    //     console.log("Auction contract address:%s", nftAuction.address);
    //
    //     let owner_balance = await myToken.balanceOf(owner.address);
    //     let addr1_balance = await myToken.balanceOf(addr1.address);
    //     let addr2_balance = await myToken.balanceOf(addr2.address);
    //     let addr3_balance = await myToken.balanceOf(addr3.address);
    //
    //     console.log("owner_balance:%s", owner_balance);
    //     console.log("addr1_balance:%s", addr1_balance);
    //     console.log("addr2_balance:%s", addr2_balance);
    //     console.log("addr2_balance:%s", addr3_balance);
    //
    //
    //
    //     console.log("NFT mint for test");
    //     await nftToken.mint(owner.address,"metadataURI");
    //     console.log("token_id: 0");
    //
    //     console.log("owner of  NFT token approve");
    //     await nftToken.connect(owner).approve(nftAuction.address, 0);
    //
    //     console.log("createAuction: token_id - 0, start-price - 100, duration - 1000s, seller_account:%s", owner.address);
    //     await nftAuction.createAuction(0 ,10, 1000, owner.address);
    //
    //     console.log("addr1 of ERC20 approve : 100");
    //     await myToken.connect(addr1).approve(nftAuction.address, 100);
    //     console.log("addr1 bid 100");
    //     await nftAuction.connect(addr1).bid(0, 10 );
    //
    //     console.log("addr2 of ERC20 approve : 200");
    //     await myToken.connect(addr2).approve(nftAuction.address, 200);
    //     console.log("addr2 bid 200");
    //     await nftAuction.connect(addr2).bid(0, 20 );
    //
    //     console.log("timestamp 2000s spent");
    //     await network.provider.send("evm_increaseTime", [2000])
    //
    //     console.log("accept for addr2");
    //     await nftAuction.connect(addr2).claim(0);
    //
    //     owner_balance = await myToken.balanceOf(owner.address);
    //     addr1_balance = await myToken.balanceOf(addr1.address);
    //     addr2_balance = await myToken.balanceOf(addr2.address);
    //     addr3_balance = await myToken.balanceOf(addr3.address);
    //
    //     console.log("after accept, the balance's status");
    //     console.log("owner_balance:%s", owner_balance);
    //     console.log("addr1_balance:%s", addr1_balance);
    //     console.log("addr2_balance:%s", addr2_balance);
    //     console.log("addr3_balance:%s", addr3_balance);
    //
    //     console.log("---wallet's address");
    //     console.log("owner_address: %s", owner.address);
    //     console.log("addr1_address: %s", addr1.address);
    //     console.log("addr2_address: %s", addr2.address);
    //
    //     let owner_addr = await nftToken.ownerOf(0);
    //     console.log("nft token's owner: %s", owner_addr)
    //
    // });
    //
    it("Special", async function () {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("MyToken");
        const myToken = await MyToken.deploy("MyToken", "MTM");
        console.log("ERC20 Token contract address:%s", myToken.address);
        myToken.mint(addr1.address, 50);
        console.log("addr1 balance for myToken is 50");
        myToken.mint(addr2.address, 50);
        console.log("addr2 balance for myToken is 50");

        const NftToken = await ethers.getContractFactory("MamonNFT");
        const nftToken = await NftToken.deploy("Nft", "NFT", "base_uri");
        console.log("NFT Token contract address:%s", nftToken.address);

        const NftAuction = await ethers.getContractFactory("NftAuction");
        const nftAuction = await NftAuction.deploy(nftToken.address, myToken.address, addr3.address, 50);

        console.log("Auction contract address:%s", nftAuction.address);

        let owner_balance = await myToken.balanceOf(owner.address);
        let addr1_balance = await myToken.balanceOf(addr1.address);
        let addr2_balance = await myToken.balanceOf(addr2.address);
        let addr3_balance = await myToken.balanceOf(addr3.address);

        console.log("owner_balance:%s", owner_balance);
        console.log("addr1_balance:%s", addr1_balance);
        console.log("addr2_balance:%s", addr2_balance);
        console.log("addr3_balance:%s", addr3_balance);



        console.log("NFT mint for test");
        await nftToken.mint(owner.address,"metadataURI");
        console.log("token_id: 0");

        console.log("owner of  NFT token approve");
        await nftToken.connect(owner).approve(nftAuction.address, 0);

        console.log("createAuction: token_id - 0, start-price - 10, duration - 1000s, seller_account:%s", owner.address);
        await nftAuction.createAuction(0 ,10, 1000, owner.address);

        //await nftAuction.createAuction(0 ,20, 1000, owner.address);

        console.log("addr1 of ERC20 approve : 50");
        await myToken.connect(addr1).approve(nftAuction.address, 50);
        console.log("addr1 bid 10");
        await nftAuction.connect(addr1).bid(0, 10 );

        console.log("addr2 of ERC20 approve : 50");
        await myToken.connect(addr2).approve(nftAuction.address, 50);
        console.log("addr2 bid 20");
        await nftAuction.connect(addr2).bid(0, 20 );

        console.log("addr1 bid 20");
        await nftAuction.connect(addr1).bid(0, 20 );

        console.log("--token_ids");
        let token_ids = await nftAuction.listAuction();
        console.log(token_ids);

        console.log("AuctionInfo:");
        let auctionInfo = await nftAuction.auctionInfo(0);
        console.log(auctionInfo);
        console.log("timestamp 2000s spent");
        await network.provider.send("evm_increaseTime", [2000])

        console.log("accept for addr1");
        await nftAuction.connect(addr1).claim(0);

        owner_balance = await myToken.balanceOf(owner.address);
        addr1_balance = await myToken.balanceOf(addr1.address);
        addr2_balance = await myToken.balanceOf(addr2.address);
        addr3_balance = await myToken.balanceOf(addr3.address);

        console.log("after accept, the balance's status");
        console.log("owner_balance:%s", owner_balance);
        console.log("addr1_balance:%s", addr1_balance);
        console.log("addr2_balance:%s", addr2_balance);
        console.log("addr3_balance:%s", addr3_balance);


        console.log("---wallet's address");
        console.log("owner_address: %s", owner.address);
        console.log("addr1_address: %s", addr1.address);
        console.log("addr2_address: %s", addr2.address);
        console.log("addr2_address: %s", addr3.address);

        let nft_owner_addr = await nftToken.ownerOf(0);
        console.log("nft token's owner: %s", nft_owner_addr)

        //recreate Auction after ended.

        console.log("owner of  NFT token approve");
        await nftToken.connect(addr1).approve(nftAuction.address, 0);
        await nftAuction.createAuction(0 ,10, 1000, addr1.address);

        console.log("--token_ids");
        token_ids = await nftAuction.listAuction();
        console.log(token_ids);

        console.log("owner of ERC20 approve : 50");
        await myToken.connect(owner).approve(nftAuction.address, 50);
        console.log("owner bid 10");
        await nftAuction.connect(owner).bid(0, 10 );

        console.log("addr2 of ERC20 approve : 50");
        await myToken.connect(addr2).approve(nftAuction.address, 50);
        console.log("addr2 bid 15");
        await nftAuction.connect(addr2).bid(0, 15 );

        console.log("owner bid 10");
        await nftAuction.connect(owner).bid(0, 10 );


        console.log("timestamp 2000s spent");
        await network.provider.send("evm_increaseTime", [2000])

        console.log("claim for addr2");
        await nftAuction.connect(addr2).claim(0);
        owner_balance = await myToken.balanceOf(owner.address);
        addr1_balance = await myToken.balanceOf(addr1.address);
        addr2_balance = await myToken.balanceOf(addr2.address);
        addr3_balance = await myToken.balanceOf(addr3.address);
        console.log("after accept, the balance's status");
        console.log("owner_balance:%s", owner_balance);
        console.log("addr1_balance:%s", addr1_balance);
        console.log("addr2_balance:%s", addr2_balance);
        console.log("addr3_balance:%s", addr3_balance);


        console.log("accept for owner");
        await nftAuction.connect(owner).claim(0);

        owner_balance = await myToken.balanceOf(owner.address);
        addr1_balance = await myToken.balanceOf(addr1.address);
        addr2_balance = await myToken.balanceOf(addr2.address);
        addr3_balance = await myToken.balanceOf(addr3.address);
        console.log("after accept, the balance's status");
        console.log("owner_balance:%s", owner_balance);
        console.log("addr1_balance:%s", addr1_balance);
        console.log("addr2_balance:%s", addr2_balance);
        console.log("addr3_balance:%s", addr3_balance);

        nft_owner_addr = await nftToken.ownerOf(0);
        console.log("nft token's owner: %s", nft_owner_addr)
    });
//
//     it("Test owner", async function () {
//         const [owner, addr1, addr2, addr3] = await ethers.getSigners();
//
//         const MyToken = await ethers.getContractFactory("MyToken");
//         const myToken = await MyToken.deploy("MyToken", "MTM");
//
//         const NftToken = await ethers.getContractFactory("MamonNFT");
//         const nftToken = await NftToken.deploy("Nft", "NFT", "base_uri");
//
//         const NftAuction = await ethers.getContractFactory("NftAuction");
//         const nftAuction = await NftAuction.deploy(nftToken.address, myToken.address, addr3.address, 50);
//         let fee = await nftAuction.fee();
//
//         console.log("Fee:%s", fee);
//         await nftAuction.updateFee(10);
//         fee = await nftAuction.fee();
//         console.log("Fee:%s", fee);
//
//         // await nftAuction.connect(addr1).updateFee(100);
//         // fee = await nftAuction.fee();
//         // console.log("Fee:%s", fee);
//
//         let minter = await nftAuction.minter();
//         console.log("Minter: %s", minter);
//
//         await nftAuction.updateMinter(addr2.address);
//         minter = await nftAuction.minter();
//         console.log("Minter: %s", minter);
//
//         // await nftAuction.connect(addr1).updateMinter(addr1.address);
//         // minter = await nftAuction.minter();
//         // console.log("Minter: %s", minter);
//
//         let owner_contract = await nftAuction.owner();
//         console.log("Owner: %s", owner_contract);
//
//         await nftAuction.updateOwner(addr2.address);
//         owner_contract = await nftAuction.owner();
//         console.log("Owner: %s", owner_contract);
//         //
//         // await nftAuction.connect(addr1).updateOwner(addr1.address);
//         // owner_contract = await nftAuction.owner();
//         // console.log("Owner: %s", owner_contract);
//
// });
    });