import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { useState } from 'react';
import { useSaveCallback } from '/components/Editor/hooks';
import Header from '/components/Header';
import { parseCookies } from '/utils/cookieParser';
const Editor = dynamic(() => import('/components/Editor').then((m) => m.Editor), { ssr: false });

export default function Article({ authorizationStatus, authorizationCookie }) {
  const [editor, setEditor] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(authorizationStatus);

  const onSave = useSaveCallback(editor);
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const toggleAuthorization = () => {
    setIsAuthorized((isAuthorized) => !isAuthorized);
  };

  const onSubmit = async (data) => {
    console.log(data);
    await onSave()
      .then((dataEditor) => {
        data.publishedAt = dataEditor.time;
        data.content = dataEditor.blocks;
      })
      .catch(() => console.log('ERROR'));

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authorizationCookie,
    };

    await axios.post('http://localhost:5500/articles', data, { headers: headers });
  };

  if (isAuthorized) {
    return (
      <>
        <Header
          title="Просмотр статьи"
          isAuthorized={isAuthorized}
          toggleAuthorization={toggleAuthorization}
        />
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl error sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Заголовок</InputLabel>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Заголовок" />
                    )}
                  />
                  <FormHelperText>Some important helper text</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Источник</InputLabel>
                  <Controller
                    name="source"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Источник" />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Описание</InputLabel>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Описание" />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Paper sx={{ height: '100%', minHeight: '50vh' }}>
              <Editor reInit editorRef={setEditor} readOnly={false} />
            </Paper>

            <Grid container spacing={1} sx={{ marginTop: '2px' }}>
              <Grid item>
                <Button variant="contained" onClick={onSave}>
                  save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained">toggle</Button>
              </Grid>
            </Grid>

            <input type="submit" />
          </form>
        </Container>
      </>
    );
  } else {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return <></>;
  }
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
    .catch((err) => console.log('REQUEST ERROR: ', err));

  // Article
  let dataFetch = null;
  if (authorizationStatus) {
    const { id } = params;

    axios
      .get(`http://localhost:5500/articles/${id}`)
      .then((res) => {
        dataFetch = res.data;
      })
      .catch((error) => console.log('REQUEST ERROR: ', error));
  }

  return {
    props: {
      dataFetch: dataFetch && dataFetch,
      authorizationStatus,
      authorizationCookie: data.accessToken ? data.accessToken : null,
    },
  };
}
