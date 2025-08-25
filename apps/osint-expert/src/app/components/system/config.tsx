import React, { useEffect } from 'react';
import Categories from './categories';

type ConfigArea = {
  key: string;
  name: string;
  description?: string;
};

const configAreas: ConfigArea[] = [
  {
    key: 'categories',
    name: 'Categories',
  },
  {
    key: 'notifications',
    name: 'Notifications',
  },
  {
    key: 'security',
    name: 'Security',
  },
  {
    key: 'integrations',
    name: 'Integrations',
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
          <br />
          <ul>
            {configAreas.map((area) => (
              <li key={area.key}>
                <button
                  onClick={() => {
                    resetConfigs();
                    if (area.key === 'categories') setShowCategories(true);
                  }}
                >
                  <strong>{area.name}</strong>
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
