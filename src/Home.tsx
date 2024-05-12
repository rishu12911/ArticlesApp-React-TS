import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, CardContent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

interface Article {
  id: string;
  title: string;
  summary: string;
  fullText?: string; 
}

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 4;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://ps-dev-1-partnergateway.patientsky.dev/assignment/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.response && error.response.status === 500 && retryCount < maxRetries) {
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

  const fetchFullTextWithRetry = async (id: string) => {
    const article = articles.find(article => article.id === id);
    if (!article || article.fullText) return; 

    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await axios.get(`https://ps-dev-1-partnergateway.patientsky.dev/assignment/articles/${id}`);
        const updatedArticles = articles.map(article => {
          if (article.id === id) {
            return { ...article, fullText: response.data.fullText };
          }
          return article;
        });
        setArticles(updatedArticles);
        break; 
      } catch (error) {
        console.error('Error fetching full text:', error);
        retries++;
      }
    }
  };

  if (loading) {
    return <div><Typography variant="h5" align="center" style={{ marginTop: '50px' }}>Loading...</Typography></div>;
  }

  if (error) {
    return (
      <div>
        <Typography variant="h2" align="center" style={{ marginTop: '50px' }}>Oops! Something Went Wrong...</Typography>
        <Typography variant="h4" align="center" style={{ marginTop: '50px' }}>Error: {error}</Typography>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid container spacing={4} style={{ margin: '20px' }}>
        {articles.map((article) => (
          <Grid item xs={10} sm={10} key={article.id} style={{ marginBottom: '10px' }}>
            <Card style={{ marginBottom: '10px', backgroundColor: '#EBEBEBAA', color: '#fff', boxShadow: '10px 10px 5px #aaaaaa' }}>
            <CardContent>
  <Typography sx={{ fontSize: 28 }} style={{ color: 'black' }} gutterBottom>
    {article.title}
  </Typography>
  <Typography color="text.secondary" variant="body2" style={{ marginBottom: '10px' }}>{article.summary}</Typography>
  <Typography id="article-fullText" className={article.fullText ? 'expand active' : 'expand'}>
    {article.fullText}
  </Typography>
</CardContent>
              <CardActions>
                <Button
                  size="medium"
                  onClick={() => fetchFullTextWithRetry(article.id)}
                  style={{ color: 'light-blue' }}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
