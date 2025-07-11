export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  token?: string;
  owner?: any;
  pgs?: any[];
  data?: T;
  [key: string]: any;
}
