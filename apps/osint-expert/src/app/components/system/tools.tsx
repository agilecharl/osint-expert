import { useEffect, useState } from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export const Tools: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Tool 1',
      description: 'Description for Tool 1',
      link: 'https://example.com/tool1',
    },
    {
      id: '2',
      name: 'Tool 2',
      description: 'Description for Tool 2',
    },
    {
      id: '3',
      name: 'Tool 3',
      description: 'Description for Tool 3',
      link: 'https://example.com/tool3',
    },
  ]);

  useEffect(() => {
    // This effect could be used to fetch tools from an API or perform other side effects
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
