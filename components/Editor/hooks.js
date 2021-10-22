import { useCallback } from 'react';

// Метод для получения данных из EditorJS
export const useSaveCallback = (editor) => {
  return useCallback(async () => {
    if (!editor) return;
    try {
      const out = await editor.save();
      return out;
    } catch (e) {
      console.error('SAVE RESULT failed', e);
    }
  }, [editor]);
};
