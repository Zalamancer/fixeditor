"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function Editor() {
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<WebsocketProvider>();

  // Sets up the Y.js document and Websocket provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    // Use `ws` for local development
    const yProvider = new WebsocketProvider(
      "ws://localhost:1234",
      "my-roomname",
      yDoc
    );

    yProvider.on("status", (event: any) => {
      console.log("WebSocket status:", event.status);
    });
    
    yProvider.on('error', (event: any) => {
      console.error('Websocket connection error: ', event)
    });

    yProvider.on('close', (event: any) => {
      console.log('Websocket connection closed: ', event)
    });


    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, []);

  // Creates a BlockNote editor instance
  const editor: BlockNoteEditor | null = useCreateBlockNote({
    collaboration: {
      // Passes in the Y.js provider and document
      provider,
      fragment: doc?.getXmlFragment("document"),
      // You can add a name and color for each user
      user: {
        name: "User",
        color: "#ff0000",
      },
    },
  });

  if (!editor || !provider) {
    return <div>Loading Editor...</div>;
  }

  // Renders the editor
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Collaborative BlockNote Editor
      </h1>
      <BlockNoteView editor={editor} theme={"light"} />
    </div>
  );
}
