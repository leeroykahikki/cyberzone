import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import SimpleImage from '@editorjs/simple-image';

// Экспортируем настройки плагинов для EditorJS
export default {
  header: {
    class: Header,
    config: {
      placeholder: 'Заголовок',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  embed: Embed,
  table: Table,
  linkTool: LinkTool,
  simpleImage: SimpleImage,
};
