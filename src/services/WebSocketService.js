// src/services/WebSocketService.js
class WebSocketService {
    constructor(url) {
        this.socketUrl = url;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server ', data);
            if (this.messageHandler) {
                this.messageHandler(data);
            }
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket Disconnected', event);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error ', error);
        };
    }

    setMessageHandler(handler) {
        this.messageHandler = handler;
    }

    sendMessage(message) {
        console.log("Inside sendMessage method of WebSocketService.js");
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. ReadyState: ', this.socket.readyState);
        }
    }

    close() {
        this.socket.close();
    }
}

export default WebSocketService;
