const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const { SuperHDWalletProvider, ManualSignProvider } = require("super-web3-provider");

async function main() {
  const rinkebyProvider = new SuperHDWalletProvider({
      projectId: '5e81dee85c27530018e59ffb',
      token: '4Z0v6K62Ahu0zKDv/omR/pbB7VO2BLZojt8vM/X9nxRA663AmS8P2pse',
      mnemonic: 'merge love identify vote modify step tourist inform deliver march tuition retreat',
      networkId: '4',
      provider: "https://rinkeby.infura.io/v3/14a9bebf5c374938b2476abe29ca5564",
      metadata: {},
  });

  // const web3 = new Web3(process.env.PROVIDER_URL || 'http://localhost:8545');
  const web3 = new Web3(rinkebyProvider);
  const loader = setupLoader({ provider: web3 }).web3;

  // Load counter information from Artifacts
  const Counter = loader.fromArtifact('Counter');

  // Retrieve accounts from the local node, we will use the first one to send the transaction
  const accounts = await web3.eth.getAccounts();

  // Deploy contract
  const counterInstance = await Counter.deploy().send({ from: accounts[0] });

  // Send a transaction to increase() the Counter contract
  await counterInstance.methods.increase(20)
    .send({ from: accounts[0], gas: 50000, gasPrice: 1e6 });

  // Call the value() function of the deployed Counter contract
  const value = await counterInstance.methods.value().call();
  console.log(value);
}

if (require.main === module) {
  main();
}
