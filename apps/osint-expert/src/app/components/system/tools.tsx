import Button from '@mui/material/Button';
import { apiGet } from '@osint-expert/data';
import { useEffect, useRef, useState } from 'react';

export interface Tool {
  id: string;
  name: string;
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
    key: 'name',
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
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
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

  return (
    <>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <label htmlFor="searchInput">Search:</label>
        <input
          id="searchInput"
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: '4px 8px', flex: '1 1 auto' }}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <label htmlFor="pageSizeSelect">Rows per page:</label>
        <select
          id="pageSizeSelect"
          value={pageSize === filteredTools.length ? 'all' : pageSize}
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
          style={{ padding: '4px 8px' }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value="all">All</option>
        </select>
      </div>
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Button variant="contained" onClick={fetchTools}>
          Refresh
        </Button>
        <label htmlFor="refreshIntervalSelect">Auto-refresh interval:</label>
        <select
          id="refreshIntervalSelect"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          style={{ padding: '4px 8px' }}
        >
          {REFRESH_INTERVALS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Row count and last update info */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <span>
          Row count: <strong>{filteredTools.length}</strong>
        </span>
        <span>
          Last update:{' '}
          <strong>{lastUpdate ? lastUpdate.toLocaleString() : 'Never'}</strong>
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSort((prev) =>
                  prev.key === 'name'
                    ? {
                        key: 'name',
                        direction: prev.direction === 'asc' ? 'desc' : 'asc',
                      }
                    : { key: 'name', direction: 'asc' }
                );
              }}
            >
              Name{' '}
              {sort.key === 'name'
                ? sort.direction === 'asc'
                  ? '▲'
                  : '▼'
                : ''}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSort((prev) =>
                  prev.key === 'description'
                    ? {
                        key: 'description',
                        direction: prev.direction === 'asc' ? 'desc' : 'asc',
                      }
                    : { key: 'description', direction: 'asc' }
                );
              }}
            >
              Description{' '}
              {sort.key === 'description'
                ? sort.direction === 'asc'
                  ? '▲'
                  : '▼'
                : ''}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSort((prev) =>
                  prev.key === 'link'
                    ? {
                        key: 'link',
                        direction: prev.direction === 'asc' ? 'desc' : 'asc',
                      }
                    : { key: 'link', direction: 'asc' }
                );
              }}
            >
              Link{' '}
              {sort.key === 'link'
                ? sort.direction === 'asc'
                  ? '▲'
                  : '▼'
                : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTools
            .slice(
              (page - 1) * pageSize,
              pageSize === filteredTools.length
                ? filteredTools.length
                : page * pageSize
            )
            .map((tool) => (
              <tr key={tool.id} style={{ border: '1px solid #ccc' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <strong>{tool.name}</strong>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {tool.description}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {tool.link ? (
                    <a
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline', color: '#0070f3' }}
                    >
                      {tool.link}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
        }}
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
        <span style={{ alignSelf: 'center' }}>
          Page {page} of{' '}
          {pageSize === filteredTools.length
            ? 1
            : Math.ceil(filteredTools.length / pageSize)}
        </span>
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
            page ===
              (pageSize === filteredTools.length
                ? 1
                : Math.ceil(filteredTools.length / pageSize)) ||
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
            page ===
              (pageSize === filteredTools.length
                ? 1
                : Math.ceil(filteredTools.length / pageSize)) ||
            filteredTools.length === 0 ||
            pageSize === filteredTools.length
          }
        >
          Last
        </Button>
      </div>
    </>
  );
};
