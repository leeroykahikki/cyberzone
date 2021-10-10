import { useCallback, useState, useEffect } from 'react';

export const useSaveCallback = (editor) => {
  return useCallback(async () => {
    if (!editor) return;
    try {
      const out = await editor.save();
      console.group('EDITOR onSave');
      console.dir(out);
      console.info('Saved in localStorage');
      console.groupEnd();
    } catch (e) {
      console.error('SAVE RESULT failed', e);
    }
  }, [editor]);
};
