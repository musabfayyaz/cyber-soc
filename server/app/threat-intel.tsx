
'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GppGood, GppBad } from '@mui/icons-material';

interface ThreatEntryMatch {
  threatType: string;
  platformType: string;
  threatEntryType: string;
  threatEntry: {
    url: string;
  };
  cacheDuration: string;
}

interface ThreatMatchResponse {
  matches?: ThreatEntryMatch[];
}

export const ThreatIntel = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatMatchResponse | null>(null);
  const [error, setError] = useState('');

  const checkUrl = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/threat-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An unknown error occurred.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to fetch from API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Threat Intelligence URL Checker" />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="URL to check"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button variant="contained" onClick={checkUrl} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Check'}
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && (
          <Box sx={{ mt: 2 }}>
            {result.matches ? (
              <Alert severity="warning" icon={<GppBad />}>
                Threat found! Type: {result.matches[0].threatType}
              </Alert>
            ) : (
              <Alert severity="success" icon={<GppGood />}>
                No threats found for this URL.
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
