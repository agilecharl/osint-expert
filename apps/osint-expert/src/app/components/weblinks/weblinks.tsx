import React, { useEffect, useState } from 'react';
import StageWeblinks from './stage-weblinks';

// Replace with your actual data fetching logic
async function fetchWeblinks(): Promise<
  Array<{ id: string; title: string; url: string }>
> {
  // Example: fetch from API or local storage
  // return fetch('/api/osint/weblinks').then(res => res.json());
  return [
    { id: '1', title: 'OSINT Framework', url: 'https://osintframework.com/' },
    { id: '2', title: 'Intel Techniques', url: 'https://inteltechniques.com/' },
  ];
}

const Weblinks: React.FC = () => {
  const [weblinks, setWeblinks] = useState<
    Array<{ id: string; title: string; url: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [showStage, setShowStage] = useState(false);

  useEffect(() => {
    fetchWeblinks().then((data) => {
      setWeblinks(data);
      setLoading(false);
      setShowStage(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>OSINT Weblinks</h2>
      <br />
      {!showStage && (
        <div>
          <ul>
            {weblinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
          <br />
          <button
            type="button"
            style={{
              display: 'inline-block',
              marginBottom: '1rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: '#0078d4',
              color: '#fff',
              borderRadius: '4px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#005fa3')
            }
            onFocus={(e) => (e.currentTarget.style.backgroundColor = '#005fa3')}
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#0078d4')
            }
            onBlur={(e) => (e.currentTarget.style.backgroundColor = '#0078d4')}
            onClick={() => setShowStage(true)}
          >
            Stage Weblinks
          </button>
        </div>
      )}
      {showStage && (
        <div style={{ marginTop: '1rem' }}>
          <StageWeblinks onClose={() => setShowStage(false)} />
        </div>
      )}
    </div>
  );
};

export default Weblinks;
