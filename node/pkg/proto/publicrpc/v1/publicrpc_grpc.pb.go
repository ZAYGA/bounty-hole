// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package publicrpcv1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// PublicRPCServiceClient is the client API for PublicRPCService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type PublicRPCServiceClient interface {
	// GetLastHeartbeats returns the last heartbeat received for each guardian node in the
	// node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
	// The heartbeat value is null if no heartbeat has yet been received.
	GetLastHeartbeats(ctx context.Context, in *GetLastHeartbeatsRequest, opts ...grpc.CallOption) (*GetLastHeartbeatsResponse, error)
	GetSignedVAA(ctx context.Context, in *GetSignedVAARequest, opts ...grpc.CallOption) (*GetSignedVAAResponse, error)
	GetCurrentGuardianSet(ctx context.Context, in *GetCurrentGuardianSetRequest, opts ...grpc.CallOption) (*GetCurrentGuardianSetResponse, error)
	GovernorGetAvailableNotionalByChain(ctx context.Context, in *GovernorGetAvailableNotionalByChainRequest, opts ...grpc.CallOption) (*GovernorGetAvailableNotionalByChainResponse, error)
	GovernorGetEnqueuedVAAs(ctx context.Context, in *GovernorGetEnqueuedVAAsRequest, opts ...grpc.CallOption) (*GovernorGetEnqueuedVAAsResponse, error)
	GovernorIsVAAEnqueued(ctx context.Context, in *GovernorIsVAAEnqueuedRequest, opts ...grpc.CallOption) (*GovernorIsVAAEnqueuedResponse, error)
	GovernorGetTokenList(ctx context.Context, in *GovernorGetTokenListRequest, opts ...grpc.CallOption) (*GovernorGetTokenListResponse, error)
}

type publicRPCServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewPublicRPCServiceClient(cc grpc.ClientConnInterface) PublicRPCServiceClient {
	return &publicRPCServiceClient{cc}
}

