const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChainTrace", function () {
  let productNFT, chainTrace, owner, addr1, addr2;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const ProductNFT = await ethers.getContractFactory("ProductNFT");
    productNFT = await ProductNFT.deploy();
    await productNFT.waitForDeployment();

    const ChainTrace = await ethers.getContractFactory("ChainTrace");
    chainTrace = await ChainTrace.deploy(await productNFT.getAddress());
    await chainTrace.waitForDeployment();
  });

  describe("Product Creation", function () {
    it("should create a product and mint NFT", async function () {
      const tx = await chainTrace.createProduct(
        "Test Product",
        "A test product description",
        "Mexico",
        "Test Manufacturer",
        "Electronics",
        "https://example.com/metadata.json"
      );

      const receipt = await tx.wait();
      
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });

      const tokenId = productCreatedEvent.args.tokenId;

      expect(await productNFT.ownerOf(tokenId)).to.equal(owner.address);
      
      const product = await productNFT.getProduct(tokenId);
      expect(product.name).to.equal("Test Product");
      expect(product.description).to.equal("A test product description");
    });
  });

  describe("Traceability Events", function () {
    let tokenId;

    before(async function () {
      const tx = await chainTrace.createProduct(
        "Test Product 2",
        "Description 2",
        "USA",
        "Manufacturer 2",
        "Clothing",
        "https://example.com/metadata2.json"
      );
      const receipt = await tx.wait();
      
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });
      
      tokenId = productCreatedEvent.args.tokenId;
    });

    it("should add traceability event", async function () {
      await chainTrace.addTraceabilityEvent(
        tokenId,
        1,
        "New York Warehouse",
        "Product packaged for shipping"
      );

      const history = await chainTrace.getProductHistory(tokenId);
      expect(history.length).to.equal(2);
      expect(history[1].stage).to.equal(1);
      expect(history[1].location).to.equal("New York Warehouse");
    });
  });

  describe("Product Transfer", function () {
    let tokenId;

    before(async function () {
      const tx = await chainTrace.createProduct(
        "Test Product 3",
        "Description 3",
        "China",
        "Manufacturer 3",
        "Toys",
        "https://example.com/metadata3.json"
      );
      const receipt = await tx.wait();
      
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });
      
      tokenId = productCreatedEvent.args.tokenId;
    });

    it("should transfer product to another address", async function () {
      await productNFT.connect(owner).setApprovalForAll(await chainTrace.getAddress(), true);
      await chainTrace.transferProduct(tokenId, addr1.address);
      
      expect(await productNFT.ownerOf(tokenId)).to.equal(addr1.address);
    });
  });

  describe("Product Verification", function () {
    let tokenId;

    before(async function () {
      const tx = await chainTrace.createProduct(
        "Verified Product",
        "This product is verified",
        "Germany",
        "Verified Manufacturer",
        "Automotive",
        "https://example.com/verified.json"
      );
      const receipt = await tx.wait();
      
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });
      
      tokenId = productCreatedEvent.args.tokenId;
    });

    it("should verify product exists", async function () {
      const [exists, name, ownerAddr, eventCount] = await chainTrace.verifyProduct(tokenId);
      
      expect(exists).to.equal(true);
      expect(name).to.equal("Verified Product");
      expect(ownerAddr).to.equal(owner.address);
      expect(eventCount).to.equal(1);
    });

    it("should return false for non-existent product", async function () {
      const [exists] = await chainTrace.verifyProduct(999);
      expect(exists).to.equal(false);
    });
  });
});