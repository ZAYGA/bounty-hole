// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: wormhole/config.proto

package types

import (
	fmt "fmt"
	_ "github.com/gogo/protobuf/gogoproto"
	proto "github.com/gogo/protobuf/proto"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type Config struct {
	GuardianSetExpiration uint64 `protobuf:"varint,1,opt,name=guardian_set_expiration,json=guardianSetExpiration,proto3" json:"guardian_set_expiration,omitempty"`
	GovernanceEmitter     []byte `protobuf:"bytes,2,opt,name=governance_emitter,json=governanceEmitter,proto3" json:"governance_emitter,omitempty"`
	GovernanceChain       uint32 `protobuf:"varint,3,opt,name=governance_chain,json=governanceChain,proto3" json:"governance_chain,omitempty"`
	ChainId               uint32 `protobuf:"varint,4,opt,name=chain_id,json=chainId,proto3" json:"chain_id,omitempty"`
}

func (m *Config) Reset()         { *m = Config{} }
func (m *Config) String() string { return proto.CompactTextString(m) }
func (*Config) ProtoMessage()    {}
func (*Config) Descriptor() ([]byte, []int) {
	return fileDescriptor_14d08d38823c924a, []int{0}
}
func (m *Config) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Config) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Config.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Config) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Config.Merge(m, src)
}
func (m *Config) XXX_Size() int {
	return m.Size()
}
func (m *Config) XXX_DiscardUnknown() {
	xxx_messageInfo_Config.DiscardUnknown(m)
}

var xxx_messageInfo_Config proto.InternalMessageInfo

func (m *Config) GetGuardianSetExpiration() uint64 {
	if m != nil {
		return m.GuardianSetExpiration
	}
	return 0
}

func (m *Config) GetGovernanceEmitter() []byte {
	if m != nil {
		return m.GovernanceEmitter
	}
	return nil
}

func (m *Config) GetGovernanceChain() uint32 {
	if m != nil {
		return m.GovernanceChain
	}
	return 0
}

func (m *Config) GetChainId() uint32 {
	if m != nil {
		return m.ChainId
	}
	return 0
}

func init() {
	proto.RegisterType((*Config)(nil), "wormhole_foundation.wormchain.wormhole.Config")
}

func init() { proto.RegisterFile("wormhole/config.proto", fileDescriptor_14d08d38823c924a) }

var fileDescriptor_14d08d38823c924a = []byte{
	// 272 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x12, 0x2d, 0xcf, 0x2f, 0xca,
	0xcd, 0xc8, 0xcf, 0x49, 0xd5, 0x4f, 0xce, 0xcf, 0x4b, 0xcb, 0x4c, 0xd7, 0x2b, 0x28, 0xca, 0x2f,
	0xc9, 0x17, 0x52, 0x83, 0x09, 0xc7, 0xa7, 0xe5, 0x97, 0xe6, 0xa5, 0x24, 0x96, 0x64, 0xe6, 0xe7,
	0xe9, 0x81, 0xc4, 0x92, 0x33, 0x12, 0x33, 0x21, 0x2c, 0x90, 0xac, 0x94, 0x48, 0x7a, 0x7e, 0x7a,
	0x3e, 0x58, 0x8b, 0x3e, 0x88, 0x05, 0xd1, 0xad, 0xb4, 0x95, 0x91, 0x8b, 0xcd, 0x19, 0x6c, 0x9c,
	0x90, 0x19, 0x97, 0x78, 0x7a, 0x69, 0x62, 0x51, 0x4a, 0x66, 0x62, 0x5e, 0x7c, 0x71, 0x6a, 0x49,
	0x7c, 0x6a, 0x45, 0x41, 0x66, 0x11, 0xd8, 0x38, 0x09, 0x46, 0x05, 0x46, 0x0d, 0x96, 0x20, 0x51,
	0x98, 0x74, 0x70, 0x6a, 0x89, 0x2b, 0x5c, 0x52, 0x48, 0x97, 0x4b, 0x28, 0x3d, 0xbf, 0x2c, 0xb5,
	0x28, 0x2f, 0x31, 0x2f, 0x39, 0x35, 0x3e, 0x35, 0x37, 0xb3, 0xa4, 0x24, 0xb5, 0x48, 0x82, 0x49,
	0x81, 0x51, 0x83, 0x27, 0x48, 0x10, 0x21, 0xe3, 0x0a, 0x91, 0x10, 0xd2, 0xe4, 0x12, 0x40, 0x52,
	0x0e, 0x76, 0xa4, 0x04, 0xb3, 0x02, 0xa3, 0x06, 0x6f, 0x10, 0x3f, 0x42, 0xdc, 0x19, 0x24, 0x2c,
	0x24, 0xc9, 0xc5, 0x01, 0x96, 0x8f, 0xcf, 0x4c, 0x91, 0x60, 0x01, 0x2b, 0x61, 0x07, 0xf3, 0x3d,
	0x53, 0x9c, 0x82, 0x4f, 0x3c, 0x92, 0x63, 0xbc, 0xf0, 0x48, 0x8e, 0xf1, 0xc1, 0x23, 0x39, 0xc6,
	0x09, 0x8f, 0xe5, 0x18, 0x2e, 0x3c, 0x96, 0x63, 0xb8, 0xf1, 0x58, 0x8e, 0x21, 0xca, 0x32, 0x3d,
	0xb3, 0x24, 0xa3, 0x34, 0x49, 0x2f, 0x39, 0x3f, 0x57, 0x1f, 0xe6, 0x79, 0x5d, 0x44, 0xd0, 0xe8,
	0xc3, 0x83, 0x46, 0xbf, 0x02, 0x2e, 0xaf, 0x5f, 0x52, 0x59, 0x90, 0x5a, 0x9c, 0xc4, 0x06, 0x0e,
	0x13, 0x63, 0x40, 0x00, 0x00, 0x00, 0xff, 0xff, 0x5a, 0xda, 0x45, 0x4d, 0x6a, 0x01, 0x00, 0x00,
}

