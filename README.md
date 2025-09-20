# TS-Axios-Wrapper

A lightweight TypeScript wrapper around Axios that provides full type safety for API requests and responses.

## Features

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

Define your API schema and start making fully type-safe requests:

```typescript
import { TypedAxios } from "ts-axios-wrapper";

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
};

// Create a typed instance
const api = new TypedAxios<ApiSchema>();

// Make type-safe requests
async function example() {
  // GET with query params - TypeScript ensures you provide the required query params
  const users = await api.request("GET", "/users", {
    query: { search: "Alice" },
  });
  // users is typed as { id: number; name: string }[]

  // GET with path params - TypeScript ensures you provide the required path params
  const user = await api.request("GET", "/users/:id", {
    params: { id: "123" },
  });
  // user is typed as { id: number; name: string }

  // POST with body - TypeScript ensures you provide the required body
  const newUser = await api.request("POST", "/users", {
    body: { name: "Alice" },
  });
  // newUser is typed as { id: number; name: string }
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

const api = new TypedAxios<ApiSchema>(axiosInstance);
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
};
```

## Per-Request Axios Configuration

You can pass Axios config options for each individual request:

```typescript
const user = await api.request("GET", "/users/:id", {
  params: { id: "123" },
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
