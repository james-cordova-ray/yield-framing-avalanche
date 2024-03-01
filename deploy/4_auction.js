module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log(
        `Deployer Balance: ${ethers.utils.formatUnits(
            await ethers.provider.getBalance(deployer)
        )} ETH`
    );
    const mytoken = await deployments.get("MyToken");
    const mamon_nft = await deployments.get("MamonNFT");

    log(`4) Auction`);
    // Deploy BlizzardToken contract
    const deployResult = await deploy("NftAuction", {
        from: deployer,
        contract: "NftAuction",
        gas: 4000000,
        args: [
            mamon_nft.address,
            mytoken.address,
            deployer,
            100
            // "0xae13d989dac2f0debff460ac112a837c89baa7cd", //wbnb
            // "0x1160Fe27E5C39284f6aEbDeC4AD2C1dc6f118D2b", // fast token
            // "0xa2cacce4a52037ddd90335a82be9a96e4170e7b6", // duke token
        ],
        skipIfAlreadyDeployed: true,
    });

    if (deployResult.newlyDeployed) {
        log(
            `- ${deployResult.contractName} deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
        log(
            `Token Deployer Balance: ${ethers.utils.formatUnits(
                await ethers.provider.getBalance(deployer)
            )} ETH`
        );
    } else {
        log(
            `- Deployment skipped, using previous deployment at: ${deployResult.address}`
        );
    }
};

module.exports.tags = ["4", "Auction"];
module.exports.dependencies = ["3"];