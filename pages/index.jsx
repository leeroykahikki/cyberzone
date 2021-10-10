import Link from 'next/link';
import Header from 'components/Header';
import CardItem from 'components/Card';
import { Grid, Container } from '@mui/material';
import axios from 'axios';

function Home() {
  return (
    <>
      <Header title="Новостная лента" />
      <Container sx={{ marginBottom: '20px' }}>
        <Grid container spacing={3}>
          {Array.from(Array(20)).map((_, index) => (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4} key={index}>
              <CardItem />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  axios
    .get(`http://localhost:5500/articles`)
    .then(function (res) {})
    .catch(function (error) {});

  return {
    props: {},
  };
}

export default Home;
