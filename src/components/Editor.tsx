"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function Editor() {
  useEffect(() => {
    const doc = new Y.Doc();

    // Connect to the server you just launched
    const provider = new WebsocketProvider(
      "ws://localhost:1234",  // server URL
      "my-roomname",          // room name
      doc
    );

    provider.on("status", (event: any) => {
      console.log("WebSocket status:", event.status); 
      // should log "connected" once it's working
    });

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, []);

  return <div>Collaborative editor is running</div>;
}
