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



    log(`3) Marketplace`);
    // Deploy BlizzardToken contract
    const deployResult = await deploy("Marketplace", {
        from: deployer,
        contract: "MamonNFT",
        gas: 4000000,
        args: [
            mamon_nft.address,
            mytoken.address,
            // "0x1160Fe27E5C39284f6aEbDeC4AD2C1dc6f118D2b", // fast token
            // "0xa2cacce4a52037ddd90335a82be9a96e4170e7b6" // duke token
            500 // fee 5%
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

module.exports.tags = ["3", "Marketplace"];
module.exports.dependencies = ["2"];