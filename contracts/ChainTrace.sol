// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ProductNFT.sol";

contract ChainTrace is Ownable {
    ProductNFT public productNFT;

    enum Stage { Production, Packaging, Storage, Transport, Distribution, Delivered }

    struct TraceabilityEvent {
        uint256 productId;
        Stage stage;
        string location;
        string description;
        address actor;
        uint256 timestamp;
    }

    struct ProductInfo {
        uint256 tokenId;
        string name;
        string description;
        string origin;
        string manufacturer;
        address owner;
        uint256 createTime;
    }

    mapping(uint256 => TraceabilityEvent[]) public productHistory;
    mapping(address => bool) public authorizedActors;
    mapping(address => string) public actorRoles;

    event ProductCreated(uint256 indexed tokenId, address indexed manufacturer, string name);
    event EventAdded(uint256 indexed productId, Stage stage, address indexed actor, string location);
    event RoleAssigned(address indexed actor, string role);

    constructor(address _productNFT) {
        productNFT = ProductNFT(_productNFT);
        authorizedActors[msg.sender] = true;
    }

    function setProductNFT(address _productNFT) external onlyOwner {
        productNFT = ProductNFT(_productNFT);
    }

    function assignRole(address _actor, string memory _role) external onlyOwner {
        authorizedActors[_actor] = true;
        actorRoles[_actor] = _role;
        emit RoleAssigned(_actor, _role);
    }

    function createProduct(
        string memory name,
        string memory description,
        string memory origin,
        string memory manufacturer,
        string memory category,
        string memory tokenURI
    ) external returns (uint256) {
        uint256 tokenId = productNFT.createProduct(
            msg.sender,
            name,
            description,
            origin,
            block.timestamp,
            manufacturer,
            category,
            tokenURI
        );

        productHistory[tokenId].push(TraceabilityEvent({
            productId: tokenId,
            stage: Stage.Production,
            location: origin,
            description: "Product manufactured",
            actor: msg.sender,
            timestamp: block.timestamp
        }));

        emit ProductCreated(tokenId, msg.sender, name);
        return tokenId;
    }

    function addTraceabilityEvent(
        uint256 productId,
        Stage stage,
        string memory location,
        string memory description
    ) external {
        require(productNFT.ownerOf(productId) == msg.sender, "Not the product owner");

        productHistory[productId].push(TraceabilityEvent({
            productId: productId,
            stage: stage,
            location: location,
            description: description,
            actor: msg.sender,
            timestamp: block.timestamp
        }));

        emit EventAdded(productId, stage, msg.sender, location);
    }

    function transferProduct(uint256 productId, address to) external {
        require(productNFT.ownerOf(productId) == msg.sender, "Not the product owner");
        productNFT.transferFrom(msg.sender, to, productId);
    }

    function getProductHistory(uint256 productId) external view returns (TraceabilityEvent[] memory) {
        return productHistory[productId];
    }

    function getProductInfo(uint256 productId) external view returns (ProductInfo memory) {
        ProductNFT.Product memory nftProduct = productNFT.getProduct(productId);
        return ProductInfo({
            tokenId: productId,
            name: nftProduct.name,
            description: nftProduct.description,
            origin: nftProduct.origin,
            manufacturer: nftProduct.manufacturer,
            owner: productNFT.ownerOf(productId),
            createTime: nftProduct.manufactureDate
        });
    }

    function getTotalProducts() external view returns (uint256) {
        return productNFT.totalSupply();
    }

    function verifyProduct(uint256 productId) external view returns (
        bool exists,
        string memory name,
        address owner,
        uint256 eventCount
    ) {
        try productNFT.ownerOf(productId) returns (address _owner) {
            ProductNFT.Product memory nftProduct = productNFT.getProduct(productId);
            return (true, nftProduct.name, _owner, productHistory[productId].length);
        } catch {
            return (false, "", address(0), 0);
        }
    }
}