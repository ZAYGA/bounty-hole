//@ts-nocheck
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
* `Any` contains an arbitrary serialized protocol buffer message along with a
URL that describes the type of the serialized message.

Protobuf library provides support to pack/unpack Any values in the form
of utility functions or additional generated methods of the Any type.

Example 1: Pack and unpack a message in C++.

    Foo foo = ...;
    Any any;
    any.PackFrom(foo);
    ...
    if (any.UnpackTo(&foo)) {
      ...
    }

Example 2: Pack and unpack a message in Java.

    Foo foo = ...;
    Any any = Any.pack(foo);
    ...
    if (any.is(Foo.class)) {
      foo = any.unpack(Foo.class);
    }

 Example 3: Pack and unpack a message in Python.

    foo = Foo(...)
    any = Any()
    any.Pack(foo)
    ...
    if any.Is(Foo.DESCRIPTOR):
      any.Unpack(foo)
      ...

 Example 4: Pack and unpack a message in Go

     foo := &pb.Foo{...}
     any, err := anypb.New(foo)
     if err != nil {
       ...
     }
     ...
     foo := &pb.Foo{}
     if err := any.UnmarshalTo(foo); err != nil {
       ...
     }

The pack methods provided by protobuf library will by default use
'type.googleapis.com/full.type.name' as the type URL and the unpack
methods only use the fully qualified type name after the last '/'
in the type URL, for example "foo.bar.com/x/y.z" will yield type
name "y.z".


JSON
====
The JSON representation of an `Any` value uses the regular
representation of the deserialized, embedded message, with an
additional field `@type` which contains the type URL. Example:

    package google.profile;
    message Person {
      string first_name = 1;
      string last_name = 2;
    }

    {
      "@type": "type.googleapis.com/google.profile.Person",
      "firstName": <string>,
      "lastName": <string>
    }

If the embedded message type is well-known and has a custom JSON
representation, that representation will be embedded adding a field
`value` which holds the custom JSON in addition to the `@type`
field. Example (for message [google.protobuf.Duration][]):

    {
      "@type": "type.googleapis.com/google.protobuf.Duration",
      "value": "1.212s"
    }
*/
export interface ProtobufAny {
  /**
   * A URL/resource name that uniquely identifies the type of the serialized
   * protocol buffer message. This string must contain at least
   * one "/" character. The last segment of the URL's path must represent
   * the fully qualified name of the type (as in
   * `path/google.protobuf.Duration`). The name should be in a canonical form
   * (e.g., leading "." is not accepted).
   *
   * In practice, teams usually precompile into the binary all types that they
   * expect it to use in the context of Any. However, for URLs which use the
   * scheme `http`, `https`, or no scheme, one can optionally set up a type
   * server that maps type URLs to message definitions as follows:
   *
   * * If no scheme is provided, `https` is assumed.
   * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
   *   value in binary format, or produce an error.
   * * Applications are allowed to cache lookup results based on the
   *   URL, or have them precompiled into a binary to avoid any
   *   lookup. Therefore, binary compatibility needs to be preserved
   *   on changes to types. (Use versioned type names to manage
   *   breaking changes.)
   *
   * Note: this functionality is not currently available in the official
   * protobuf release, and it is not used for type URLs beginning with
   * type.googleapis.com.
   *
   * Schemes other than `http`, `https` (or the empty scheme) might be
   * used with implementation specific semantics.
   */
  "@type"?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export interface V1Beta1Grant {
  /** granter is the address of the user granting an allowance of their funds. */
  granter?: string;

  /** grantee is the address of the user being granted an allowance of another user's funds. */
  grantee?: string;

  /** allowance can be any of basic and filtered fee allowance. */
  allowance?: ProtobufAny;
}

/**
 * MsgGrantAllowanceResponse defines the Msg/GrantAllowanceResponse response type.
 */
export type V1Beta1MsgGrantAllowanceResponse = object;

/**
 * MsgRevokeAllowanceResponse defines the Msg/RevokeAllowanceResponse response type.
 */
export type V1Beta1MsgRevokeAllowanceResponse = object;

/**
* message SomeRequest {
         Foo some_parameter = 1;
         PageRequest pagination = 2;
 }
*/
export interface V1Beta1PageRequest {
  /**
   * key is a value returned in PageResponse.next_key to begin
   * querying the next page most efficiently. Only one of offset or key
   * should be set.
   * @format byte
   */
  key?: string;

