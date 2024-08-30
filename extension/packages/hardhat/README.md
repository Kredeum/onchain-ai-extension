# OnChainAI

## Onchain `OpenAI` with `Chainlink` Functions

## Description

- `OnChainAI extension` is a Scaffold-eth-2 extension, allowing you to developp Dapps using `OpenAI GPT4`
- `OnChainAI` protocol is an onchain solution for any smartcontracts to make AI calls.

- `OnChainAI` uses `OpenAI GPT4o-mini` with `Chainlink Functions`.
Each `OpenAI` request launched by `OnChainAI` is send by multiple `Chainlink` servers that have to reach consensus to return a unique answer. `Chainlink` answer can be retreive only after few blocks, and make took more than one minute, it depends on the network.


- `OnChainAI` is not free (on mainnet) as `Chainlink` requires some `LINK` tokens and `OpenAPI` requires some `$`.
Default model will be a fixed price of `0,0002 eth` per request.
BUT this will be changed in the future to a more dynamic pricing model.

- You can use `OnChainAI` protocol as is, with the contracts already deployed, or you can deployed your own, where you will be able to set your own configuration, and decide for the price of AI requests.

- `OnChainAI extension` is available with an `Hardhat` setup with 3 specific AI tasks to help you to start with `OnChainAI` protocol.


## Install

Install via this command:
```sh
$ npx create-eth@latest -e kredeum/onchain-ai
```

Then run the following commands to initialize the new repo,
```sh
$ cd <your new repo>
$ ./init.sh
```

Finally the classic Scaffold-eth-2 commands in 3 different terminals:
```sh
$ yarn chain
```
```sh
$ yarn deploy
```
```sh
$ yarn start
```

In all these commands use `--network <NETWORK>` to specify the network you want to use.

## Hardhat tasks

You can run hardhat AI task with `yarn hardhat ai <TASK> --network <NETWORK>``

3 tasks available : `request`, `secrets`, `config`

### request

### secrets

### config


## Limitations

- `Chainlink Functions` is currently in `beta` so as `OnChainAI` is.

- `OpenAi` prompt must be kept simple, as `Chainlink Functions` has a limited memory capacity

- `OpenAI` answer must very short, in order for `Chainlink Functions` to be able to reach a consensus on an answer.
i.e. you can ask '13 time 5 equal ?' but not ask 'Tell me a story'.
And you can add to your prompt some requirements as: answer with  `one word`, `YES or NO` or `true or false`...


## Roadmap
- deploy on Mainnet: requires some tuning on requested price, using some `Chainlink Oracle Price feed`
- implement other AI models : `Mistral`, `Claude`, `Lama3` and other `OpenAI` models
- deploy `OnChainAI` on all networks supported by `Chainlink Functions` (curently as of August 2024 : Ethereum, Arbitrum, Base, Optimism, Polygon, Avalanche)
- deploy with same address on all networks
- setup an foundry extension too
