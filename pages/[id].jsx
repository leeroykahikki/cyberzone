import { Grid, Container, Pagination } from '@mui/material';
import { parseCookies } from '/utils/cookieParser';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CardItem from 'components/Card';
import Header from '/components/Header';
import { AuthorizationContext } from '/pages/_app';

function Home({ dataFetch, authorizationStatus, authorizationCookie }) {
  const { articles, pageCount, id } = dataFetch;
  const [cardItems, setCardItems] = useState(articles);
  const [currentPage, setCurrentPage] = useState(id);
  const [pages, setPages] = useState(pageCount);
  const { isAuthorized, toggleAuthorization } = useContext(AuthorizationContext);
  const router = useRouter();

  useEffect(() => {
    if (authorizationStatus != isAuthorized) {
      toggleAuthorization();
    }
  }, []);

  const handleRemoveCardItem = (id) => {
    setCardItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangePage = async (event, value) => {
    await axios
      .get(`http://localhost:5500/articles?_page=${value}&_limit=9`)
      .then((res) => {
        setCurrentPage(value);
        setPages(Number(res.headers['x-total-count']));
        setCardItems(res.data.reverse());
        router.push(`${value}`);
      })
      .catch((err) => console.error('REQUEST ERROR:', err));
  };

  return (
    <>
      <Header
        title="Новостная лента"
        isAuthorized={isAuthorized}
        toggleAuthorization={toggleAuthorization}
      />
      <Container sx={{ marginBottom: '20px' }}>
        <Grid container spacing={3}>
          {cardItems &&
            cardItems.map(({ id, source, author, title, description, coverImage, content }) => (
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={id + '_Grid'}>
                <CardItem
                  id={id}
                  source={source}
                  author={author}
                  title={title}
                  description={description}
                  image={coverImage}
                  date={content.time}
                  isAuthorized={isAuthorized}
                  authorizationCookie={authorizationCookie}
                  handleRemoveCardItem={handleRemoveCardItem}
                />
              </Grid>
            ))}
        </Grid>

        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: '20px' }}>
          <Grid item xs={3}>
            <Pagination count={pageCount} page={currentPage} onChange={handleChangePage} />
          </Grid>
        </Grid>
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

  // Articles
  let articles = null;
  let pageCount = null;
  let { id } = params;

  await axios
    .get(`http://localhost:5500/articles?_page=${id}&_limit=9`)
    .then((res) => {
      pageCount = Number(res.headers['x-total-count']);
      articles = res.data.reverse();
    })
    .catch((err) => console.error('REQUEST ERROR:', err));

  pageCount = Math.ceil(pageCount / 9);
  id = Number(id);
  const dataFetch = { articles, pageCount, id };

  return {
    props: {
      dataFetch,
      authorizationStatus,
      authorizationCookie: data.accessToken ? data.accessToken : null,
    },
  };
}

export default Home;
