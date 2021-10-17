import { Grid, Container } from '@mui/material';
import { parseCookies } from '/utils/cookieParser';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CardItem from 'components/Card';
import Header from '/components/Header';
import { AuthorizationContext } from '/pages/_app';

function Home({ articles, authorizationStatus, authorizationCookie }) {
  const [cardItems, setCardItems] = useState(articles);
  const { isAuthorized, toggleAuthorization } = useContext(AuthorizationContext);

  useEffect(() => {
    if (authorizationStatus != isAuthorized) {
      toggleAuthorization();
    }
  }, []);

  const handleRemoveCardItem = (id) => {
    setCardItems((prev) => prev.filter((item) => item.id !== id));
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
      </Container>
    </>
  );
}

export async function getServerSideProps({ req }) {
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

  await axios
    .get(`http://localhost:5500/articles`)
    .then((res) => {
      articles = res.data.reverse();
    })
    .catch((err) => console.error('REQUEST ERROR:', err));

  return {
    props: {
      articles,
      authorizationStatus,
      authorizationCookie: data.accessToken ? data.accessToken : null,
    },
  };
}

export default Home;
