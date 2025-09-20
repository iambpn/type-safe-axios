import { type AxiosRequestConfig } from "axios";

export type HttpMethod<S> = keyof S & string;
export type Endpoints<S, M extends HttpMethod<S>> = keyof S[M] & string;

type ExtractConfig<T> = (T extends { body: infer B } ? { body: B } : {}) &
  (T extends { params: infer P } ? { params: P } : {}) &
  (T extends { query: infer Q } ? { query: Q } : {}) & {
    config?: AxiosRequestConfig;
  };

export type RequestConfig<S, M extends HttpMethod<S>, U extends Endpoints<S, M>> = ExtractConfig<S[M][U]>;

export type ResponseType<S, M extends HttpMethod<S>, U extends Endpoints<S, M>> = S[M][U] extends { response: infer R }
  ? R
  : never;
