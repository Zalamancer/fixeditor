"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export default function Editor() {
  useEffect(() => {
    const doc = new Y.Doc();

    // Connect to your local websocket server
    const provider = new WebsocketProvider(
      "ws://localhost:1234",  // server URL
      "my-roomname",          // room name
      doc
    );

    provider.on("status", (event: any) => {
      console.log("WebSocket status:", event.status); 
      // should log "connected" once it's working
    });

    // You can listen to document updates and render them here
    doc.on('update', (update: any) => {
      // For now, we'll just log that the document has changed.
      console.log("Document updated");
    });

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, []);

  // A simple textarea to demonstrate basic collaborative editing
  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:1234", "my-roomname", doc);
    const ytext = doc.getText('my-textarea');
    
    const textarea = document.querySelector('textarea');
    if (textarea) {
      ytext.observe(event => {
        textarea.value = ytext.toString();
      });

      textarea.oninput = () => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, textarea.value);
      };
    }

    return () => {
      provider.destroy();
      doc.destroy();
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Collaborative Editor</h1>
      <p className="mb-2">Changes in the textarea below will be synced with other connected clients.</p>
      <textarea className="w-full h-64 p-2 border rounded-md" placeholder="Start typing..."></textarea>
    </div>
  );
}
