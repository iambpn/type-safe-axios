import { describe, expect, it, jest } from "@jest/globals";
import { expectTypeTestsToPassAsync } from "jest-tsd";
import { TypedAxios } from "../src/axios.wrapper";
import axios from "axios";

it("should not produce static type errors", async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe("Axios Wrapper Tests", () => {
  describe("verify default axios instance", () => {
    it("should create instance with default axios", async () => {
      const client = new TypedAxios<{}>();

      // test the default axios instance works
      try {
        const { data } = await client.rawRequest({
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts/1",
        });
        expect(data).toBeDefined();
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          // expect error to be an AxiosError
          throw error;
        }
      }
    });
  });

  describe("verify custom axios instance", () => {
    it("should create instance with custom axios", () => {
      const customAxios = axios.create({
        baseURL: "https://api.example.com",
        timeout: 1000,
      });
      const client = new TypedAxios<{}>(customAxios);
      expect(client).toBeInstanceOf(TypedAxios);
    });

    // check if custom axios instance is used
    it("should use custom axios instance", async () => {
      const customAxios = axios.create({
        baseURL: "https://api.example.com",
        timeout: 1000,
      });
      const client = new TypedAxios<{}>(customAxios);
      const spy = jest.spyOn(customAxios, "request");
      try {
        await client.rawRequest({
          method: "GET",
          url: "/test",
        });
      } catch (error) {
        // ignore error
      }
      expect(spy).toHaveBeenCalled();
    });
  });
});
