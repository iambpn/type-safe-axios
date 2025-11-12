# Changelog

- 1.0.1:

  - Updated package description for clarity.

- 1.1.0:

  - Improved type definitions
  - Switched from `axios.request` to specific method calls like `axios.get`, `axios.post`, etc. for better type inference.
  - Added support for additional HTTP methods (PUT, DELETE, PATCH, HEAD, OPTIONS)
  - Added `Raw Request` Support for more flexibility in making untyped requests.
  - Switched from `EMS` to `CJS` Module system for better compatibility.
  - Added `test` for easier testing during development.
  - Updated `README.md` for better documentation.

- 1.1.1

  - updated readme

- 1.1.2

  - added main and types field in package.json for better compatibility with various module systems.
  - updated testcases and package.json scripts for better testing and building processes.

- 1.1.3

  - added `TypedAxiosError` for better type safe error handling. Uses `ERROR_HANDLER` key in schema to define error type.

- 1.1.4

  - fixed issue with using custom axios instance in `TypedAxios` class. Now supports passing a custom axios instance via constructor.