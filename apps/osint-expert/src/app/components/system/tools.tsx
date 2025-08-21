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
    <div>
      <h2>System Tools</h2>
      <br />
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
          {tools.map((tool) => (
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
    </div>
  );
};