func (c *publicRPCServiceClient) GetLastHeartbeats(ctx context.Context, in *GetLastHeartbeatsRequest, opts ...grpc.CallOption) (*GetLastHeartbeatsResponse, error) {
	out := new(GetLastHeartbeatsResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GetLastHeartbeats", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GetSignedVAA(ctx context.Context, in *GetSignedVAARequest, opts ...grpc.CallOption) (*GetSignedVAAResponse, error) {
	out := new(GetSignedVAAResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GetSignedVAA", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GetCurrentGuardianSet(ctx context.Context, in *GetCurrentGuardianSetRequest, opts ...grpc.CallOption) (*GetCurrentGuardianSetResponse, error) {
	out := new(GetCurrentGuardianSetResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GetCurrentGuardianSet", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GovernorGetAvailableNotionalByChain(ctx context.Context, in *GovernorGetAvailableNotionalByChainRequest, opts ...grpc.CallOption) (*GovernorGetAvailableNotionalByChainResponse, error) {
	out := new(GovernorGetAvailableNotionalByChainResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GovernorGetAvailableNotionalByChain", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GovernorGetEnqueuedVAAs(ctx context.Context, in *GovernorGetEnqueuedVAAsRequest, opts ...grpc.CallOption) (*GovernorGetEnqueuedVAAsResponse, error) {
	out := new(GovernorGetEnqueuedVAAsResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GovernorGetEnqueuedVAAs", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GovernorIsVAAEnqueued(ctx context.Context, in *GovernorIsVAAEnqueuedRequest, opts ...grpc.CallOption) (*GovernorIsVAAEnqueuedResponse, error) {
	out := new(GovernorIsVAAEnqueuedResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GovernorIsVAAEnqueued", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *publicRPCServiceClient) GovernorGetTokenList(ctx context.Context, in *GovernorGetTokenListRequest, opts ...grpc.CallOption) (*GovernorGetTokenListResponse, error) {
	out := new(GovernorGetTokenListResponse)
	err := c.cc.Invoke(ctx, "/publicrpc.v1.PublicRPCService/GovernorGetTokenList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PublicRPCServiceServer is the server API for PublicRPCService service.
// All implementations must embed UnimplementedPublicRPCServiceServer
// for forward compatibility
type PublicRPCServiceServer interface {
	// GetLastHeartbeats returns the last heartbeat received for each guardian node in the
	// node's active guardian set. Heartbeats received by nodes not in the guardian set are ignored.
	// The heartbeat value is null if no heartbeat has yet been received.
	GetLastHeartbeats(context.Context, *GetLastHeartbeatsRequest) (*GetLastHeartbeatsResponse, error)
	GetSignedVAA(context.Context, *GetSignedVAARequest) (*GetSignedVAAResponse, error)
	GetCurrentGuardianSet(context.Context, *GetCurrentGuardianSetRequest) (*GetCurrentGuardianSetResponse, error)
	GovernorGetAvailableNotionalByChain(context.Context, *GovernorGetAvailableNotionalByChainRequest) (*GovernorGetAvailableNotionalByChainResponse, error)
	GovernorGetEnqueuedVAAs(context.Context, *GovernorGetEnqueuedVAAsRequest) (*GovernorGetEnqueuedVAAsResponse, error)
	GovernorIsVAAEnqueued(context.Context, *GovernorIsVAAEnqueuedRequest) (*GovernorIsVAAEnqueuedResponse, error)
	GovernorGetTokenList(context.Context, *GovernorGetTokenListRequest) (*GovernorGetTokenListResponse, error)
	mustEmbedUnimplementedPublicRPCServiceServer()
}

// UnimplementedPublicRPCServiceServer must be embedded to have forward compatible implementations.
type UnimplementedPublicRPCServiceServer struct {
}

func (UnimplementedPublicRPCServiceServer) GetLastHeartbeats(context.Context, *GetLastHeartbeatsRequest) (*GetLastHeartbeatsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetLastHeartbeats not implemented")
}
func (UnimplementedPublicRPCServiceServer) GetSignedVAA(context.Context, *GetSignedVAARequest) (*GetSignedVAAResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetSignedVAA not implemented")
}
func (UnimplementedPublicRPCServiceServer) GetCurrentGuardianSet(context.Context, *GetCurrentGuardianSetRequest) (*GetCurrentGuardianSetResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCurrentGuardianSet not implemented")
}
func (UnimplementedPublicRPCServiceServer) GovernorGetAvailableNotionalByChain(context.Context, *GovernorGetAvailableNotionalByChainRequest) (*GovernorGetAvailableNotionalByChainResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GovernorGetAvailableNotionalByChain not implemented")
}
func (UnimplementedPublicRPCServiceServer) GovernorGetEnqueuedVAAs(context.Context, *GovernorGetEnqueuedVAAsRequest) (*GovernorGetEnqueuedVAAsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GovernorGetEnqueuedVAAs not implemented")
}
func (UnimplementedPublicRPCServiceServer) GovernorIsVAAEnqueued(context.Context, *GovernorIsVAAEnqueuedRequest) (*GovernorIsVAAEnqueuedResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GovernorIsVAAEnqueued not implemented")
}
func (UnimplementedPublicRPCServiceServer) GovernorGetTokenList(context.Context, *GovernorGetTokenListRequest) (*GovernorGetTokenListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GovernorGetTokenList not implemented")
}
func (UnimplementedPublicRPCServiceServer) mustEmbedUnimplementedPublicRPCServiceServer() {}

// UnsafePublicRPCServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PublicRPCServiceServer will
// result in compilation errors.
type UnsafePublicRPCServiceServer interface {
	mustEmbedUnimplementedPublicRPCServiceServer()
}

func RegisterPublicRPCServiceServer(s grpc.ServiceRegistrar, srv PublicRPCServiceServer) {
	s.RegisterService(&PublicRPCService_ServiceDesc, srv)
}

func _PublicRPCService_GetLastHeartbeats_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetLastHeartbeatsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GetLastHeartbeats(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GetLastHeartbeats",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GetLastHeartbeats(ctx, req.(*GetLastHeartbeatsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GetSignedVAA_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetSignedVAARequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GetSignedVAA(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GetSignedVAA",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GetSignedVAA(ctx, req.(*GetSignedVAARequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GetCurrentGuardianSet_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCurrentGuardianSetRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GetCurrentGuardianSet(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GetCurrentGuardianSet",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GetCurrentGuardianSet(ctx, req.(*GetCurrentGuardianSetRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GovernorGetAvailableNotionalByChain_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GovernorGetAvailableNotionalByChainRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GovernorGetAvailableNotionalByChain(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GovernorGetAvailableNotionalByChain",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GovernorGetAvailableNotionalByChain(ctx, req.(*GovernorGetAvailableNotionalByChainRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GovernorGetEnqueuedVAAs_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GovernorGetEnqueuedVAAsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GovernorGetEnqueuedVAAs(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GovernorGetEnqueuedVAAs",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GovernorGetEnqueuedVAAs(ctx, req.(*GovernorGetEnqueuedVAAsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GovernorIsVAAEnqueued_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GovernorIsVAAEnqueuedRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GovernorIsVAAEnqueued(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GovernorIsVAAEnqueued",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GovernorIsVAAEnqueued(ctx, req.(*GovernorIsVAAEnqueuedRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PublicRPCService_GovernorGetTokenList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GovernorGetTokenListRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PublicRPCServiceServer).GovernorGetTokenList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/publicrpc.v1.PublicRPCService/GovernorGetTokenList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PublicRPCServiceServer).GovernorGetTokenList(ctx, req.(*GovernorGetTokenListRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// PublicRPCService_ServiceDesc is the grpc.ServiceDesc for PublicRPCService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var PublicRPCService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "publicrpc.v1.PublicRPCService",
	HandlerType: (*PublicRPCServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetLastHeartbeats",
			Handler:    _PublicRPCService_GetLastHeartbeats_Handler,
		},
		{
			MethodName: "GetSignedVAA",
			Handler:    _PublicRPCService_GetSignedVAA_Handler,
		},
		{
			MethodName: "GetCurrentGuardianSet",
			Handler:    _PublicRPCService_GetCurrentGuardianSet_Handler,
		},
		{
			MethodName: "GovernorGetAvailableNotionalByChain",
			Handler:    _PublicRPCService_GovernorGetAvailableNotionalByChain_Handler,
		},
		{
			MethodName: "GovernorGetEnqueuedVAAs",
			Handler:    _PublicRPCService_GovernorGetEnqueuedVAAs_Handler,
		},
		{
			MethodName: "GovernorIsVAAEnqueued",
			Handler:    _PublicRPCService_GovernorIsVAAEnqueued_Handler,
		},
		{
			MethodName: "GovernorGetTokenList",
			Handler:    _PublicRPCService_GovernorGetTokenList_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "publicrpc/v1/publicrpc.proto",
}
