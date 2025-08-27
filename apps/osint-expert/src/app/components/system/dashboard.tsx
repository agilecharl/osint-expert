import {
  AppBar,
  Button,
  Card,
  CardContent,
  Toolbar,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { apiGet } from '@osint-expert/data';
import React, { useEffect } from 'react';
import TargetList from '../targets/targets-list';
import { Tools } from '../tools/tools';
import Weblinks from '../weblinks/weblinks';
import Config from './config';

const Dashboard: React.FC = () => {
  const [alertCount, setAlertCount] = React.useState(0);
  const [targetCount, setTargetCount] = React.useState(0);
  const [findingCount, setFindingCount] = React.useState(0);
  const [messageCount, setMessageCount] = React.useState(0);
  const [showTools, setShowTools] = React.useState(false);
  const [showTargets, setShowTargets] = React.useState(false);
  const [showWeblinks, setShowWeblinks] = React.useState(false);
  const [showConfig, setShowConfig] = React.useState(false);

  const resetDashboard = () => {
    setShowTools(false);
    setShowTargets(false);
    setShowWeblinks(false);
    setShowConfig(false);
  };

  const updateDashboard = async () => {
    await apiGet('/counters')
      .then((data) => {
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
    resetDashboard();
    setShowTools(true);
    updateDashboard();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
            OSINT Expert
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              resetDashboard();
              setShowTools(true);
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              resetDashboard();
              setShowTargets(true);
            }}
          >
            Targets
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              resetDashboard();
              setShowWeblinks((prev) => !prev);
            }}
          >
            Weblinks
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              resetDashboard();
              setShowConfig(true);
            }}
          >
            Config
          </Button>
        </Toolbar>
      </AppBar>
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
        {showTools && <Tools />}
        {showTargets && <TargetList />}
        {showWeblinks && <Weblinks />}
        {showConfig && <Config />}
      </div>
    </div>
  );
};

export default Dashboard;
