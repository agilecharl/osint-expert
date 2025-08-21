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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        <label htmlFor="pageSizeSelect">Rows per page:</label>
        <select
          id="pageSizeSelect"
          value={pageSize === tools.length ? 'all' : pageSize}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'all') {
              setPage(1);
              setPageSize(tools.length);
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
          {tools
            .slice(
              (page - 1) * pageSize,
              pageSize === tools.length ? tools.length : page * pageSize
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
          disabled={page === 1 || pageSize === tools.length}
        >
          First
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || pageSize === tools.length}
        >
          Previous
        </Button>
        <span style={{ alignSelf: 'center' }}>
          Page {page} of{' '}
          {pageSize === tools.length ? 1 : Math.ceil(tools.length / pageSize)}
        </span>
        <Button
          variant="contained"
          onClick={() =>
            setPage((p) =>
              Math.min(
                pageSize === tools.length
                  ? 1
                  : Math.ceil(tools.length / pageSize),
                p + 1
              )
            )
          }
          disabled={
            page ===
              (pageSize === tools.length
                ? 1
                : Math.ceil(tools.length / pageSize)) ||
            tools.length === 0 ||
            pageSize === tools.length
          }
        >
          Next
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            setPage(
              pageSize === tools.length ? 1 : Math.ceil(tools.length / pageSize)
            )
          }
          disabled={
            page ===
              (pageSize === tools.length
                ? 1
                : Math.ceil(tools.length / pageSize)) ||
            tools.length === 0 ||
            pageSize === tools.length
          }
        >
          Last
        </Button>
      </div>
    </>
  );
};
