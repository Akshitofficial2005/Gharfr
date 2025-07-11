// Simple mock socket service for development
class RealSocketService {
  private _connected = false;

  connect(userId: string) {
    console.log('Socket connecting for user:', userId);
    this._connected = true;
  }

  disconnect() {
    this._connected = false;
  }

  sendMessage(data: any) {
    console.log('Sending message:', data);
  }

  onNewMessage(callback: (message: any) => void) {
    console.log('Listening for new messages');
  }

  onMessageRead(callback: (data: any) => void) {
    console.log('Listening for message read');
  }

  onUserTyping(callback: (data: any) => void) {
    console.log('Listening for typing');
  }

  sendTyping(receiverId: string, typing: boolean) {
    console.log('Sending typing:', receiverId, typing);
  }

  onUserOnline(callback: (data: any) => void) {
    console.log('Listening for online status');
  }

  markMessageRead(messageId: string) {
    console.log('Marking message read:', messageId);
  }

  off(event: string, callback?: Function) {
    console.log('Removing listener:', event);
  }

  get connected() {
    return this._connected;
  }
}

export const realSocketService = new RealSocketService();