  /**
   * offset is a numeric offset that can be used when key is unavailable.
   * It is less efficient than using key. Only one of offset or key should
   * be set.
   * @format uint64
   */
  offset?: string;

  /**
   * limit is the total number of results to be returned in the result page.
   * If left empty it will default to a value to be set by each app.
   * @format uint64
   */
  limit?: string;

  /**
   * count_total is set to true  to indicate that the result set should include
   * a count of the total number of items available for pagination in UIs.
   * count_total is only respected when offset is used. It is ignored when key
   * is set.
   */
  count_total?: boolean;

  /**
   * reverse is set to true if results are to be returned in the descending order.
   *
   * Since: cosmos-sdk 0.43
   */
  reverse?: boolean;
}

/**
* PageResponse is to be embedded in gRPC response messages where the
corresponding request message has used PageRequest.

 message SomeResponse {
         repeated Bar results = 1;
         PageResponse page = 2;
 }
*/
export interface V1Beta1PageResponse {
  /** @format byte */
  next_key?: string;

  /** @format uint64 */
  total?: string;
}

/**
 * QueryAllowanceResponse is the response type for the Query/Allowance RPC method.
 */
export interface V1Beta1QueryAllowanceResponse {
  /** allowance is a allowance granted for grantee by granter. */
  allowance?: V1Beta1Grant;
}

/**
 * QueryAllowancesByGranterResponse is the response type for the Query/AllowancesByGranter RPC method.
 */
export interface V1Beta1QueryAllowancesByGranterResponse {
  /** allowances that have been issued by the granter. */
  allowances?: V1Beta1Grant[];

  /** pagination defines an pagination for the response. */
  pagination?: V1Beta1PageResponse;
}

/**
 * QueryAllowancesResponse is the response type for the Query/Allowances RPC method.
 */
export interface V1Beta1QueryAllowancesResponse {
  /** allowances are allowance's granted for grantee by granter. */
  allowances?: V1Beta1Grant[];

  /** pagination defines an pagination for the response. */
  pagination?: V1Beta1PageResponse;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: keyof Omit<Body, "body" | "bodyUsed">;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType) => RequestParams | void;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;
  private abortControllers = new Map<CancelToken, AbortController>();

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format = "json",
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = (secure && this.securityWorker && this.securityWorker(this.securityData)) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = (null as unknown) as T;
      r.error = (null as unknown) as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title cosmos/feegrant/v1beta1/feegrant.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryAllowance
   * @summary Allowance returns fee granted to the grantee by the granter.
   * @request GET:/cosmos/feegrant/v1beta1/allowance/{granter}/{grantee}
   */
  queryAllowance = (granter: string, grantee: string, params: RequestParams = {}) =>
    this.request<V1Beta1QueryAllowanceResponse, RpcStatus>({
      path: `/cosmos/feegrant/v1beta1/allowance/${granter}/${grantee}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryAllowances
   * @summary Allowances returns all the grants for address.
   * @request GET:/cosmos/feegrant/v1beta1/allowances/{grantee}
   */
  queryAllowances = (
    grantee: string,
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<V1Beta1QueryAllowancesResponse, RpcStatus>({
      path: `/cosmos/feegrant/v1beta1/allowances/${grantee}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
 * No description
 * 
 * @tags Query
 * @name QueryAllowancesByGranter
 * @summary AllowancesByGranter returns all the grants given by an address
Since v0.46
 * @request GET:/cosmos/feegrant/v1beta1/issued/{granter}
 */
  queryAllowancesByGranter = (
    granter: string,
    query?: {
      "pagination.key"?: string;
      "pagination.offset"?: string;
      "pagination.limit"?: string;
      "pagination.count_total"?: boolean;
      "pagination.reverse"?: boolean;
    },
    params: RequestParams = {},
  ) =>
    this.request<V1Beta1QueryAllowancesByGranterResponse, RpcStatus>({
      path: `/cosmos/feegrant/v1beta1/issued/${granter}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
