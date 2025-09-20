import { TypedAxios } from "../src/axios.wrapper.js";

type ApiSchema = {
  GET: {
    "/users": {
      query: { search: string }; // ✅ required
      response: { id: number; name: string }[];
    };
    "/users/:id": {
      params: { id: string }; // ✅ required
      response: { id: number; name: string };
    };
  };
  POST: {
    "/users": {
      body: { name: string }; // ✅ required
      response: { id: number; name: string };
    };
    "/posts": {
      body: { title: string; content: string }; // ✅ required
      query: { publish: boolean }; // ✅ required
      response: { id: number; title: string };
    };
  };
};

const api = new TypedAxios<ApiSchema>();

async function example() {
  // ✅ requires query
  const users = await api.request("GET", "/users", {
    query: { search: "Alice" },
  });

  // ❌ error if query missing
  // await api.request("GET", "/users", {}); // TS error

  // ✅ requires params
  const user = await api.request("GET", "/users/:id", {
    params: { id: "123" },
  });

  // ✅ requires body
  const newUser = await api.request("POST", "/users", {
    body: { name: "Alice" },
  });

  // ✅ requires both body + query
  const post = await api.request("POST", "/posts", {
    body: { title: "Hi", content: "World" },
    query: { publish: true },
  });
}
