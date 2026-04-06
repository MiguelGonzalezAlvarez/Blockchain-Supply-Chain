const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ProductNFT...");
  
  const ProductNFT = await ethers.getContractFactory("ProductNFT");
  const productNFT = await ProductNFT.deploy();
  await productNFT.waitForDeployment();
  
  const productNFTAddress = await productNFT.getAddress();
  console.log("ProductNFT deployed to:", productNFTAddress);
  
  console.log("\nDeploying ChainTrace...");
  
  const ChainTrace = await ethers.getContractFactory("ChainTrace");
  const chainTrace = await ChainTrace.deploy(productNFTAddress);
  await chainTrace.waitForDeployment();
  
  const chainTraceAddress = await chainTrace.getAddress();
  console.log("ChainTrace deployed to:", chainTraceAddress);
  
  console.log("\n=== Deployment Summary ===");
  console.log("ProductNFT:", productNFTAddress);
  console.log("ChainTrace:", chainTraceAddress);
  console.log("===========================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });