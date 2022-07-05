//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { INounsDescriptor } from "./interfaces/INounsDescriptor.sol";
import { INounsSeeder } from "./interfaces/INounsSeeder.sol";

contract SyntheticNouns is ERC721 {

    event NounCreated(uint256 indexed tokenId, INounsSeeder.Seed seed);

    // The Nouns token URI descriptor
    INounsDescriptor public descriptor;

    // The noun seeds
    mapping(uint256 => INounsSeeder.Seed) public seeds;

    // The internal noun ID tracker
    uint256 private _currentNounId;

    constructor(
        INounsDescriptor _descriptor
    ) ERC721('Synthetic Nouns', 'sNOUN') {
        descriptor = _descriptor;
    }

    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 _pseudorandomness) private view returns (INounsSeeder.Seed memory) {
        
        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

        return INounsSeeder.Seed({
            background: uint48(
                uint48(_pseudorandomness) % backgroundCount
            ),
            body: uint48(
                uint48(_pseudorandomness >> 48) % bodyCount
            ),
            accessory: uint48(
                uint48(_pseudorandomness >> 96) % accessoryCount
            ),
            head: uint48(
                uint48(_pseudorandomness >> 144) % headCount
            ),
            glasses: uint48(
                uint48(_pseudorandomness >> 192) % glassesCount
            )
        });
    }

    // TODO: Rename to getRandomness
    function getTokenID(address _address) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_address)));
    }

    /**
     * @notice Mint a Noun to the minter, along with a possible nounders reward
     * Noun. Nounders reward Nouns are minted every 10 Nouns, starting at 0,
     * until 183 nounder Nouns have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public returns (uint256) {
        // TODO: Check if account has already minted one
        return _mintTo(msg.sender, _currentNounId++);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 _tokenId) public override view returns (string memory) {
        require(_exists(_tokenId), 'NounsToken: URI query for nonexistent token');
        return descriptor.tokenURI(_tokenId, seeds[_tokenId]);
    }

    /**
     * @notice Mint a Noun with `nounId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 nounId) internal returns (uint256) {
        INounsSeeder.Seed memory seed = seeds[nounId] = generateSeed(getTokenID(to));

        _mint(to, nounId);
        emit NounCreated(nounId, seed);

        return nounId;
    }

}