const hre = require("hardhat");
require("dotenv").config();

const ISSUER_ADDRESS =
  process.env.ISSUER_WALLET_ADDRESS ||
  "0x8c0BfDecAaEEadCba45EFA5de95F5d5f61136302";

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ||
  "0xb1E4d3E5FE855b1cbB4F454E69be4E904fD1571A";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Contract owner / caller:", deployer.address);
  console.log("Contract:", CONTRACT_ADDRESS);
  console.log("Adding issuer:", ISSUER_ADDRESS);

  const contract = await hre.ethers.getContractAt(
    "CertificateVerification",
    CONTRACT_ADDRESS,
    deployer
  );

  const alreadyAuthorized = await contract.isAuthorizedIssuer(ISSUER_ADDRESS);
  if (alreadyAuthorized) {
    console.log("Issuer is already authorized.");
    return;
  }

  const tx = await contract.addIssuer(ISSUER_ADDRESS);
  console.log("Transaction sent:", tx.hash);
  await tx.wait();
  console.log("Issuer authorized successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
