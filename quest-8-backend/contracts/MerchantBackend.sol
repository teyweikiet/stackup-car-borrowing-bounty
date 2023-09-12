// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaResponseCodes.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/IHederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/HederaTokenService.sol";
import "https://github.com/hashgraph/hedera-smart-contracts/blob/v0.2.0/contracts/hts-precompile/ExpiryHelper.sol";

contract MerchantBackend is ExpiryHelper {
    event CreatedToken(address tokenAddress);
    event MintedToken(int64[] serialNumbers);
    event Response(int response);
    event TotalPayment(uint256 payment, uint256 value);

    address public ftAddress;
    address public owner;

    struct Car {
        uint256 dailyRate;
        uint256 deposit;
        uint256 returnBy;
    }

    mapping(int64 => Car) public cars;

    constructor() payable {
        IHederaTokenService.HederaToken memory token;
        token.name = "Reputation Tokens";
        token.symbol = "REP";
        token.memo = "REP Tokens By: kit-t";
        token.treasury = address(this);
        token.expiry = createAutoRenewExpiry(address(this), 7000000);

        (int responseCode, address tokenAddress) = HederaTokenService
            .createFungibleToken(token, 1000, 0);

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert();
        }

        ftAddress = tokenAddress;
        owner = msg.sender;
        emit CreatedToken(tokenAddress);
    }

    function createNFT(
        string memory name,
        string memory symbol
    ) external payable {
        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](1);

        // Set this contract as supply
        keys[0] = getSingleKey(
            KeyType.SUPPLY,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = "CAR Collection By: kit-t";
        token.treasury = address(this);
        token.tokenSupplyType = true; // set supply to FINITE
        token.maxSupply = 10;
        token.tokenKeys = keys;
        token.freezeDefault = false;
        token.expiry = createAutoRenewExpiry(address(this), 7000000);

        (int responseCode, address createdToken) = HederaTokenService
            .createNonFungibleToken(token);

        if (responseCode != HederaResponseCodes.SUCCESS) {
            revert("Failed to create non-fungible token");
        }

        emit CreatedToken(createdToken);
    }

    function mintNFT(
        address token,
        bytes[] memory metadata,
        uint256 _deposit,
        uint256 _dailyRate
    ) external {
        (int response, , int64[] memory serial) = HederaTokenService.mintToken(
            token,
            0,
            metadata
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to mint non-fungible token");
        }

        for (uint i = 0; i < serial.length; i++) {
            cars[serial[i]].deposit = _deposit;
            cars[serial[i]].dailyRate = _dailyRate;
        }

        emit MintedToken(serial);
    }

    function borrowing(
        address nftAddress,
        int64 serial,
        uint256 duration
    ) external payable {
        // calculate total amount due
        uint256 totalPayment = ((cars[serial].dailyRate * duration) +
            cars[serial].deposit) / (10 ** 10);

        emit TotalPayment(totalPayment, msg.value);
        // Check if customer transfers the correct amount
        require(msg.value == totalPayment, "Incorrect amount");

        // Transfer NFT to customer
        int response = HederaTokenService.transferNFT(
            nftAddress,
            address(this),
            msg.sender,
            serial
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to transfer non-fungible token");
        }

        // set returnBy date
        cars[serial].returnBy = block.timestamp + (duration * 24 * 3600);
        emit Response(response);
    }

    function returning(address nftAddress, int64 serial) external {
        // Return NFT from customer
        int response = HederaTokenService.transferNFT(
            nftAddress,
            msg.sender,
            address(this),
            serial
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to transfer non-fungible token");
        }

        // Return deposit HBAR to customer
        payable(msg.sender).transfer(cars[serial].deposit / (10 ** 10));

        // reset returnBy
        cars[serial].returnBy = 0;

        emit Response(response);
    }

    function scoring(address receiver, int64 amount) external {
        require(msg.sender == owner, "Not owner");
        require(amount <= 5, "Only can allocate up to 5 REP tokens");

        int response = HederaTokenService.transferToken(
            ftAddress,
            address(this),
            receiver,
            amount
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Transfer Failed");
        }

        emit Response(response);
    }
}
