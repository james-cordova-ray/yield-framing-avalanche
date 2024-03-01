module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log(
        `Deployer Balance: ${ethers.utils.formatUnits(
            await ethers.provider.getBalance(deployer)
        )} ETH`
    );

    log(`2) MamonNFT`);
    // Deploy BlizzardToken contract
    const deployResult = await deploy("MamonNFT", {
        from: deployer,
        contract: "MamonNFT",
        gas: 4000000,
        args: [
            "Seamammon series",
            "MAMON",
            "https://ipfs.io/ipfs/"
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

module.exports.tags = ["2", "NFT"];
module.exports.dependencies = ["1"];