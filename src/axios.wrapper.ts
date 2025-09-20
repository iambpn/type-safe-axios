import axios from "axios";
import { buildUrl } from "./axios.utility.js";
import type { HttpMethod, Endpoints, RequestConfig, ResponseType } from "./axios.types.js";

export class TypedAxios<S extends Record<string, any>> {
  constructor(private axiosInstance = axios) {}

  async request<M extends HttpMethod<S>, U extends Endpoints<S, M>>(
    method: M,
    url: U,
    options: RequestConfig<S, M, U>
  ): Promise<ResponseType<S, M, U>> {
    const fullUrl = buildUrl(url, (options as any)?.params);

    const res = await this.axiosInstance.request({
      method,
      url: fullUrl,
      data: (options as any)?.body,
      params: (options as any)?.query,
      ...(options?.config || {}),
    });

    return res.data;
  }
}
