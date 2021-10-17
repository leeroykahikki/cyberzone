import dynamic from 'next/dynamic';
import axios from 'axios';
import { Container, Paper, Typography } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import Header from '/components/Header';
import { parseCookies } from '/utils/cookieParser';
import { AuthorizationContext } from '/pages/_app';
const Editor = dynamic(() => import('/components/Editor').then((m) => m.Editor), { ssr: false });

export default function Article({ authorizationStatus, dataFetch }) {
  const [editor, setEditor] = useState(null);
  const { isAuthorized, toggleAuthorization } = useContext(AuthorizationContext);

  useEffect(() => {
    if (authorizationStatus != isAuthorized) {
      toggleAuthorization();
    }
  }, []);

  return (
    <>
      <Header title="Просмотр статьи" />
      <Container>
        <Typography variant="h3" component="div" sx={{ marginBottom: '10px' }}>
          {dataFetch.title}
        </Typography>
        <Paper sx={{ height: '100%', minHeight: '50vh' }}>
          <Editor reInit editorRef={setEditor} data={dataFetch.content} readOnly={true} />
        </Paper>
      </Container>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  // isAuthorized
  const data = parseCookies(req);
  let authorizationStatus = null;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + data.accessToken,
  };

  await axios
    .post('http://localhost:5500/authorization', {}, { headers: headers })
    .then((res) => {
      authorizationStatus = res.data.authorized;
    })
    .catch((err) => console.error('REQUEST ERROR: ', err));

  // Article
  let dataFetch = null;
  const { id } = params;

  await axios
    .get(`http://localhost:5500/articles/${id}`)
    .then((res) => {
      dataFetch = res.data;
    })
    .catch((error) => console.error('REQUEST ERROR: ', error));

  return {
    props: {
      dataFetch: dataFetch && dataFetch,
      authorizationStatus,
    },
  };
}
