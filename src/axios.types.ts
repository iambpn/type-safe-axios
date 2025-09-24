import { type AxiosRequestConfig, type AxiosResponse } from "axios";

export type StandardMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | (string & {});

type ExtractConfig<T> = (T extends { body: infer B } ? { body: B } : {}) &
  (T extends { params: infer P } ? { params: P } : {}) &
  (T extends { query: infer Q } ? { query: Q } : {}) & {
    config?: AxiosRequestConfig;
    returnAxiosResponse?: boolean; // if true, return full Axios response instead of just data
  };

type EndpointOptions = {
  response: unknown;
  body?: unknown;
  params?: Record<string, string | number>;
  query?: Record<string, string | number | boolean>;
  config?: AxiosRequestConfig;
  returnAxiosResponse?: boolean;
};

export type ApiSchema = {
  [key in StandardMethods]?: EndpointConfig;
};

export type EndpointConfig = {
  [key in string]: EndpointOptions;
};

export type SchemaHttpMethod<S extends ApiSchema> = keyof S & string;

export type SchemaEndpoints<S extends ApiSchema, M extends SchemaHttpMethod<S>> = keyof S[M] & string;

export type RequestConfig<
  S extends ApiSchema,
  M extends SchemaHttpMethod<S>,
  U extends SchemaEndpoints<S, M>
> = ExtractConfig<S[M][U]>;

export type ResponseType<
  S extends ApiSchema,
  M extends SchemaHttpMethod<S>,
  U extends SchemaEndpoints<S, M>,
  O extends RequestConfig<S, M, U>
> = S[M][U] extends {
  response: infer R;
}
  ? O extends { returnAxiosResponse: infer AR }
    ? AR extends true
      ? AxiosResponse<R>
      : R
    : R
  : never;
