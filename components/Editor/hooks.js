import { useCallback, useState, useEffect } from 'react';

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
