"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { createClient } from "@/lib/supabase/client";
import { SupabaseProvider } from "y-supabase";
import * as Y from "yjs";

const supabase = createClient();
const doc = new Y.Doc();

// A basic Supabase real-time provider
const provider = new SupabaseProvider(doc, supabase, {
  channel: "documents",
  id: "document-1",
  tableName: "documents",
  columnName: "data",
});

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
