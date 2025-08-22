import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { apiGet } from '@osint-expert/data';
import React, { useEffect } from 'react';
import { Tools } from './tools';

const Dashboard: React.FC = () => {
  const [alertCount, setAlertCount] = React.useState(0);
  const [targetCount, setTargetCount] = React.useState(0);
  const [findingCount, setFindingCount] = React.useState(0);
  const [messageCount, setMessageCount] = React.useState(0);

  const updateDashboard = async () => {
    await apiGet('/counters')
      .then((data) => {
        // Type assertion for expected structure
        const toolsData = data as {
          alerts: any;
          targets: any;
          findings: any;
          messages: any;
        };
        setAlertCount(toolsData.alerts.length);
        setTargetCount(toolsData.targets.length);
        setFindingCount(toolsData.findings.length);
        setMessageCount(toolsData.messages.length);
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
      });
  };

  useEffect(() => {
    updateDashboard();
  }, []);

  return (
    <div>
      <h1>OSINT Expert Headquarters</h1>
      <div style={{ marginTop: 24 }}>
        <Grid container spacing={3}>
          {[
            { title: 'Alerts', count: alertCount ?? 0 },
            { title: 'Targets', count: targetCount ?? 0 },
            { title: 'Findings', count: findingCount ?? 0 },
            { title: 'Messages', count: messageCount ?? 0 },
          ].map((card, idx) => (
            <Grid key={card.title}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="body2">{card.count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <br />
        <Tools />
      </div>
    </div>
  );
};

export default Dashboard;
