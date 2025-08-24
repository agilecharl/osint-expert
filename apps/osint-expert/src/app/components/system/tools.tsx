import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiGet } from '@osint-expert/data';
import { useEffect, useRef, useState } from 'react';

export interface Tool {
  id: string;
  tool: string;
  description: string;
  link?: string;
}

const REFRESH_INTERVALS = [
  { label: '10 seconds', value: 10000 },
  { label: '1 minute', value: 60000 },
  { label: '5 minutes', value: 300000 },
];

export const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sort, setSort] = useState<{
    key: keyof Tool;
    direction: 'asc' | 'desc';
  }>({
    key: 'tool',
    direction: 'asc',
  });

  const [refreshInterval, setRefreshInterval] = useState<number>(
    REFRESH_INTERVALS[0].value
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchTools = async () => {
    await apiGet<Tool[]>('/tools')
      .then((data: Tool[]) => {
        setTools(data);
        setLastUpdate(new Date());
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
      });
  };

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchTools();
    }, refreshInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshInterval]);

  const filteredTools = tools.filter(
    (tool) =>
      tool.tool.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTools = [...filteredTools].sort((a, b) => {
    const key = sort.key;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sort.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  const totalPages =
    pageSize === filteredTools.length
      ? 1
      : Math.ceil(filteredTools.length / pageSize);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          OSINT Tools
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            fullWidth
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="pageSizeSelectLabel">Rows per page</InputLabel>
            <Select
              labelId="pageSizeSelectLabel"
              value={pageSize === filteredTools.length ? 'all' : pageSize}
              label="Rows per page"
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'all') {
                  setPage(1);
                  setPageSize(filteredTools.length);
                } else {
                  setPage(1);
                  setPageSize(Number(value));
                }
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="refreshIntervalSelectLabel">
              Auto-refresh interval
            </InputLabel>
            <Select
              labelId="refreshIntervalSelectLabel"
              value={refreshInterval}
              label="Auto-refresh interval"
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            >
              {REFRESH_INTERVALS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton color="primary" onClick={fetchTools} aria-label="Refresh">
            <RefreshIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={4} mb={2}>
          <Typography variant="body2">
            Row count: <strong>{filteredTools.length}</strong>
          </Typography>
          <Typography variant="body2">
            Last update:{' '}
            <strong>
              {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}
            </strong>
          </Typography>
        </Stack>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => {
                    setSort((prev) =>
                      prev.key === 'tool'
                        ? {
                            key: 'tool',
                            direction:
                              prev.direction === 'asc' ? 'desc' : 'asc',
                          }
                        : { key: 'tool', direction: 'asc' }
                    );
                  }}
                >
                  {(() => {
                    let sortIcon = '';
                    if (sort.key === 'tool') {
                      sortIcon = sort.direction === 'asc' ? '▲' : '▼';
                    }
                    return <>Name {sortIcon}</>;
                  })()}
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => {
                    setSort((prev) =>
                      prev.key === 'description'
                        ? {
                            key: 'description',
                            direction:
                              prev.direction === 'asc' ? 'desc' : 'asc',
                          }
                        : { key: 'description', direction: 'asc' }
                    );
                  }}
                >
                  {(() => {
                    let sortIcon = '';
                    if (sort.key === 'description') {
                      sortIcon = sort.direction === 'asc' ? '▲' : '▼';
                    }
                    return <>Description {sortIcon}</>;
                  })()}
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => {
                    setSort((prev) =>
                      prev.key === 'link'
                        ? {
                            key: 'link',
                            direction:
                              prev.direction === 'asc' ? 'desc' : 'asc',
                          }
                        : { key: 'link', direction: 'asc' }
                    );
                  }}
                >
                  {(() => {
                    let sortIcon = '';
                    if (sort.key === 'link') {
                      sortIcon = sort.direction === 'asc' ? '▲' : '▼';
                    }
                    return <>Link {sortIcon}</>;
                  })()}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTools
                .slice(
                  (page - 1) * pageSize,
                  pageSize === filteredTools.length
                    ? filteredTools.length
                    : page * pageSize
                )
                .map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <strong>{tool.tool.substring(1, 30)}</strong>
                    </TableCell>
                    <TableCell>{tool.description.substring(1, 30)}</TableCell>
                    <TableCell>
                      {tool.link ? (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: 'underline',
                            color: '#1976d2',
                          }}
                        >
                          {tool.link}
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          <Button
            variant="contained"
            onClick={() => setPage(1)}
            disabled={page === 1 || pageSize === filteredTools.length}
          >
            First
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || pageSize === filteredTools.length}
          >
            Previous
          </Button>
          <Typography variant="body2">
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={() =>
              setPage((p) =>
                Math.min(
                  pageSize === filteredTools.length
                    ? 1
                    : Math.ceil(filteredTools.length / pageSize),
                  p + 1
                )
              )
            }
            disabled={
              page === totalPages ||
              filteredTools.length === 0 ||
              pageSize === filteredTools.length
            }
          >
            Next
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              setPage(
                pageSize === filteredTools.length
                  ? 1
                  : Math.ceil(filteredTools.length / pageSize)
              )
            }
            disabled={
              page === totalPages ||
              filteredTools.length === 0 ||
              pageSize === filteredTools.length
            }
          >
            Last
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
