module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log(
        `Deployer Balance: ${ethers.utils.formatUnits(
            await ethers.provider.getBalance(deployer)
        )} ETH`
    );

    log(`1) MyToken`);
    // Deploy BlizzardToken contract
    const deployResult = await deploy("MyToken", {
        from: deployer,
        contract: "MyToken",
        gas: 4000000,
        args: [
            "MyToken",
            "MYTOKEN"
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

module.exports.tags = ["1", "MyToken"];