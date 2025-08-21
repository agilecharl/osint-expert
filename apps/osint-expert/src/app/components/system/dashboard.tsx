import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>OSINT Expert Headquarters</h1>
      <div style={{ marginTop: 24 }}>
        <Grid container spacing={3}>
          {['Alerts', 'Targets', 'Findings', 'Messages'].map((name, idx) => (
            <Grid key={name}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{name}</Typography>
                  <Typography variant="body2">
                    Card content goes here.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
