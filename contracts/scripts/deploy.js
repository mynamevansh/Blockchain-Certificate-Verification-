const hre = require("hardhat");
const fs = require("fs");

function getBlockExplorerUrl(chainId, address) {
  const explorers = {
    1: `https://etherscan.io/address/${address}`,
    5: `https://goerli.etherscan.io/address/${address}`,
    11155111: `https://sepolia.etherscan.io/address/${address}`,
    137: `https://polygonscan.com/address/${address}`,
    80001: `https://mumbai.polygonscan.com/address/${address}`,
    56: `https://bscscan.com/address/${address}`,
    97: `https://testnet.bscscan.com/address/${address}`,
  };
  return explorers[chainId.toString()] || `Chain ID ${chainId}: ${address}`;
}

async function main() {
  console.log("Starting deployment of CertificateVerification contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const network = await hre.ethers.provider.getNetwork();

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("");

  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );
  const contract = await CertificateVerification.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const owner = await contract.owner();
  const isAuthorized = await contract.authorizedIssuers(deployer.address);

  console.log("Deployment successful");
  console.log("Contract address:", contractAddress);
  console.log("Contract owner:", owner);
  console.log("Deployer is authorized issuer:", isAuthorized);
  console.log("Block explorer:", getBlockExplorerUrl(network.chainId, contractAddress));

  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contractAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockExplorer: getBlockExplorerUrl(network.chainId, contractAddress),
    contractName: "CertificateVerification",
  };

  fs.mkdirSync("./deployments", { recursive: true });
  const deploymentPath = `./deployments/deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  fs.writeFileSync(
    ".env.deployment",
    `CONTRACT_ADDRESS=${contractAddress}\nDEPLOYER_ADDRESS=${deployer.address}\n`
  );

  console.log("Deployment info saved to:", deploymentPath);
  console.log("\nUpdate CONTRACT_ADDRESS in contracts/.env and client config.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

module.exports = { main };
