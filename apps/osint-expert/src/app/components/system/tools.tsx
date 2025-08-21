import Button from '@mui/material/Button';
import { apiGet } from '@osint-expert/data';
import { useEffect, useState } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getDefaultData = async () => {
      await apiGet<Tool[]>('/tools')
        .then((data: Tool[]) => {
          setTools(data);
        })
        .catch((error) => {
          console.error('Error fetching tools:', error);
        });
    };

    getDefaultData();
  }, []);

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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
              }}
            >
              Name
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
              }}
            >
              Description
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                textAlign: 'left',
                padding: '8px',
                border: '1px solid #ccc',
              }}
            >
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTools
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
