import React, { useEffect } from 'react';
import Categories from './categories';

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
  const [showMenu, setShowMenu] = React.useState(true);
  const [showCategories, setShowCategories] = React.useState(false);

  const resetConfigs = () => {
    setShowCategories(false);
    setShowMenu(false);
  };

  useEffect(() => {
    resetConfigs();
    setShowMenu(true);
  }, []);

  return (
    <div>
      {showMenu && (
        <div>
          <h2>Configuration Areas</h2>
          <ul>
            {configAreas.map((area) => (
              <li key={area.key}>
                <button
                  onClick={() => {
                    resetConfigs();
                    if (area.key === 'general') setShowCategories(true);
                  }}
                >
                  <strong>{area.name}</strong>
                  {area.description && <p>{area.description}</p>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showCategories && <Categories />}
    </div>
  );
};

export default Config;
