import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios'; // Import AxiosError

interface Article {
  id: string;
  title: string;
  summary: string;
  fullText: string;
}

const FullText: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://ps-dev-1-partnergateway.patientsky.dev/assignment/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (error: any) { // Explicitly type error as any
        if (error.response && error.response.status === 500 && retryCount < 10) {
          setRetryCount(retryCount + 1);
          setLoading(true);
          return;
        }
        setError(error.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, retryCount]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        
      </div>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4">Article Not Found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <br />
      <Typography variant="h4">{article.title}</Typography>
      <br />
      <Typography variant="subtitle1">{article.summary}</Typography>
      <br />
      <Typography variant="body2">{article.fullText}</Typography>
    </Container>
  );
};

export default FullText;
