// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: wormhole/consensus_guardian_set_index.proto

package types

import (
	fmt "fmt"
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

type ConsensusGuardianSetIndex struct {
	Index uint32 `protobuf:"varint,1,opt,name=index,proto3" json:"index,omitempty"`
}

func (m *ConsensusGuardianSetIndex) Reset()         { *m = ConsensusGuardianSetIndex{} }
func (m *ConsensusGuardianSetIndex) String() string { return proto.CompactTextString(m) }
func (*ConsensusGuardianSetIndex) ProtoMessage()    {}
func (*ConsensusGuardianSetIndex) Descriptor() ([]byte, []int) {
	return fileDescriptor_18e45d0c16ad5fce, []int{0}
}
func (m *ConsensusGuardianSetIndex) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *ConsensusGuardianSetIndex) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_ConsensusGuardianSetIndex.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *ConsensusGuardianSetIndex) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ConsensusGuardianSetIndex.Merge(m, src)
}
func (m *ConsensusGuardianSetIndex) XXX_Size() int {
	return m.Size()
}
func (m *ConsensusGuardianSetIndex) XXX_DiscardUnknown() {
	xxx_messageInfo_ConsensusGuardianSetIndex.DiscardUnknown(m)
}

var xxx_messageInfo_ConsensusGuardianSetIndex proto.InternalMessageInfo

func (m *ConsensusGuardianSetIndex) GetIndex() uint32 {
	if m != nil {
		return m.Index
	}
	return 0
}

func init() {
	proto.RegisterType((*ConsensusGuardianSetIndex)(nil), "wormhole_foundation.wormchain.wormhole.ConsensusGuardianSetIndex")
}

func init() {
	proto.RegisterFile("wormhole/consensus_guardian_set_index.proto", fileDescriptor_18e45d0c16ad5fce)
}

var fileDescriptor_18e45d0c16ad5fce = []byte{
	// 190 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xd2, 0x2e, 0xcf, 0x2f, 0xca,
	0xcd, 0xc8, 0xcf, 0x49, 0xd5, 0x4f, 0xce, 0xcf, 0x2b, 0x4e, 0xcd, 0x2b, 0x2e, 0x2d, 0x8e, 0x4f,
	0x2f, 0x4d, 0x2c, 0x4a, 0xc9, 0x4c, 0xcc, 0x8b, 0x2f, 0x4e, 0x2d, 0x89, 0xcf, 0xcc, 0x4b, 0x49,
	0xad, 0xd0, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x52, 0x83, 0x29, 0x8e, 0x4f, 0xcb, 0x2f, 0xcd,
	0x4b, 0x49, 0x2c, 0xc9, 0xcc, 0xcf, 0xd3, 0x03, 0x89, 0x25, 0x67, 0x24, 0x66, 0x42, 0x58, 0x20,
	0x59, 0x25, 0x43, 0x2e, 0x49, 0x67, 0x98, 0x69, 0xee, 0x50, 0xc3, 0x82, 0x53, 0x4b, 0x3c, 0x41,
	0x46, 0x09, 0x89, 0x70, 0xb1, 0x82, 0xcd, 0x94, 0x60, 0x54, 0x60, 0xd4, 0xe0, 0x0d, 0x82, 0x70,
	0x9c, 0x82, 0x4f, 0x3c, 0x92, 0x63, 0xbc, 0xf0, 0x48, 0x8e, 0xf1, 0xc1, 0x23, 0x39, 0xc6, 0x09,
	0x8f, 0xe5, 0x18, 0x2e, 0x3c, 0x96, 0x63, 0xb8, 0xf1, 0x58, 0x8e, 0x21, 0xca, 0x32, 0x3d, 0xb3,
	0x24, 0xa3, 0x34, 0x49, 0x2f, 0x39, 0x3f, 0x57, 0x1f, 0x66, 0x83, 0x2e, 0xc2, 0x7e, 0x7d, 0xb8,
	0xfd, 0xfa, 0x15, 0x70, 0x79, 0xfd, 0x92, 0xca, 0x82, 0xd4, 0xe2, 0x24, 0x36, 0xb0, 0xb3, 0x8d,
	0x01, 0x01, 0x00, 0x00, 0xff, 0xff, 0x90, 0x7c, 0x1c, 0x4e, 0xe5, 0x00, 0x00, 0x00,
}

func (m *ConsensusGuardianSetIndex) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *ConsensusGuardianSetIndex) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *ConsensusGuardianSetIndex) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Index != 0 {
		i = encodeVarintConsensusGuardianSetIndex(dAtA, i, uint64(m.Index))
		i--
		dAtA[i] = 0x8
	}
	return len(dAtA) - i, nil
}

func encodeVarintConsensusGuardianSetIndex(dAtA []byte, offset int, v uint64) int {
	offset -= sovConsensusGuardianSetIndex(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *ConsensusGuardianSetIndex) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Index != 0 {
		n += 1 + sovConsensusGuardianSetIndex(uint64(m.Index))
	}
	return n
}

func sovConsensusGuardianSetIndex(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozConsensusGuardianSetIndex(x uint64) (n int) {
	return sovConsensusGuardianSetIndex(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *ConsensusGuardianSetIndex) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowConsensusGuardianSetIndex
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
			return fmt.Errorf("proto: ConsensusGuardianSetIndex: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: ConsensusGuardianSetIndex: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Index", wireType)
			}
			m.Index = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowConsensusGuardianSetIndex
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Index |= uint32(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		default:
			iNdEx = preIndex
			skippy, err := skipConsensusGuardianSetIndex(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthConsensusGuardianSetIndex
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
func skipConsensusGuardianSetIndex(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowConsensusGuardianSetIndex
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
					return 0, ErrIntOverflowConsensusGuardianSetIndex
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
					return 0, ErrIntOverflowConsensusGuardianSetIndex
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
				return 0, ErrInvalidLengthConsensusGuardianSetIndex
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupConsensusGuardianSetIndex
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthConsensusGuardianSetIndex
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthConsensusGuardianSetIndex        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowConsensusGuardianSetIndex          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupConsensusGuardianSetIndex = fmt.Errorf("proto: unexpected end of group")
)
