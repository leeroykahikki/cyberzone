import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useEffect, useContext } from 'react';
import { useSaveCallback } from '/components/Editor/hooks';
import Header from '/components/Header';
import { parseCookies } from '/utils/cookieParser';
import { AuthorizationContext } from '/pages/_app';
const Editor = dynamic(() => import('/components/Editor').then((m) => m.Editor), { ssr: false });

export default function Article({ authorizationStatus, authorizationCookie, dataFetch }) {
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthorized, toggleAuthorization } = useContext(AuthorizationContext);

  useEffect(() => {
    if (authorizationStatus != isAuthorized) {
      toggleAuthorization();
    }
  }, []);

  const onSave = useSaveCallback(editor);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Метод, который срабатывает при создании статьи
  const onSubmit = async (data) => {
    setLoading(true);

    // Получаем данные из EditorJS
    await onSave()
      .then((dataEditor) => {
        dataEditor.time = dataFetch.content.time;
        data.content = dataEditor;
      })
      .catch(() => console.log('ERROR'));

    // Отправляем готовую статью в БД
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authorizationCookie,
    };

    await axios.put(`http://localhost:5500/articles/${dataFetch.id}`, data, { headers: headers });
    setLoading(false);
    router.push('/');
  };

  if (isAuthorized) {
    return (
      <>
        <Header title="Изменение статьи" />
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl
                  error={
                    (errors.title && errors.title.type === 'required') ||
                    (errors.title && !(errors.title.type === 'maxLenght'))
                  }
                  sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Заголовок</InputLabel>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue={dataFetch.title}
                    rules={{ required: true, maxLength: 25 }}
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Заголовок" />
                    )}
                  />
                  {(errors.title && errors.title.type === 'required' && (
                    <FormHelperText>Это поле обязательно!</FormHelperText>
                  )) ||
                    (errors.title && !(errors.title.type === 'maxLenght') && (
                      <FormHelperText>Слишком много символов!</FormHelperText>
                    ))}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl
                  error={
                    (errors.author && errors.author.type === 'required') ||
                    (errors.author && !(errors.author.type === 'maxLenght'))
                  }
                  sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Автор</InputLabel>
                  <Controller
                    name="author"
                    control={control}
                    defaultValue={dataFetch.author}
                    rules={{ required: true, maxLength: 30 }}
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Автор" />
                    )}
                  />
                  {(errors.author && errors.author.type === 'required' && (
                    <FormHelperText>Это поле обязательно!</FormHelperText>
                  )) ||
                    (errors.author && !(errors.author.type === 'maxLenght') && (
                      <FormHelperText>Слишком много символов!</FormHelperText>
                    ))}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl
                  error={errors.source && !(errors.source.type === 'maxLenght')}
                  sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Источник</InputLabel>
                  <Controller
                    name="source"
                    control={control}
                    defaultValue={dataFetch.source}
                    rules={{ maxLength: 30 }}
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Источник" />
                    )}
                  />
                  {errors.source && !(errors.source.type === 'maxLenght') && (
                    <FormHelperText>Слишком много символов!</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormControl
                  error={
                    (errors.coverImage && errors.coverImage.type === 'required') ||
                    (errors.coverImage && errors.coverImage.type === 'pattern')
                  }
                  sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Ссылка на превью</InputLabel>
                  <Controller
                    name="coverImage"
                    control={control}
                    defaultValue={dataFetch.coverImage}
                    rules={{
                      required: true,
                      pattern:
                        /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    }}
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Ссылка на превью" />
                    )}
                  />
                  {(errors.coverImage && errors.coverImage.type === 'required' && (
                    <FormHelperText>Это поле обязательно!</FormHelperText>
                  )) ||
                    (errors.coverImage && errors.coverImage.type === 'pattern' && (
                      <FormHelperText>Неправильный формат ссылки!</FormHelperText>
                    ))}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl
                  error={
                    (errors.description && errors.description.type === 'required') ||
                    (errors.description && !(errors.description.type === 'maxLenght'))
                  }
                  sx={{ width: '100%' }}>
                  <InputLabel htmlFor="component-outlined">Описание</InputLabel>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue={dataFetch.description}
                    rules={{ required: true, maxLength: 280 }}
                    render={({ field }) => (
                      <OutlinedInput {...field} id="component-outlined" label="Описание" />
                    )}
                  />

                  {(errors.description && errors.description.type === 'required' && (
                    <FormHelperText>Это поле обязательно!</FormHelperText>
                  )) ||
                    (errors.description && !(errors.description.type === 'maxLenght') && (
                      <FormHelperText>Слишком много символов!</FormHelperText>
                    ))}
                </FormControl>
              </Grid>
            </Grid>

            <Paper sx={{ height: '100%', minHeight: '50vh' }}>
              <Editor reInit editorRef={setEditor} data={dataFetch.content} readOnly={false} />
            </Paper>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingIndicator="Loading..."
              variant="contained"
              sx={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
              Сохранить
            </LoadingButton>
          </form>
        </Container>
      </>
    );
  } else {
    // Если не авторизован, то перебрасывает на главную страницу
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return <></>;
  }
}

export async function getServerSideProps({ params, req }) {
  // Проверяем авторизацию по токену
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

  // Получаем данные нужной статьи
  let dataFetch = null;
  if (authorizationStatus) {
    const { id } = params;

    await axios
      .get(`http://localhost:5500/articles/${id}`)
      .then((res) => {
        dataFetch = res.data;
      })
      .catch((error) => console.error('REQUEST ERROR: ', error));
  }

  return {
    props: {
      dataFetch: dataFetch && dataFetch,
      authorizationStatus,
      authorizationCookie: data.accessToken ? data.accessToken : null,
    },
  };
}
