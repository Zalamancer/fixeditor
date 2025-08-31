"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const doc = new Y.Doc();
// More providers at: https://github.com/yjs/yjs#yjs-providers
const provider = new WebsocketProvider(
  // Use a public server in this example
  "ws://localhost:1234",
  "my-roomname",
  doc
);

provider.on('status', event => {
  console.log('Websocket status:', event.status); // logs "connected" or "disconnected"
});

provider.on('sync', (isSynced: boolean) => {
  console.log('Websocket sync status:', isSynced);
});

provider.on('connection-error', error => {
  console.error('Websocket connection error:', error);
})

provider.on('connection-close', event => {
  console.warn('Websocket connection closed:', event);
})

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-xml"),
      // Information for this user:
      user: {
        name: "My User",
        color: "#ff0000",
      },
    },
  });

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}
