const { expect } = require("chai");
describe("Testing NFT contract", ()=>{
    it("General", async()=>{
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();
        const NftToken = await ethers.getContractFactory("MamonNFT");
        const nftToken = await NftToken.deploy("Nft", "NFT", "base_uri");
        console.log("NFT Token contract address:%s", nftToken.address);

        console.log("NFT mint for test");
        await nftToken.mint(owner.address,"metadataURI");

        console.log("NFT mint for test");
        await nftToken.mint(owner.address,"metadataURI");

        console.log("NFT mint for test");
        await nftToken.mint(addr1.address,"metadataURI");

        console.log("NFT mint for test");
        await nftToken.mint(addr2.address,"metadataURI");

        let ids = await nftToken.tokenIds(addr2.address);
        console.log(ids);

    })
});