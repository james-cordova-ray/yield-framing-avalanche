module.exports = async function({ ethers, deployments, getNamedAccounts}) {
    const { log, read } = deployments;
    const { deployer } = await getNamedAccounts();
    // const mamon_nft = await deployments.get("MamonNFT");
    // let tokenURI = await mamon_nft.tokenURI(1);
    let tokenURI = await read("MamonNFT", "tokenURI", 1);
    log(`--tokenURI: ${tokenURI}`);
    let owner = await read("MamonNFT", "ownerOf", 1);
    log(`--owner: ${owner}`);

    // let tokenIds = await read("MamonNFT", "tokenIds", deployer)
    // console.log(tokenIds);

}



module.exports.tags = ["6", "query"];
// module.exports.dependencies = ["1"];