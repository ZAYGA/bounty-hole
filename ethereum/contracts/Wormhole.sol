// contracts/Wormhole.sol
// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract Wormhole is ERC1967Proxy {
    constructor (address setup, bytes memory initData) ERC1967Proxy(
        setup,
        initData
    ) { }
}