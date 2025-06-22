// Mock authentication
export const mockAuth = {
  isAuthenticated: false,
  login: (callback: () => void) => {
    mockAuth.isAuthenticated = true;
    callback();
  },
  logout: (callback: () => void) => {
    mockAuth.isAuthenticated = false;
    callback();
  },
};