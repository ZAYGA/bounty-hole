pragma solidity ^0.8.19;

library BytesParsing {
  uint256 private constant freeMemoryPtr = 0x40;
  uint256 private constant wordSize = 32;

  error OutOfBounds(uint256 offset, uint256 length);

  function checkBound(uint offset, uint length) internal pure {
    if (offset > length)
      revert OutOfBounds(offset, length);
  }

  function sliceUnchecked(
    bytes memory encoded,
    uint offset,
    uint length
  ) internal pure returns (bytes memory ret, uint nextOffset) {
    //bail early for degenerate case
    if (length == 0)
      return (new bytes(0), offset);

    assembly ("memory-safe") {
      nextOffset := add(offset, length)
      ret := mload(freeMemoryPtr)

      //Explanation on how we copy data here:
      //  The bytes type has the following layout in memory:
      //    [length: 32 bytes, data: length bytes]
      //  So if we allocate `bytes memory foo = new bytes(1);` then `foo` will be a pointer to 33
      //    bytes where the first 32 bytes contain the length and the last byte is the actual data.
      //  Since mload always loads 32 bytes of memory at once, we use our shift variable to align
      //    our reads so that our last read lines up exactly with the last 32 bytes of `encoded`.
      //  However this also means that if the length of `encoded` is not a multiple of 32 bytes, our
      //    first read will necessarily partly contain bytes from `encoded`'s 32 length bytes that
      //    will be written into the length part of our `ret` slice.
      //  We remedy this issue by writing the length of our `ret` slice at the end, thus
      //    overwritting those garbage bytes.
      let shift := and(length, 31) //equivalent to `mod(length, 32)` but 2 gas cheaper
      if iszero(shift) {
        shift := wordSize
      }

      let dest := add(ret, shift)
      let end := add(dest, length)
      for {
        let src := add(add(encoded, shift), offset)
      } lt(dest, end) {
        src := add(src, wordSize)
        dest := add(dest, wordSize)
      } {
        mstore(dest, mload(src))
      }

      mstore(ret, length)
      //When compiling with --via-ir then normally allocated memory (i.e. via new) will have 32 byte
      //  memory alignment and so we enforce the same memory alignment here.
      mstore(freeMemoryPtr, and(add(dest, 31), not(31)))
    }
  }

  function slice(
    bytes memory encoded,
    uint offset,
    uint length
  ) internal pure returns (bytes memory ret, uint nextOffset) {
    (ret, nextOffset) = sliceUnchecked(encoded, offset, length);
    checkBound(nextOffset, encoded.length);
  }

  function asAddressUnchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (address, uint) {
    (uint160 ret, uint nextOffset) = asUint160(encoded, offset);
    return (address(ret), nextOffset);
  }

  function asAddress(
    bytes memory encoded,
    uint offset
  ) internal pure returns (address ret, uint nextOffset) {
    (ret, nextOffset) = asAddressUnchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBoolUnckecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bool, uint) {
    (uint8 ret, uint nextOffset) = asUint8(encoded, offset);
    return (ret != 0, nextOffset);
  }

  function asBool(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bool ret, uint nextOffset) {
    (ret, nextOffset) = asBoolUnckecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

/* -------------------------------------------------------------------------------------------------
Remaining library code below was auto-generated by via the following js/node code:

for (let bytes = 1; bytes <= 32; ++bytes) {
  const bits = bytes*8;
  console.log(
`function asUint${bits}Unchecked(
  bytes memory encoded,
  uint offset
) internal pure returns (uint${bits} ret, uint nextOffset) {
  assembly ("memory-safe") {
    nextOffset := add(offset, ${bytes})
    ret := mload(add(encoded, nextOffset))
  }
  return (ret, nextOffset);
}

function asUint${bits}(
  bytes memory encoded,
  uint offset
) internal pure returns (uint${bits} ret, uint nextOffset) {
  (ret, nextOffset) = asUint${bits}Unchecked(encoded, offset);
  checkBound(nextOffset, encoded.length);
}

function asBytes${bytes}Unchecked(
  bytes memory encoded,
  uint offset
) internal pure returns (bytes${bytes}, uint) {
  (uint${bits} ret, uint nextOffset) = asUint${bits}Unchecked(encoded, offset);
  return (bytes${bytes}(ret), nextOffset);
}

function asBytes${bytes}(
  bytes memory encoded,
  uint offset
) internal pure returns (bytes${bytes}, uint) {
  (uint${bits} ret, uint nextOffset) = asUint${bits}(encoded, offset);
  return (bytes${bytes}(ret), nextOffset);
}
`
  );
}
------------------------------------------------------------------------------------------------- */

  function asUint8Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint8 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 1)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint8(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint8 ret, uint nextOffset) {
    (ret, nextOffset) = asUint8Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes1Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes1, uint) {
    (uint8 ret, uint nextOffset) = asUint8Unchecked(encoded, offset);
    return (bytes1(ret), nextOffset);
  }

  function asBytes1(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes1, uint) {
    (uint8 ret, uint nextOffset) = asUint8(encoded, offset);
    return (bytes1(ret), nextOffset);
  }

  function asUint16Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint16 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 2)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint16(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint16 ret, uint nextOffset) {
    (ret, nextOffset) = asUint16Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes2Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes2, uint) {
    (uint16 ret, uint nextOffset) = asUint16Unchecked(encoded, offset);
    return (bytes2(ret), nextOffset);
  }

  function asBytes2(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes2, uint) {
    (uint16 ret, uint nextOffset) = asUint16(encoded, offset);
    return (bytes2(ret), nextOffset);
  }

  function asUint24Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint24 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 3)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint24(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint24 ret, uint nextOffset) {
    (ret, nextOffset) = asUint24Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes3Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes3, uint) {
    (uint24 ret, uint nextOffset) = asUint24Unchecked(encoded, offset);
    return (bytes3(ret), nextOffset);
  }

  function asBytes3(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes3, uint) {
    (uint24 ret, uint nextOffset) = asUint24(encoded, offset);
    return (bytes3(ret), nextOffset);
  }

  function asUint32Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint32 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 4)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint32(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint32 ret, uint nextOffset) {
    (ret, nextOffset) = asUint32Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes4Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes4, uint) {
    (uint32 ret, uint nextOffset) = asUint32Unchecked(encoded, offset);
    return (bytes4(ret), nextOffset);
  }

  function asBytes4(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes4, uint) {
    (uint32 ret, uint nextOffset) = asUint32(encoded, offset);
    return (bytes4(ret), nextOffset);
  }

  function asUint40Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint40 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 5)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint40(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint40 ret, uint nextOffset) {
    (ret, nextOffset) = asUint40Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes5Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes5, uint) {
    (uint40 ret, uint nextOffset) = asUint40Unchecked(encoded, offset);
    return (bytes5(ret), nextOffset);
  }

  function asBytes5(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes5, uint) {
    (uint40 ret, uint nextOffset) = asUint40(encoded, offset);
    return (bytes5(ret), nextOffset);
  }

  function asUint48Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint48 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 6)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint48(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint48 ret, uint nextOffset) {
    (ret, nextOffset) = asUint48Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes6Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes6, uint) {
    (uint48 ret, uint nextOffset) = asUint48Unchecked(encoded, offset);
    return (bytes6(ret), nextOffset);
  }

  function asBytes6(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes6, uint) {
    (uint48 ret, uint nextOffset) = asUint48(encoded, offset);
    return (bytes6(ret), nextOffset);
  }

  function asUint56Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint56 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 7)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint56(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint56 ret, uint nextOffset) {
    (ret, nextOffset) = asUint56Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes7Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes7, uint) {
    (uint56 ret, uint nextOffset) = asUint56Unchecked(encoded, offset);
    return (bytes7(ret), nextOffset);
  }

  function asBytes7(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes7, uint) {
    (uint56 ret, uint nextOffset) = asUint56(encoded, offset);
    return (bytes7(ret), nextOffset);
  }

  function asUint64Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint64 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 8)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint64(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint64 ret, uint nextOffset) {
    (ret, nextOffset) = asUint64Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes8Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes8, uint) {
    (uint64 ret, uint nextOffset) = asUint64Unchecked(encoded, offset);
    return (bytes8(ret), nextOffset);
  }

  function asBytes8(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes8, uint) {
    (uint64 ret, uint nextOffset) = asUint64(encoded, offset);
    return (bytes8(ret), nextOffset);
  }

  function asUint72Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint72 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 9)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint72(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint72 ret, uint nextOffset) {
    (ret, nextOffset) = asUint72Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes9Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes9, uint) {
    (uint72 ret, uint nextOffset) = asUint72Unchecked(encoded, offset);
    return (bytes9(ret), nextOffset);
  }

  function asBytes9(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes9, uint) {
    (uint72 ret, uint nextOffset) = asUint72(encoded, offset);
    return (bytes9(ret), nextOffset);
  }

  function asUint80Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint80 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 10)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint80(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint80 ret, uint nextOffset) {
    (ret, nextOffset) = asUint80Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes10Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes10, uint) {
    (uint80 ret, uint nextOffset) = asUint80Unchecked(encoded, offset);
    return (bytes10(ret), nextOffset);
  }

  function asBytes10(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes10, uint) {
    (uint80 ret, uint nextOffset) = asUint80(encoded, offset);
    return (bytes10(ret), nextOffset);
  }

  function asUint88Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint88 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 11)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint88(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint88 ret, uint nextOffset) {
    (ret, nextOffset) = asUint88Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes11Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes11, uint) {
    (uint88 ret, uint nextOffset) = asUint88Unchecked(encoded, offset);
    return (bytes11(ret), nextOffset);
  }

  function asBytes11(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes11, uint) {
    (uint88 ret, uint nextOffset) = asUint88(encoded, offset);
    return (bytes11(ret), nextOffset);
  }

  function asUint96Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint96 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 12)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint96(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint96 ret, uint nextOffset) {
    (ret, nextOffset) = asUint96Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes12Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes12, uint) {
    (uint96 ret, uint nextOffset) = asUint96Unchecked(encoded, offset);
    return (bytes12(ret), nextOffset);
  }

  function asBytes12(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes12, uint) {
    (uint96 ret, uint nextOffset) = asUint96(encoded, offset);
    return (bytes12(ret), nextOffset);
  }

  function asUint104Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint104 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 13)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint104(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint104 ret, uint nextOffset) {
    (ret, nextOffset) = asUint104Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes13Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes13, uint) {
    (uint104 ret, uint nextOffset) = asUint104Unchecked(encoded, offset);
    return (bytes13(ret), nextOffset);
  }

  function asBytes13(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes13, uint) {
    (uint104 ret, uint nextOffset) = asUint104(encoded, offset);
    return (bytes13(ret), nextOffset);
  }

  function asUint112Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint112 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 14)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint112(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint112 ret, uint nextOffset) {
    (ret, nextOffset) = asUint112Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes14Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes14, uint) {
    (uint112 ret, uint nextOffset) = asUint112Unchecked(encoded, offset);
    return (bytes14(ret), nextOffset);
  }

  function asBytes14(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes14, uint) {
    (uint112 ret, uint nextOffset) = asUint112(encoded, offset);
    return (bytes14(ret), nextOffset);
  }

  function asUint120Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint120 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 15)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint120(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint120 ret, uint nextOffset) {
    (ret, nextOffset) = asUint120Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes15Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes15, uint) {
    (uint120 ret, uint nextOffset) = asUint120Unchecked(encoded, offset);
    return (bytes15(ret), nextOffset);
  }

  function asBytes15(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes15, uint) {
    (uint120 ret, uint nextOffset) = asUint120(encoded, offset);
    return (bytes15(ret), nextOffset);
  }

  function asUint128Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint128 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 16)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint128(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint128 ret, uint nextOffset) {
    (ret, nextOffset) = asUint128Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes16Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes16, uint) {
    (uint128 ret, uint nextOffset) = asUint128Unchecked(encoded, offset);
    return (bytes16(ret), nextOffset);
  }

  function asBytes16(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes16, uint) {
    (uint128 ret, uint nextOffset) = asUint128(encoded, offset);
    return (bytes16(ret), nextOffset);
  }

  function asUint136Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint136 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 17)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint136(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint136 ret, uint nextOffset) {
    (ret, nextOffset) = asUint136Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes17Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes17, uint) {
    (uint136 ret, uint nextOffset) = asUint136Unchecked(encoded, offset);
    return (bytes17(ret), nextOffset);
  }

  function asBytes17(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes17, uint) {
    (uint136 ret, uint nextOffset) = asUint136(encoded, offset);
    return (bytes17(ret), nextOffset);
  }

  function asUint144Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint144 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 18)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint144(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint144 ret, uint nextOffset) {
    (ret, nextOffset) = asUint144Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes18Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes18, uint) {
    (uint144 ret, uint nextOffset) = asUint144Unchecked(encoded, offset);
    return (bytes18(ret), nextOffset);
  }

  function asBytes18(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes18, uint) {
    (uint144 ret, uint nextOffset) = asUint144(encoded, offset);
    return (bytes18(ret), nextOffset);
  }

  function asUint152Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint152 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 19)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint152(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint152 ret, uint nextOffset) {
    (ret, nextOffset) = asUint152Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes19Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes19, uint) {
    (uint152 ret, uint nextOffset) = asUint152Unchecked(encoded, offset);
    return (bytes19(ret), nextOffset);
  }

  function asBytes19(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes19, uint) {
    (uint152 ret, uint nextOffset) = asUint152(encoded, offset);
    return (bytes19(ret), nextOffset);
  }

  function asUint160Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint160 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 20)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint160(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint160 ret, uint nextOffset) {
    (ret, nextOffset) = asUint160Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes20Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes20, uint) {
    (uint160 ret, uint nextOffset) = asUint160Unchecked(encoded, offset);
    return (bytes20(ret), nextOffset);
  }

  function asBytes20(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes20, uint) {
    (uint160 ret, uint nextOffset) = asUint160(encoded, offset);
    return (bytes20(ret), nextOffset);
  }

  function asUint168Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint168 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 21)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint168(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint168 ret, uint nextOffset) {
    (ret, nextOffset) = asUint168Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes21Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes21, uint) {
    (uint168 ret, uint nextOffset) = asUint168Unchecked(encoded, offset);
    return (bytes21(ret), nextOffset);
  }

  function asBytes21(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes21, uint) {
    (uint168 ret, uint nextOffset) = asUint168(encoded, offset);
    return (bytes21(ret), nextOffset);
  }

  function asUint176Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint176 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 22)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint176(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint176 ret, uint nextOffset) {
    (ret, nextOffset) = asUint176Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes22Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes22, uint) {
    (uint176 ret, uint nextOffset) = asUint176Unchecked(encoded, offset);
    return (bytes22(ret), nextOffset);
  }

  function asBytes22(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes22, uint) {
    (uint176 ret, uint nextOffset) = asUint176(encoded, offset);
    return (bytes22(ret), nextOffset);
  }

  function asUint184Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint184 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 23)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint184(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint184 ret, uint nextOffset) {
    (ret, nextOffset) = asUint184Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes23Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes23, uint) {
    (uint184 ret, uint nextOffset) = asUint184Unchecked(encoded, offset);
    return (bytes23(ret), nextOffset);
  }

  function asBytes23(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes23, uint) {
    (uint184 ret, uint nextOffset) = asUint184(encoded, offset);
    return (bytes23(ret), nextOffset);
  }

  function asUint192Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint192 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 24)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint192(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint192 ret, uint nextOffset) {
    (ret, nextOffset) = asUint192Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes24Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes24, uint) {
    (uint192 ret, uint nextOffset) = asUint192Unchecked(encoded, offset);
    return (bytes24(ret), nextOffset);
  }

  function asBytes24(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes24, uint) {
    (uint192 ret, uint nextOffset) = asUint192(encoded, offset);
    return (bytes24(ret), nextOffset);
  }

  function asUint200Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint200 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 25)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint200(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint200 ret, uint nextOffset) {
    (ret, nextOffset) = asUint200Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes25Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes25, uint) {
    (uint200 ret, uint nextOffset) = asUint200Unchecked(encoded, offset);
    return (bytes25(ret), nextOffset);
  }

  function asBytes25(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes25, uint) {
    (uint200 ret, uint nextOffset) = asUint200(encoded, offset);
    return (bytes25(ret), nextOffset);
  }

  function asUint208Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint208 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 26)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint208(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint208 ret, uint nextOffset) {
    (ret, nextOffset) = asUint208Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes26Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes26, uint) {
    (uint208 ret, uint nextOffset) = asUint208Unchecked(encoded, offset);
    return (bytes26(ret), nextOffset);
  }

  function asBytes26(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes26, uint) {
    (uint208 ret, uint nextOffset) = asUint208(encoded, offset);
    return (bytes26(ret), nextOffset);
  }

  function asUint216Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint216 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 27)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint216(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint216 ret, uint nextOffset) {
    (ret, nextOffset) = asUint216Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes27Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes27, uint) {
    (uint216 ret, uint nextOffset) = asUint216Unchecked(encoded, offset);
    return (bytes27(ret), nextOffset);
  }

  function asBytes27(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes27, uint) {
    (uint216 ret, uint nextOffset) = asUint216(encoded, offset);
    return (bytes27(ret), nextOffset);
  }

  function asUint224Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint224 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 28)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint224(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint224 ret, uint nextOffset) {
    (ret, nextOffset) = asUint224Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes28Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes28, uint) {
    (uint224 ret, uint nextOffset) = asUint224Unchecked(encoded, offset);
    return (bytes28(ret), nextOffset);
  }

  function asBytes28(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes28, uint) {
    (uint224 ret, uint nextOffset) = asUint224(encoded, offset);
    return (bytes28(ret), nextOffset);
  }

  function asUint232Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint232 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 29)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint232(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint232 ret, uint nextOffset) {
    (ret, nextOffset) = asUint232Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes29Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes29, uint) {
    (uint232 ret, uint nextOffset) = asUint232Unchecked(encoded, offset);
    return (bytes29(ret), nextOffset);
  }

  function asBytes29(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes29, uint) {
    (uint232 ret, uint nextOffset) = asUint232(encoded, offset);
    return (bytes29(ret), nextOffset);
  }

  function asUint240Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint240 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 30)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint240(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint240 ret, uint nextOffset) {
    (ret, nextOffset) = asUint240Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes30Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes30, uint) {
    (uint240 ret, uint nextOffset) = asUint240Unchecked(encoded, offset);
    return (bytes30(ret), nextOffset);
  }

  function asBytes30(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes30, uint) {
    (uint240 ret, uint nextOffset) = asUint240(encoded, offset);
    return (bytes30(ret), nextOffset);
  }

  function asUint248Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint248 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 31)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint248(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint248 ret, uint nextOffset) {
    (ret, nextOffset) = asUint248Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes31Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes31, uint) {
    (uint248 ret, uint nextOffset) = asUint248Unchecked(encoded, offset);
    return (bytes31(ret), nextOffset);
  }

  function asBytes31(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes31, uint) {
    (uint248 ret, uint nextOffset) = asUint248(encoded, offset);
    return (bytes31(ret), nextOffset);
  }

  function asUint256Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint256 ret, uint nextOffset) {
    assembly ("memory-safe") {
      nextOffset := add(offset, 32)
      ret := mload(add(encoded, nextOffset))
    }
    return (ret, nextOffset);
  }

  function asUint256(
    bytes memory encoded,
    uint offset
  ) internal pure returns (uint256 ret, uint nextOffset) {
    (ret, nextOffset) = asUint256Unchecked(encoded, offset);
    checkBound(nextOffset, encoded.length);
  }

  function asBytes32Unchecked(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes32, uint) {
    (uint256 ret, uint nextOffset) = asUint256Unchecked(encoded, offset);
    return (bytes32(ret), nextOffset);
  }

  function asBytes32(
    bytes memory encoded,
    uint offset
  ) internal pure returns (bytes32, uint) {
    (uint256 ret, uint nextOffset) = asUint256(encoded, offset);
    return (bytes32(ret), nextOffset);
  }
}
