const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const { SuperHDWalletProvider, ManualSignProvider } = require("super-web3-provider");

async function main(network) {

  let provider;
  if (network === 'ropsten_metamask') {
     provider = new ManualSignProvider({
      projectId: '5e81dee85c27530018e59ffb',
      token: '4Z0v6K62Ahu0zKDv/omR/pbB7VO2BLZojt8vM/X9nxRA663AmS8P2pse',
      networkId: '3',
      endpoint: 'https://ropsten.infura.io/v3/58b57895912346bf8aefba3cab0db459',
      from: '0xEA6630F5bfA193f76cfc5F530648061b070e7DAd',
      metadata: {},
    });
  } else {
    provider = new SuperHDWalletProvider({
      projectId: '5e81dee85c27530018e59ffb',
      token: '4Z0v6K62Ahu0zKDv/omR/pbB7VO2BLZojt8vM/X9nxRA663AmS8P2pse',
      mnemonic: 'merge love identify vote modify step tourist inform deliver march tuition retreat',
      networkId: '3',
      provider: 'https://ropsten.infura.io/v3/58b57895912346bf8aefba3cab0db459',
      metadata: {},
    });
  }

  const web3 = new Web3(provider);
  const loader = setupLoader({ provider: web3 }).web3;

  // Load counter information from Artifacts
  const Counter = loader.fromArtifact('Counter');

  // Retrieve accounts from the local node, we will use the first one to send the transaction
  const accounts = await web3.eth.getAccounts();

  // Deploy contract
  const estimateGas = await Counter.deploy().estimateGas();
  const gasPrice = await web3.eth.getGasPrice();

  console.log('\nDeploying contract...');
  const counterInstance = await Counter.deploy()
    .send({ from: accounts[0], gas: estimateGas, gasPrice });

  // Send a transaction to increase() the Counter contract
  console.log('\nIncreasing counter...');
  await counterInstance.methods.increase(20)
    .send({ from: accounts[0], gas: 50000, gasPrice: 1e6 });

  // Call the value() function of the deployed Counter contract
  const value = await counterInstance.methods.value().call();
  console.log(value);

  process.exit();
}

if (require.main === module) {
  const network = process.argv[2];
  main(network);
}
