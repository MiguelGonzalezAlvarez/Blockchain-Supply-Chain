// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct Product {
        string name;
        string description;
        string origin;
        uint256 manufactureDate;
        string manufacturer;
        string category;
        string tokenURI;
    }

    mapping(uint256 => Product) public products;

    constructor() ERC721("ChainTraceProduct", "CTP") Ownable() {}

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    function createProduct(
        address to,
        string memory name,
        string memory description,
        string memory origin,
        uint256 manufactureDate,
        string memory manufacturer,
        string memory category,
        string memory uri
    ) public returns (uint256) {
        uint256 newTokenId = _nextTokenId++;
        _safeMint(to, newTokenId);

        products[newTokenId] = Product({
            name: name,
            description: description,
            origin: origin,
            manufactureDate: manufactureDate,
            manufacturer: manufacturer,
            category: category,
            tokenURI: uri
        });

        return newTokenId;
    }

    function getProduct(uint256 tokenId) public view returns (Product memory) {
        require(_exists(tokenId), "Product does not exist");
        return products[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public override {
        super.setApprovalForAll(operator, approved);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        super.safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        super.transferFrom(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return products[tokenId].tokenURI;
    }
}