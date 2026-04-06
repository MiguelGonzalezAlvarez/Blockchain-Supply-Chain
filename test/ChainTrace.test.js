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

  describe("ProductNFT", function () {
    it("should have correct name and symbol", async function () {
      expect(await productNFT.name()).to.equal("ChainTraceProduct");
      expect(await productNFT.symbol()).to.equal("CTP");
    });

    it("should return correct total supply", async function () {
      expect(await productNFT.totalSupply()).to.equal(0n);
    });
  });

  describe("Product Creation", function () {
    it("should create a product and mint NFT", async function () {
      const initialSupply = await productNFT.totalSupply();
      
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
      expect(product.origin).to.equal("Mexico");
      expect(product.manufacturer).to.equal("Test Manufacturer");
      expect(product.category).to.equal("Electronics");
      
      expect(await productNFT.totalSupply()).to.equal(initialSupply + 1n);
    });

    it("should emit ProductCreated event", async function () {
      const tx = await chainTrace.createProduct(
        "Event Test Product",
        "Testing events",
        "USA",
        "Event Manufacturer",
        "Food",
        "https://example.com/event.json"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'ProductCreated');
      
      expect(event).to.not.be.undefined;
      expect(event.args.name).to.equal("Event Test Product");
    });

    it("should initialize product with production stage in history", async function () {
      const tx = await chainTrace.createProduct(
        "History Test Product",
        "Testing history",
        "China",
        "History Manufacturer",
        "Textiles",
        "https://example.com/history.json"
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
      const history = await chainTrace.getProductHistory(tokenId);
      
      expect(history.length).to.equal(1);
      expect(history[0].stage).to.equal(0); // Production
      expect(history[0].location).to.equal("China");
      expect(history[0].description).to.equal("Product manufactured");
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
      expect(history[1].description).to.equal("Product packaged for shipping");
    });

    it("should add multiple events in correct order", async function () {
      await chainTrace.addTraceabilityEvent(tokenId, 2, "Distribution Center", "In storage");
      await chainTrace.addTraceabilityEvent(tokenId, 3, "Shipping Route 66", "In transit");

      const history = await chainTrace.getProductHistory(tokenId);
      expect(history.length).to.equal(4);
      expect(history[2].stage).to.equal(2);
      expect(history[3].stage).to.equal(3);
    });

    it("should fail when non-owner tries to add event", async function () {
      await expect(
        chainTrace.connect(addr1).addTraceabilityEvent(
          tokenId,
          2,
          "Unauthorized Location",
          "This should fail"
        )
      ).to.be.revertedWith("Not the product owner");
    });

    it("should emit EventAdded event", async function () {
      const tx = await chainTrace.addTraceabilityEvent(
        tokenId,
        4,
        "Retail Store",
        "Ready for sale"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'EventAdded');
      
      expect(event).to.not.be.undefined;
      expect(event.args.stage).to.equal(4);
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

    it("should fail when non-owner tries to transfer", async function () {
      const tx = await chainTrace.createProduct(
        "Transfer Test",
        "Testing transfer",
        "Japan",
        "Test Manufacturer",
        "Electronics",
        "https://example.com/transfer.json"
      );
      const receipt = await tx.wait();
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });
      const newTokenId = productCreatedEvent.args.tokenId;

      await expect(
        chainTrace.connect(addr1).transferProduct(newTokenId, addr2.address)
      ).to.be.revertedWith("Not the product owner");
    });

    it("should allow transfer after approval", async function () {
      const tx = await chainTrace.createProduct(
        "Approval Test",
        "Testing approval",
        "Germany",
        "Test Manufacturer",
        "Auto",
        "https://example.com/approval.json"
      );
      const receipt = await tx.wait();
      const productCreatedEvent = receipt.logs.find(log => {
        try {
          return log.fragment && log.fragment.name === 'ProductCreated';
        } catch {
          return false;
        }
      });
      const newTokenId = productCreatedEvent.args.tokenId;

      await productNFT.connect(owner).setApprovalForAll(addr2.address, true);
      await productNFT.connect(addr2).transferFrom(owner.address, addr2.address, newTokenId);
      
      expect(await productNFT.ownerOf(newTokenId)).to.equal(addr2.address);
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

    it("should return correct event count after multiple events", async function () {
      await chainTrace.addTraceabilityEvent(tokenId, 1, "Packaging", "Packaged");
      await chainTrace.addTraceabilityEvent(tokenId, 2, "Warehouse", "Stored");
      
      const [, , , eventCount] = await chainTrace.verifyProduct(tokenId);
      expect(eventCount).to.equal(3);
    });
  });

  describe("Product Info", function () {
    it("should return correct product info", async function () {
      const tx = await chainTrace.createProduct(
        "Info Test Product",
        "Testing info function",
        "Brazil",
        "Info Manufacturer",
        "Coffee",
        "https://example.com/info.json"
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
      const info = await chainTrace.getProductInfo(tokenId);
      
      expect(info.name).to.equal("Info Test Product");
      expect(info.description).to.equal("Testing info function");
      expect(info.origin).to.equal("Brazil");
      expect(info.manufacturer).to.equal("Info Manufacturer");
      expect(info.owner).to.equal(owner.address);
    });
  });

  describe("Role Management", function () {
    it("should assign role to new actor", async function () {
      await chainTrace.assignRole(addr1.address, "Manufacturer");
      
      expect(await chainTrace.authorizedActors(addr1.address)).to.equal(true);
      expect(await chainTrace.actorRoles(addr1.address)).to.equal("Manufacturer");
    });

    it("should only allow owner to assign roles", async function () {
      await expect(
        chainTrace.connect(addr1).assignRole(addr2.address, "Transporter")
      ).to.be.revertedWithCustomError;
    });
  });

  describe("Edge Cases", function () {
    it("should handle empty string fields", async function () {
      const tx = await chainTrace.createProduct(
        "",
        "",
        "",
        "",
        "",
        "https://example.com/empty.json"
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
      const product = await productNFT.getProduct(tokenId);
      
      expect(product.name).to.equal("");
      expect(product.description).to.equal("");
    });

    it("should handle very long strings", async function () {
      const longString = "A".repeat(1000);
      
      const tx = await chainTrace.createProduct(
        longString,
        longString,
        longString,
        longString,
        longString,
        "https://example.com/long.json"
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
      const product = await productNFT.getProduct(tokenId);
      
      expect(product.name).to.equal(longString);
    });
  });
});