# Yield Blizzard

Automated yield farming strategies for Avalanche.

*  [Web](https://yieldblizzard.com/)
*  [Twitter](https://twitter.com/yieldblizzard_)
*  [Telegram](https://t.me/yieldblizzard)

# Getting Started

```
npm install
cp .env.sample .env
npx hardhat compile
```

# Architecture

## BlizzardStrategies

BlizzardStrategies are an autocompounding primitive. They are designed to be platform-neutral and maximize returns to users from compounding strategies.

BlizzardStrategies are designed to bootstrap growth with fees that may be changed based on ecosystem conditions.

Developers can generate revenue by writing BlizzardStrategies.

#### Developing New Strategies

Strategies should inherit from `BlizzardStrategy.sol`. Most strategies will:

1. Accept deposits
2. Process withdraws
3. Handle compounding
4. Take a fee

Strategies should implement the necessary behavior to generate a return on deposits.

Strategy developers have the ultimate control over functionality. Yield Blizzard may choose to support the underlying strategies with platform integrations.

## BlizzardVaults

BlizzardVaults are designed to be flexible user interfaces for BlizzardStrategies. BlizzardVaults may be comprised of many BlizzardStrategies.

#### Example Implementation

The example implementation `BlizzardVault.sol` is a managed vault, designed to meet user preferences for risk/reward based on a manager.

Most BlizzardVaults will:

1. Accept multiple deposit types
2. Process withdraws
3. Manage rebalances
4. Take a fee
