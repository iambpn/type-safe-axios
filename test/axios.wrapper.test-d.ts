import { beforeAll, describe, it } from "@jest/globals";
import { expectError, expectType, expectNotType } from "jest-tsd";
import { TypedAxios } from "../src/axios.wrapper";
import axios, { AxiosError, AxiosResponse } from "axios";
import { TypedAxiosError } from "../src/axios.types";

type ApiSchema = {
  GET: {
    "/endpoint": {
      response: {
        success: boolean;
      };
      body: {
        id: string;
      };
      query: {
        filter: string;
      };
    };
    "/endpoint/:id": {
      response: {
        success: boolean;
      };
      params: {
        id: string;
      };
    };
    "/optional-query": {
      response: {
        data: string;
      };
      query?: {
        page?: number;
        limit?: number;
      };
    };
    "/no-query": {
      response: {
        items: string[];
      };
    };
    "/complex-query": {
      response: {
        results: any[];
      };
      query: {
        filters: {
          status: string;
          tags: string[];
        };
        metadata: Record<string, any>;
        nested: {
          deep: {
            value: number;
          };
        };
      };
    };
  };
  ANY: {
    "/any-endpoint": {
      response: {
        success: boolean;
      };
    };
  };
  ERROR_HANDLER: {
    "/": {
      response: {
        message: string;
      };
    };
  };
};

