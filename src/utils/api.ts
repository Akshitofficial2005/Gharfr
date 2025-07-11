const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }

  // Auth endpoints
  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(credentials: any) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });
    return this.handleResponse(response);
  }

  // PG endpoints
  async getPGs(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/pgs?${queryString}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getPGById(id: string) {
    const response = await fetch(`${API_BASE_URL}/pgs/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createPG(pgData: any) {
    const response = await fetch(`${API_BASE_URL}/pgs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(pgData)
    });
    return this.handleResponse(response);
  }

  async updatePG(id: string, pgData: any) {
    const response = await fetch(`${API_BASE_URL}/pgs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(pgData)
    });
    return this.handleResponse(response);
  }

  // Booking endpoints
  async createBooking(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookingData)
    });
    return this.handleResponse(response);
  }

  async getBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getBookingById(id: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Payment endpoints
  async createPaymentOrder(bookingId: string, amount: number) {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ bookingId, amount })
    });
    return this.handleResponse(response);
  }

  async verifyPayment(paymentData: any) {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData)
    });
    return this.handleResponse(response);
  }

  // Upload endpoints
  async uploadImages(files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
  }

  // Messages
  async getMessages(userId: string) {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async sendMessage(messageData: any) {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(messageData)
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();