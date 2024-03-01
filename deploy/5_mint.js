module.exports = async function({ ethers, deployments, getNamedAccounts}) {
    const {execute, log } = deployments;
    const { deployer } = await getNamedAccounts();
    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "mint",
    //     "0x5fA8544AE515FB29BD7700fF8CdAbA8a1e5B5789",
    //     "bafkreibanjb5bjrgie2rzs656svhjbzgamqse6n7xt55ka3zox7byx6tam"
    // )
    // log('minted');
    //
    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "mint",
    //     "0x5fA8544AE515FB29BD7700fF8CdAbA8a1e5B5789",
    //     "bafkreigksds3432lsxq5z4e22zxkltarod3hsxyzo34nwkn2mx7xfmr46q"
    // )
    // log('minted');
    //
    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "mint",
    //     "0x5fA8544AE515FB29BD7700fF8CdAbA8a1e5B5789",
    //     "bafkreid2qka2kawirpoahpdxe2ehe62kd3rspi7h4u7eavrjgxsrbckfrq"
    // )
    // log('minted');

    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "setBaseURI",
    //     "https://",
    // )
    // log("minted")
    //
    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "setTokenURI",
    //     0,
    //     "bafkreibmsrahkrje4ez2qt6pigf2mftiv2qmkploinpf5uxuqfwrfjr2pe.ipfs.cf-ipfs.com"
    // )
    // log("minted")
    await execute(
        "MamonNFT",
        { from: deployer },
        "setTokenURI",
        1,
        "bafkreibkcnc5guoqxmkpknrbx6uv3qgoi4ntfvlnctrnjs6nem64j6c2rq.ipfs.cf-ipfs.com"
    )
    log("minted")
    // await execute(
    //     "MamonNFT",
    //     { from: deployer },
    //     "setTokenURI",
    //     2,
    //     "bafkreihjx4obfl6kbq35vmfqzxe3hd4g2dufeavlkxf5hcdof3uw5uv5cy.ipfs.cf-ipfs.com"
    // )
    // log("minted")
}



module.exports.tags = ["5", "Mint"];
// module.exports.dependencies = ["1"];