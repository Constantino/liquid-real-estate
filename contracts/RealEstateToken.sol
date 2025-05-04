// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts@5.3.0/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts@5.3.0/access/Ownable.sol";

contract RealEstateToken is ERC1155, Ownable {
    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    uint256 private _nextTokenId;
    mapping(uint256 => string) public idToCid;

    function mint(
        address account,
        uint256 amount,
        string memory cid,
        bytes memory data
    ) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        idToCid[tokenId] = cid;
        _mint(account, tokenId, amount, data);
    }

    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked("https://ipfs.io/ipfs/", idToCid[_tokenId])
            );
    }
}
