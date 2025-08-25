import React from 'react';

type ConfigArea = {
  key: string;
  name: string;
  description?: string;
};

const configAreas: ConfigArea[] = [
  {
    key: 'general',
    name: 'General',
    description: 'Basic application settings.',
  },
  {
    key: 'notifications',
    name: 'Notifications',
    description: 'Manage notification preferences.',
  },
  {
    key: 'security',
    name: 'Security',
    description: 'Security and privacy options.',
  },
  {
    key: 'integrations',
    name: 'Integrations',
    description: 'Third-party service connections.',
  },
];

const Config: React.FC = () => {
  return (
    <div>
      <h2>Configuration Areas</h2>
      <ul>
        {configAreas.map((area) => (
          <li key={area.key}>
            <strong>{area.name}</strong>
            {area.description && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {area.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Config;