describe("Type Tests", () => {
  let client: TypedAxios<ApiSchema>;

  beforeAll(() => {
    client = new TypedAxios<ApiSchema>();
  });

  describe("Verify Api Schema", () => {
    it("Verify Missing Response in API Schema", () => {
      expectError(
        new TypedAxios<{
          INVALID: {
            "/endpoint": {
              body: {};
            };
          };
        }>()
      );
    });

    it("Verify Only Response Type in API Schema", () => {
      new TypedAxios<{
        INVALID: {
          "/endpoint": {
            response: {};
          };
        };
      }>();
    });
  });

  describe("Verify Method Options", () => {
    it("Verify Required Options Not Provided", async () => {
      expectError(await client.GET("/endpoint", {}));
    });

    it("Verify Method Params Not Allowed", async () => {
      await client.GET("/endpoint", {
        // @ts-expect-error: Params not allowed for this endpoint
        params: {
          id: "123",
        },
      });
    });

    it("Verify Method Query Key Missing", async () => {
      await client.GET("/endpoint", {
        body: {
          id: "123",
        },
        // @ts-expect-error: Required Query keys missing
        query: {},
      });
    });

    it("Verify Method Query Options Missing", async () => {
      expectError(
        await client.GET("/endpoint", {
          body: {
            id: "123",
          },
        })
      );
    });

    it("Verify Method Body Key Missing", async () => {
      await client.GET("/endpoint", {
        // @ts-expect-error: Required body keys missing
        body: {},
        query: {
          filter: "active",
        },
      });
    });

    it("Verify Method Body Options Missing", async () => {
      expectError(
        await client.GET("/endpoint", {
          query: {
            filter: "active",
          },
        })
      );
    });

    it("Verify Method Missing Params Keys", async () => {
      await client.GET("/endpoint/:id", {
        // @ts-expect-error: Missing required params keys
        params: {},
      });
    });

    it("Verify Method Missing Params Options", async () => {
      expectError(await client.GET("/endpoint/:id", {}));
    });

    it("Verify Custom Endpoint", () => {
      client.request("ANY", "/any-endpoint", {});
    });
  });

  describe("Verify Method Response Type", () => {
    it("Verify GET /endpoint Response Type", async () => {
      const res = await client.GET("/endpoint", {
        body: {
          id: "123",
        },
        query: {
          filter: "active",
        },
      });
      expectType<{ success: boolean }>(res);
    });

    it("Verify GET /endpoint/:id Response Type", async () => {
      const res = await client.GET("/endpoint/:id", {
        params: {
          id: "123",
        },
      });
      expectType<{ success: boolean }>(res);
    });

    it("Verify GET /endpoint response type as AxiosResponse", async () => {
      const res = await client.GET("/endpoint", {
        body: {
          id: "123",
        },
        query: {
          filter: "active",
        },
        returnAxiosResponse: true,
      });
      expectNotType<{ success: boolean }>(res);
      expectType<AxiosResponse<{ success: boolean }>>(res);
    });

    it("Verify Raw Request response type as AxiosResponse", async () => {
      const res = await client.rawRequest({
        method: "GET",
        url: "/endpoint",
        body: {
          id: "123",
        },
        query: { filter: "active" },
      });
      expectType<AxiosResponse<any>>(res);
    });

    it("Verify Error type", async () => {
      const error: TypedAxiosError<ApiSchema> = new AxiosError("Test", "404");
      expectType<TypedAxiosError<ApiSchema>>(error);
      expectType<ApiSchema["ERROR_HANDLER"]["/"]["response"]>(error.response!.data);
    });

    it("Verify Unknown Error type", async () => {
      type schema = {};
      const error: TypedAxiosError<schema> = new AxiosError("Test", "404");
      expectType<TypedAxiosError<schema>>(error);
      expectType<any>(error.response!.data);
    });
  });

  describe("Verify Optional Query Parameters", () => {
    it("Verify endpoint with optional query can be called without query", async () => {
      const res = await client.GET("/optional-query", {});
      expectType<{ data: string }>(res);
    });

    it("Verify endpoint with optional query can be called with partial query", async () => {
      const res = await client.GET("/optional-query", {
        query: {
          page: 1,
        },
      });
      expectType<{ data: string }>(res);
    });

    it("Verify endpoint with optional query can be called with full query", async () => {
      const res = await client.GET("/optional-query", {
        query: {
          page: 1,
          limit: 10,
        },
      });
      expectType<{ data: string }>(res);
    });

    it("Verify endpoint with optional query can be called with empty query object", async () => {
      const res = await client.GET("/optional-query", {
        query: {},
      });
      expectType<{ data: string }>(res);
    });
  });

  describe("Verify Arbitrary Query Parameters", () => {
    it("Verify endpoint without defined query allows arbitrary query params", async () => {
      const res = await client.GET("/no-query", {
        query: {
          anyKey: "anyValue",
          anotherKey: 123,
          boolKey: true,
        },
      });
      expectType<{ items: string[] }>(res);
    });

    it("Verify endpoint without defined query can be called without query", async () => {
      const res = await client.GET("/no-query", {});
      expectType<{ items: string[] }>(res);
    });

    it("Verify endpoint without defined query allows empty query object", async () => {
      const res = await client.GET("/no-query", {
        query: {},
      });
      expectType<{ items: string[] }>(res);
    });
  });

  describe("Verify Complex Query Types", () => {
    it("Verify endpoint with nested object query parameters", async () => {
      const res = await client.GET("/complex-query", {
        query: {
          filters: {
            status: "active",
            tags: ["tag1", "tag2"],
          },
          metadata: {
            customField1: "value1",
            customField2: 123,
            customField3: true,
            nested: {
              deep: "value",
            },
          },
          nested: {
            deep: {
              value: 42,
            },
          },
        },
      });
      expectType<{ results: any[] }>(res);
    });

    it("Verify query with Record<string, any> accepts various types", async () => {
      const res = await client.GET("/complex-query", {
        query: {
          filters: {
            status: "active",
            tags: ["a", "b"],
          },
          metadata: {
            stringValue: "test",
            numberValue: 100,
            booleanValue: false,
            arrayValue: [1, 2, 3],
            objectValue: { key: "value" },
            nullValue: null,
            undefinedValue: undefined,
          },
          nested: {
            deep: {
              value: 999,
            },
          },
        },
      });
      expectType<{ results: any[] }>(res);
    });
  });
});
