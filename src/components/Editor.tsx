"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import SupabaseProvider from "y-supabase";
import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Editor() {
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<SupabaseProvider>();

  // Sets up the Y.js document and Supabase provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const supabase = createClient();
    // Supabase provider
    const yProvider = new SupabaseProvider(yDoc, supabase, {
      channel: "documents",
      tableName: "documents",
      columnName: "content",
      id: "1",
    });

    yProvider.on("status", (event: any) => {
      console.log("Supabase status:", event.status);
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
    collaboration:
      provider && doc
        ? {
            provider,
            fragment: doc.getXmlFragment("document"),
            // You can add a name and color for each user
            user: {
              name: "User",
              color: "#ff0000",
            },
          }
        : undefined,
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
      <BlockNoteViewRaw editor={editor} theme={"light"} />
    </div>
  );
}
