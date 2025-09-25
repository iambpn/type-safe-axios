import axios, { type AxiosRequestConfig } from "axios";
import type { ApiSchema, RequestConfig, ResponseType, SchemaEndpoints, SchemaHttpMethod } from "./axios.types";
import { buildUrl } from "./axios.utility";

export type { TypedAxiosError } from "./axios.types";

/**
 * A type-safe wrapper around axios.
 * @param S The API schema defining the endpoints, methods, and their types.
 *
 * All Standard methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS) are supported.
 * Custom methods can be added but you will need to create that method in your axios instance.
 * Additionally, a `rawRequest` method is provided for non-type-safe requests.
 *
 * @example
 * ```ts
 * type ApiSchema = {
 *   GET: {
 *     "/endpoint/:id": {
 *       response: {
 *         success: boolean;
 *       };
 *       body: {
 *         id: string;
 *       };
 *       query: {
 *         filter: string;
 *       };
 *       params: {
 *         id: string;
 *       };
 *     };
 *   };
 * };
 */
export class TypedAxios<S extends ApiSchema> {
  constructor(private axiosInstance = axios) {}

  async GET<U extends SchemaEndpoints<S, "GET">, O extends RequestConfig<S, "GET", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "GET", U, O>> {
    return this.request("GET", url, options);
  }

  async POST<U extends SchemaEndpoints<S, "POST">, O extends RequestConfig<S, "POST", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "POST", U, O>> {
    return this.request("POST", url, options);
  }

  async PUT<U extends SchemaEndpoints<S, "PUT">, O extends RequestConfig<S, "PUT", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "PUT", U, O>> {
    return this.request("PUT", url, options);
  }

  async DELETE<U extends SchemaEndpoints<S, "DELETE">, O extends RequestConfig<S, "DELETE", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "DELETE", U, O>> {
    return this.request("DELETE", url, options);
  }

  async PATCH<U extends SchemaEndpoints<S, "PATCH">, O extends RequestConfig<S, "PATCH", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "PATCH", U, O>> {
    return this.request("PATCH", url, options);
  }

  async HEAD<U extends SchemaEndpoints<S, "HEAD">, O extends RequestConfig<S, "HEAD", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "HEAD", U, O>> {
    return this.request("HEAD", url, options);
  }

  async OPTIONS<U extends SchemaEndpoints<S, "OPTIONS">, O extends RequestConfig<S, "OPTIONS", U>>(
    url: U,
    options: O
  ): Promise<ResponseType<S, "OPTIONS", U, O>> {
    return this.request("OPTIONS", url, options);
  }

  async request<M extends SchemaHttpMethod<S>, U extends SchemaEndpoints<S, M>, O extends RequestConfig<S, M, U>>(
    method: M,
    url: U,
    options: O
  ): Promise<ResponseType<S, M, U, O>> {
    const fullUrl = buildUrl(url, (options as any)?.params);

    const res = await this.axiosInstance.request({
      method,
      url: fullUrl,
      data: (options as any)?.body,
      params: (options as any)?.query,
      ...(options?.config || {}),
    });

    if (options?.returnAxiosResponse) {
      return res as any;
    }

    return res.data;
  }

  /**
   * Non-type-safe request method. Use this if you need to make a request
   * that is not defined in the ApiSchema.
   * @param config
   * @returns
   */
  async rawRequest(config: {
    method: string;
    url: string;
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean>;
    body?: unknown;
    config?: AxiosRequestConfig;
  }) {
    const fullUrl = buildUrl(config.url, config.params);

    const res = await this.axiosInstance.request({
      method: config.method,
      url: fullUrl,
      data: config.body,
      params: config.query,
      ...(config.config || {}),
    });

    return res;
  }
}
