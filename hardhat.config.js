/** @format */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ganache");
require("hardhat-deploy");
// require("hardhat-deploy-ethers");
// require("hardhat-abi-exporter");
require("dotenv").config();


const AVALANCHE_MAINNET_URL = process.env.AVALANCHE_MAINNET_URL;
const AVALANCHE_FUJI_URL = process.env.AVALANCHE_FUJI_URL;

const FORK_URL = process.env.FORK_URL;
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;


// Default Hardhat network config
let hardhatConfig = {
  chainId: 43113,
  gasPrice: 225000000000,
  live: false,
  saveDeployments: true,
};

// If FORK_URL env var is set, enable forking on Hardhat network
// Documentation: https://hardhat.org/hardhat-network/#mainnet-forking
if (FORK_URL && FORK_URL.length > 0) {
  hardhatConfig.forking = {};
  hardhatConfig.forking.url = FORK_URL;
  // If FORK_BLOCK_NUMBER env var is set, create fork from specific block
  if (FORK_BLOCK_NUMBER && parseInt(FORK_BLOCK_NUMBER)) {
    hardhatConfig.forking.blockNumber = parseInt(FORK_BLOCK_NUMBER);
  }
}

let fujiConfig = {
  url: AVALANCHE_FUJI_URL,
  chainId: 43113,
  live: true,
  saveDeployments: true,
};

let mainnetConfig = {
  url: AVALANCHE_MAINNET_URL,
  chainId: 43114,
  live: true,
  saveDeployments: true,
};

let ropstenConfig = {
  url: "https://eth-ropsten.alchemyapi.io/v2/c-ZQMMJFsvZNjZW1LRWwnOKxZcR2N2Lq",
  accounts: ["efd29d498065e5ee46eb9e335b6c5f4e5aac03687a86f675ea4914556fbda8d2"]
}

if (DEPLOYER_PRIVATE_KEY && DEPLOYER_PRIVATE_KEY.length > 0) {
  fujiConfig.accounts = [DEPLOYER_PRIVATE_KEY];
  mainnetConfig.accounts = [DEPLOYER_PRIVATE_KEY];

  // if (TOKEN_DEPLOYER_PRIVATE_KEY && TOKEN_DEPLOYER_PRIVATE_KEY.length > 0) {
  //   fujiConfig.accounts.push(TOKEN_DEPLOYER_PRIVATE_KEY);
  //   mainnetConfig.accounts.push(TOKEN_DEPLOYER_PRIVATE_KEY);
  // }
}

// Hardhat Config
// Documentation: https://hardhat.org/config/
// Deploy add-ons: https://hardhat.org/plugins/hardhat-deploy.html
module.exports = {
  solidity: {
    compilers:[
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 350000,
  },
  defaultNetwork: "ropsten",
  // defaultNetwork: "hardhat",
  networks: {
    hardhat: hardhatConfig,
    fuji: fujiConfig,
    mainnet: mainnetConfig,
    ropsten: ropstenConfig,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    deploy: "deploy",
    deployments: "deployments",
    imports: `imports`,
  },
  abiExporter: {
    path: "./abis",
    clear: true,
    flat: true,
  },
  gasReporter: {
    enabled: true,
    showTimeSpent: true,
  },
};
