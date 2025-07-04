// Manual mock for axios to fix Jest ESM import issues
const axios = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(() => axios),
  defaults: {
    headers: {
      common: {}
    }
  }
};

// Create AxiosError mock
const AxiosError = class extends Error {
  constructor(message, code, config, request, response) {
    super(message);
    this.name = 'AxiosError';
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
  }
};

axios.AxiosError = AxiosError;

export default axios;
export { AxiosError }; 