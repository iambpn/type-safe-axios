# TS-Axios-Wrapper

A lightweight TypeScript axios wrapper that provides full type safety for API requests and responses.

## Features of ts-axios-wrapper

- **Type-Safe API Calls**: Define your API schema once and get complete type checking for all requests
- **Path Parameter Validation**: Type checking for URL path parameters
- **Query Parameter Validation**: Type checking for URL query parameters
- **Request Body Validation**: Type checking for request body objects
- **Response Type Inference**: Automatically infers the correct response types for each endpoint
- **Axios Integration**: Works with your existing Axios instance and configuration

## Installation

```bash
npm install ts-axios-wrapper
# or
yarn add ts-axios-wrapper
```

## Basic Usage

Define your `ts-axios-wrapper` API schema and start making fully type-safe requests:

```typescript
import { TypedAxios, TypedAxiosError } from "ts-axios-wrapper";

// Define your API schema
type ApiSchema = {
  GET: {
    "/users": {
      query: { search: string };
      response: { id: number; name: string }[];
    };
    "/users/:id": {
      params: { id: string };
      response: { id: number; name: string };
    };
  };
  POST: {
    "/users": {
      body: { name: string };
      response: { id: number; name: string };
    };
  };
  ERROR_HANDLER: {
    "/": {
      response: { message: string };
    };
  };
};

// Create a typed instance
// this is just a axios wrapper.
// You can pass your own axios instance with custom config if needed.
const tsAxios = new TypedAxios<ApiSchema>();

// Make type-safe requests
async function example() {
  // GET with query params - TypeScript ensures you provide the required query params
  const users = await tsAxios.request("GET", "/users", {
    query: { search: "Alice" },
  });
  // users is typed as { id: number; name: string }[]

  // GET with path params - TypeScript ensures you provide the required path params
  const user = await tsAxios.request("GET", "/users/:id", {
    params: { id: "123" },
  });
  // user is typed as { id: number; name: string }

  // POST with body - TypeScript ensures you provide the required body
  const newUser = await tsAxios.request("POST", "/users", {
    body: { name: "Alice" },
  });
  // newUser is typed as { id: number; name: string }

  // ---
  // You can also use specific methods for convenience
  // ---

  // GET with query params
  const users1 = await tsAxios.GET("/users", {
    query: { search: "Alice" },
  });
  // users is typed as { id: number; name: string }[]

  // GET with path params
  const user1 = await tsAxios.GET("/users/:id", {
    params: { id: "123" },
  });
  // user is typed as { id: number; name: string }

  // POST with body
  const newUser1 = await tsAxios.POST("/users", {
    body: { name: "Alice" },
  });
  // newUser is typed as { id: number; name: string

  //---
  // Error Handling with Global Error Type
  //---

  try {
    const user2 = await tsAxios.GET("/users/:id", {
      params: { id: "non-existent-id" },
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const typedError = error as TypedAxiosError<ApiSchema>;
      // typedError is typed as AxiosResponse<{ message: string }>
      console.error("API Error:", typedError.response?.data.message);
    } else {
      console.error("Unexpected Error:", error);
    }
  }
}
```

## Advanced Configuration

You can provide a custom Axios instance with any configuration you need:

```typescript
import axios from "axios";
import { TypedAxios } from "ts-axios-wrapper";

const axiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
  },
});

const tsAxios = new TypedAxios<ApiSchema>(axiosInstance);
```

## API Schema Definition

Your API schema defines the shape of your API endpoints:

```typescript
type ApiSchema = {
  // HTTP Method: GET, POST, PUT, DELETE, etc.
  [HTTP_METHOD]: {
    // Endpoint URL: /users, /users/:id, etc.
    [ENDPOINT]: {
      // Optional path parameters
      params?: { [PARAM_NAME: string]: string | number };
      // Optional query parameters
      query?: { [QUERY_PARAM: string]: string | number | boolean };
      // Optional request body
      body?: any;
      // Response type
      response: any;
    };
  };
  // Adding Global Error Type
  ERROR_HANDLER: {
    // Path must be "/"
    "/": {
      response: { [key: string]: any }; // Defile the shape of error response here
    };
  };
};
```

## Per-Request Axios Configuration

You can pass Axios config options for each individual request:

```typescript
const user = await tsAxios.request("GET", "/users/:id", {
  params: { id: "123" },
  // additional Axios config for this request
  config: {
    timeout: 5000,
    headers: {
      "Cache-Control": "no-cache",
    },
  },
});
```

## Examples

See the [examples](./examples) directory for more usage examples.

## Changelog

see [changelog.md](./changelog.md) for release notes.
