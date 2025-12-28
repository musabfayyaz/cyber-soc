
'use client';

import { Card, CardHeader, CardContent, Typography, Box, Grid } from '@mui/material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield } from '@mui/icons-material';

interface LogEntry {
  level: string;
  type: string;
  message: string;
  timestamp: string;
}

const COLORS: { [key: string]: string } = {
  info: '#2196f3',
  warn: '#ff9800',
  error: '#f44336',
};

const LogLevelPieChart = ({ logs }: { logs: LogEntry[] }) => {
  const data = Object.entries(
    logs.reduce((acc: { [key: string]: number }, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const EventsTimelineChart = ({ logs }: { logs: LogEntry[] }) => {
    const data = logs.map(log => ({
        time: new Date(log.timestamp).toLocaleTimeString(),
        events: 1,
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="events" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export const Charts = ({ logs }: { logs: LogEntry[] }) => {
  return (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Card>
                <CardHeader title="Log Levels" avatar={<Shield />} />
                <CardContent>
                    {logs.length > 0 ? <LogLevelPieChart logs={logs} /> : <Typography>No data</Typography>}
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <Card>
                <CardHeader title="Events Timeline" avatar={<Shield />} />
                <CardContent>
                    {logs.length > 0 ? <EventsTimelineChart logs={logs} /> : <Typography>No data</Typography>}
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  );
};