func (m *Config) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Config) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Config) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.ChainId != 0 {
		i = encodeVarintConfig(dAtA, i, uint64(m.ChainId))
		i--
		dAtA[i] = 0x20
	}
	if m.GovernanceChain != 0 {
		i = encodeVarintConfig(dAtA, i, uint64(m.GovernanceChain))
		i--
		dAtA[i] = 0x18
	}
	if len(m.GovernanceEmitter) > 0 {
		i -= len(m.GovernanceEmitter)
		copy(dAtA[i:], m.GovernanceEmitter)
		i = encodeVarintConfig(dAtA, i, uint64(len(m.GovernanceEmitter)))
		i--
		dAtA[i] = 0x12
	}
	if m.GuardianSetExpiration != 0 {
		i = encodeVarintConfig(dAtA, i, uint64(m.GuardianSetExpiration))
		i--
		dAtA[i] = 0x8
	}
	return len(dAtA) - i, nil
}

func encodeVarintConfig(dAtA []byte, offset int, v uint64) int {
	offset -= sovConfig(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *Config) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.GuardianSetExpiration != 0 {
		n += 1 + sovConfig(uint64(m.GuardianSetExpiration))
	}
	l = len(m.GovernanceEmitter)
	if l > 0 {
		n += 1 + l + sovConfig(uint64(l))
	}
	if m.GovernanceChain != 0 {
		n += 1 + sovConfig(uint64(m.GovernanceChain))
	}
	if m.ChainId != 0 {
		n += 1 + sovConfig(uint64(m.ChainId))
	}
	return n
}

func sovConfig(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozConfig(x uint64) (n int) {
	return sovConfig(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *Config) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowConfig
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: Config: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Config: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field GuardianSetExpiration", wireType)
			}
			m.GuardianSetExpiration = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.GuardianSetExpiration |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field GovernanceEmitter", wireType)
			}
			var byteLen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				byteLen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if byteLen < 0 {
				return ErrInvalidLengthConfig
			}
			postIndex := iNdEx + byteLen
			if postIndex < 0 {
				return ErrInvalidLengthConfig
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.GovernanceEmitter = append(m.GovernanceEmitter[:0], dAtA[iNdEx:postIndex]...)
			if m.GovernanceEmitter == nil {
				m.GovernanceEmitter = []byte{}
			}
			iNdEx = postIndex
		case 3:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field GovernanceChain", wireType)
			}
			m.GovernanceChain = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.GovernanceChain |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 4:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field ChainId", wireType)
			}
			m.ChainId = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.ChainId |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		default:
			iNdEx = preIndex
			skippy, err := skipConfig(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthConfig
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipConfig(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowConfig
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowConfig
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthConfig
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupConfig
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthConfig
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthConfig        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowConfig          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupConfig = fmt.Errorf("proto: unexpected end of group")
)
