import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Container, Grid } from '@mui/material';
import Header from 'components/Header';
import { useState } from 'react';
import { useSaveCallback } from '/components/Editor/hooks';
import editorjsHTML from 'editorjs-html';
import ReactHtmlParser from 'react-html-parser';
const Editor = dynamic(() => import('/components/Editor').then((m) => m.Editor), { ssr: false });

export default function Article({ id }) {
  const cleanData = {
    blocks: [
      {
        type: 'header',
        data: {
          text: 'This is a sample Header',
          level: 2,
        },
      },
    ],
  };
  const editorParser = editorjsHTML();
  const html = editorParser.parse(cleanData);
  console.log(html);

  const [editor, setEditor] = useState(null);
  const onSave = useSaveCallback(editor);

  return (
    <>
      <Header title="Просмотр статьи" />
      <Container>
        <Grid container direction="column" alignItems="center" justify="center">
          <div>Hello {id}</div>
        </Grid>
        <div className="editor">
          <Editor reInit editorRef={setEditor} />
        </div>
        <Grid container direction="column" alignItems="center" justify="center">
          <button style={{ display: 'flex', justifyContent: 'center' }} onClick={onSave}>
            save
          </button>
        </Grid>

        {/*Парсинг HTML*/}
        <div>{html.map((i) => ReactHtmlParser(i))}</div>
      </Container>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;

  axios
    .get(`http://localhost:5500/articles/${id}`)
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });

  return {
    props: {
      id,
    },
  };
}
