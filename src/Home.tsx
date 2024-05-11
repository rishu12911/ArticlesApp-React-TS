import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, CardContent, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import Card from '@mui/material/Card';

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
        if (error.response && error.response.status === 500 && retryCount < 2) {
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

  if (error ) {
    return (
      <div>
        <Typography variant="h2" align="center" style={{ marginTop: '50px' }}>
      Error: {error} </Typography>
      <Typography variant="h4" align="center" style={{ marginTop: '50px' }}> Please Go Back </Typography>
       
    
        
      </div>
    );
  }

  return (
    <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center' }}>
    {/* <Typography variant="h4" align="center" style={{ marginTop: '50px' }}>
      E/G Articles
    </Typography> */}
    <Grid container spacing={4} style={{ margin: '20px' }}>
      {articles.map((article) => (
        <Grid item xs={10} sm={12} key={article.id} style={{ marginBottom: '10px' }}>
          <Card style={{ marginBottom: '10px', backgroundColor: '#EBEBEBAA', color: '#fff' }}>
            <CardContent>
              <Typography sx={{ fontSize: 28 }} style={{ color: 'black' }}  gutterBottom>
                {article.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">{article.summary}</Typography>
            </CardContent>
            <CardActions>
              <Button size="medium" component={Link} to={`/article/${article.id}`} style={{ color: 'light-blue' }}>
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
