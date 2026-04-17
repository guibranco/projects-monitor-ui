// Mock authentication
export const mockAuth = {
  isAuthenticated: false,
  login: (callback: () => void): void => {
    mockAuth.isAuthenticated = true;
    callback();
  },
  logout: (callback: () => void): void => {
    mockAuth.isAuthenticated = false;
    callback();
  },
};
