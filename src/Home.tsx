import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, CardContent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  summary: string;
}

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://ps-dev-1-partnergateway.patientsky.dev/assignment/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.response && error.response.status === 500 && retryCount < 10) {
          setRetryCount(retryCount + 1);
          setLoading(true);
          return;
        }
        setError(error.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [retryCount]);

  if (loading) {
    return <div><Typography variant="h5" align="center" style={{ marginTop: '50px' }}>
    Loading...
  </Typography></div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" style={{ marginTop: '50px' }}>
        E/G Articles
      </Typography>
      <Grid container spacing={5} style={{ margin: '20px' }}>
        {articles.map((article) => (
          <Grid border={0.5} item xs={10}  sm={10} key={article.id}>
            <CardContent>
              <Typography sx={{ fontSize: 28 }} color="text.secondary" gutterBottom>
                {article.title}
              </Typography>
              <Typography variant="body2">{article.summary}</Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" component={Link} to={`/article/${article.id}`}>
                Read More
              </Button>
            </CardActions>
          </Grid>
        ))}
        

      </Grid>
    </Container>
  );
};

export default Home;
