// Code generated by protoc-gen-grpc-gateway. DO NOT EDIT.
// source: spy/v1/spy.proto

/*
Package spyv1 is a reverse proxy.

It translates gRPC into RESTful JSON APIs.
*/
package spyv1

import (
	"context"
	"io"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/grpc-ecosystem/grpc-gateway/v2/utilities"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"
)

// Suppress "imported and not used" errors
var _ codes.Code
var _ io.Reader
var _ status.Status
var _ = runtime.String
var _ = utilities.NewDoubleArray
var _ = metadata.Join

func request_SpyRPCService_SubscribeSignedVAA_0(ctx context.Context, marshaler runtime.Marshaler, client SpyRPCServiceClient, req *http.Request, pathParams map[string]string) (SpyRPCService_SubscribeSignedVAAClient, runtime.ServerMetadata, error) {
	var protoReq SubscribeSignedVAARequest
	var metadata runtime.ServerMetadata

	newReader, berr := utilities.IOReaderFactory(req.Body)
	if berr != nil {
		return nil, metadata, status.Errorf(codes.InvalidArgument, "%v", berr)
	}
	if err := marshaler.NewDecoder(newReader()).Decode(&protoReq); err != nil && err != io.EOF {
		return nil, metadata, status.Errorf(codes.InvalidArgument, "%v", err)
	}

	stream, err := client.SubscribeSignedVAA(ctx, &protoReq)
	if err != nil {
		return nil, metadata, err
	}
	header, err := stream.Header()
	if err != nil {
		return nil, metadata, err
	}
	metadata.HeaderMD = header
	return stream, metadata, nil

}

// RegisterSpyRPCServiceHandlerServer registers the http handlers for service SpyRPCService to "mux".
// UnaryRPC     :call SpyRPCServiceServer directly.
// StreamingRPC :currently unsupported pending https://github.com/grpc/grpc-go/issues/906.
// Note that using this registration option will cause many gRPC library features to stop working. Consider using RegisterSpyRPCServiceHandlerFromEndpoint instead.
func RegisterSpyRPCServiceHandlerServer(ctx context.Context, mux *runtime.ServeMux, server SpyRPCServiceServer) error {

	mux.Handle("POST", pattern_SpyRPCService_SubscribeSignedVAA_0, func(w http.ResponseWriter, req *http.Request, pathParams map[string]string) {
		err := status.Error(codes.Unimplemented, "streaming calls are not yet supported in the in-process transport")
		_, outboundMarshaler := runtime.MarshalerForRequest(mux, req)
		runtime.HTTPError(ctx, mux, outboundMarshaler, w, req, err)
		return
	})

	return nil
}

// RegisterSpyRPCServiceHandlerFromEndpoint is same as RegisterSpyRPCServiceHandler but
// automatically dials to "endpoint" and closes the connection when "ctx" gets done.
func RegisterSpyRPCServiceHandlerFromEndpoint(ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption) (err error) {
	conn, err := grpc.Dial(endpoint, opts...)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			if cerr := conn.Close(); cerr != nil {
				grpclog.Infof("Failed to close conn to %s: %v", endpoint, cerr)
			}
			return
		}
		go func() {
			<-ctx.Done()
			if cerr := conn.Close(); cerr != nil {
				grpclog.Infof("Failed to close conn to %s: %v", endpoint, cerr)
			}
		}()
	}()

	return RegisterSpyRPCServiceHandler(ctx, mux, conn)
}

// RegisterSpyRPCServiceHandler registers the http handlers for service SpyRPCService to "mux".
// The handlers forward requests to the grpc endpoint over "conn".
func RegisterSpyRPCServiceHandler(ctx context.Context, mux *runtime.ServeMux, conn *grpc.ClientConn) error {
	return RegisterSpyRPCServiceHandlerClient(ctx, mux, NewSpyRPCServiceClient(conn))
}

// RegisterSpyRPCServiceHandlerClient registers the http handlers for service SpyRPCService
// to "mux". The handlers forward requests to the grpc endpoint over the given implementation of "SpyRPCServiceClient".
// Note: the gRPC framework executes interceptors within the gRPC handler. If the passed in "SpyRPCServiceClient"
// doesn't go through the normal gRPC flow (creating a gRPC client etc.) then it will be up to the passed in
// "SpyRPCServiceClient" to call the correct interceptors.
func RegisterSpyRPCServiceHandlerClient(ctx context.Context, mux *runtime.ServeMux, client SpyRPCServiceClient) error {

	mux.Handle("POST", pattern_SpyRPCService_SubscribeSignedVAA_0, func(w http.ResponseWriter, req *http.Request, pathParams map[string]string) {
		ctx, cancel := context.WithCancel(req.Context())
		defer cancel()
		inboundMarshaler, outboundMarshaler := runtime.MarshalerForRequest(mux, req)
		rctx, err := runtime.AnnotateContext(ctx, mux, req, "/spy.v1.SpyRPCService/SubscribeSignedVAA", runtime.WithHTTPPathPattern("/v1:subscribe_signed_vaa"))
		if err != nil {
			runtime.HTTPError(ctx, mux, outboundMarshaler, w, req, err)
			return
		}
		resp, md, err := request_SpyRPCService_SubscribeSignedVAA_0(rctx, inboundMarshaler, client, req, pathParams)
		ctx = runtime.NewServerMetadataContext(ctx, md)
		if err != nil {
			runtime.HTTPError(ctx, mux, outboundMarshaler, w, req, err)
			return
		}

		forward_SpyRPCService_SubscribeSignedVAA_0(ctx, mux, outboundMarshaler, w, req, func() (proto.Message, error) { return resp.Recv() }, mux.GetForwardResponseOptions()...)

	})

	return nil
}

var (
	pattern_SpyRPCService_SubscribeSignedVAA_0 = runtime.MustPattern(runtime.NewPattern(1, []int{2, 0}, []string{"v1"}, "subscribe_signed_vaa"))
)

var (
	forward_SpyRPCService_SubscribeSignedVAA_0 = runtime.ForwardResponseStream
)
