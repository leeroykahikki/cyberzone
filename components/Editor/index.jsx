import EditorJS from '@editorjs/editorjs';
import tools from './tools';
import { useEffect, useState } from 'react';

export const useEditor = (toolsList, { data, editorRef }, readOnly) => {
  const [editorInstance, setEditor] = useState(null);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editor',
      tools: toolsList,
      data: data || {},
      readOnly: readOnly || false,
      placeholder: 'Введите текст вашей статьи',
      autofocus: true,
    });

    setEditor(editor);

    return () => {
      editor.isReady
        .then(() => {
          editor.destroy();
          setEditor(null);
        })
        .catch((error) => console.error('ERROR editor cleanup', error));
    };
  }, [toolsList]);

  useEffect(() => {
    if (!editorInstance) {
      return;
    }
    // Send instance to the parent
    if (editorRef) {
      editorRef(editorInstance);
    }
  }, [editorInstance, editorRef]);

  return { editor: editorInstance };
};

export function Editor({ editorRef, data, readOnly }) {
  useEditor(tools, { data, editorRef }, readOnly);
  return <div id="editor" />;
}
