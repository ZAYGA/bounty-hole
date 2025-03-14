// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: wormhole/replay_protection.proto

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

type ReplayProtection struct {
	Index string `protobuf:"bytes,1,opt,name=index,proto3" json:"index,omitempty"`
}

func (m *ReplayProtection) Reset()         { *m = ReplayProtection{} }
func (m *ReplayProtection) String() string { return proto.CompactTextString(m) }
func (*ReplayProtection) ProtoMessage()    {}
func (*ReplayProtection) Descriptor() ([]byte, []int) {
	return fileDescriptor_da495f697a0fb01c, []int{0}
}
func (m *ReplayProtection) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *ReplayProtection) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_ReplayProtection.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *ReplayProtection) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ReplayProtection.Merge(m, src)
}
func (m *ReplayProtection) XXX_Size() int {
	return m.Size()
}
func (m *ReplayProtection) XXX_DiscardUnknown() {
	xxx_messageInfo_ReplayProtection.DiscardUnknown(m)
}

var xxx_messageInfo_ReplayProtection proto.InternalMessageInfo

func (m *ReplayProtection) GetIndex() string {
	if m != nil {
		return m.Index
	}
	return ""
}

func init() {
	proto.RegisterType((*ReplayProtection)(nil), "wormhole_foundation.wormchain.wormhole.ReplayProtection")
}

func init() { proto.RegisterFile("wormhole/replay_protection.proto", fileDescriptor_da495f697a0fb01c) }

var fileDescriptor_da495f697a0fb01c = []byte{
	// 170 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x52, 0x28, 0xcf, 0x2f, 0xca,
	0xcd, 0xc8, 0xcf, 0x49, 0xd5, 0x2f, 0x4a, 0x2d, 0xc8, 0x49, 0xac, 0x8c, 0x2f, 0x28, 0xca, 0x2f,
	0x49, 0x4d, 0x2e, 0xc9, 0xcc, 0xcf, 0xd3, 0x03, 0x31, 0xf3, 0x85, 0xd4, 0x60, 0x2a, 0xe2, 0xd3,
	0xf2, 0x4b, 0xf3, 0x52, 0x12, 0xc1, 0x52, 0x20, 0xb1, 0xe4, 0x8c, 0xc4, 0x4c, 0x08, 0x0b, 0x24,
	0xab, 0xa4, 0xc1, 0x25, 0x10, 0x04, 0x36, 0x22, 0x00, 0x6e, 0x82, 0x90, 0x08, 0x17, 0x6b, 0x66,
	0x5e, 0x4a, 0x6a, 0x85, 0x04, 0xa3, 0x02, 0xa3, 0x06, 0x67, 0x10, 0x84, 0xe3, 0x14, 0x7c, 0xe2,
	0x91, 0x1c, 0xe3, 0x85, 0x47, 0x72, 0x8c, 0x0f, 0x1e, 0xc9, 0x31, 0x4e, 0x78, 0x2c, 0xc7, 0x70,
	0xe1, 0xb1, 0x1c, 0xc3, 0x8d, 0xc7, 0x72, 0x0c, 0x51, 0x96, 0xe9, 0x99, 0x25, 0x19, 0xa5, 0x49,
	0x7a, 0xc9, 0xf9, 0xb9, 0xfa, 0x30, 0x83, 0x75, 0x11, 0xd6, 0xea, 0xc3, 0xad, 0xd5, 0xaf, 0x80,
	0xcb, 0xeb, 0x97, 0x54, 0x16, 0xa4, 0x16, 0x27, 0xb1, 0x81, 0x5d, 0x6b, 0x0c, 0x08, 0x00, 0x00,
	0xff, 0xff, 0xca, 0x3f, 0x36, 0x04, 0xd1, 0x00, 0x00, 0x00,
}

func (m *ReplayProtection) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *ReplayProtection) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *ReplayProtection) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Index) > 0 {
		i -= len(m.Index)
		copy(dAtA[i:], m.Index)
		i = encodeVarintReplayProtection(dAtA, i, uint64(len(m.Index)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func encodeVarintReplayProtection(dAtA []byte, offset int, v uint64) int {
	offset -= sovReplayProtection(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *ReplayProtection) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Index)
	if l > 0 {
		n += 1 + l + sovReplayProtection(uint64(l))
	}
	return n
}

func sovReplayProtection(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozReplayProtection(x uint64) (n int) {
	return sovReplayProtection(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *ReplayProtection) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowReplayProtection
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
			return fmt.Errorf("proto: ReplayProtection: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: ReplayProtection: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Index", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowReplayProtection
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthReplayProtection
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthReplayProtection
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Index = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipReplayProtection(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthReplayProtection
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
func skipReplayProtection(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowReplayProtection
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
					return 0, ErrIntOverflowReplayProtection
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
					return 0, ErrIntOverflowReplayProtection
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
				return 0, ErrInvalidLengthReplayProtection
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupReplayProtection
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthReplayProtection
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthReplayProtection        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowReplayProtection          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupReplayProtection = fmt.Errorf("proto: unexpected end of group")
)
