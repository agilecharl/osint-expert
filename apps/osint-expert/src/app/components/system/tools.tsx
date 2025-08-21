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
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <strong>{tool.name}</strong>: {tool.description}
            {tool.link && (
              <>
                {' '}
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  More info
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
