// Enhanced placeholder for socketService to fix build errors
export const socketService = {
  connect: () => {},
  disconnect: () => {},
  on: (event: string, callback: (data: any) => void) => {},
  off: (event: string) => {},
  emit: (event: string, data?: any) => {},
};
