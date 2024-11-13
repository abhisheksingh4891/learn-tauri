import React, { useEffect } from "react";

const WebSocketTest = () => {
  useEffect(() => {
    // Connect to WebSocket server
    let Socket = new WebSocket("ws://localhost:8055");

    Socket.onmessage = (event: any) => {
      let data = JSON.parse(event.data);
      console.log(data, "web socket data");
    };

    return () => {
      Socket.close();
    };
  }, []);
  return <div>WebSocket</div>;
};

export default WebSocketTest;
