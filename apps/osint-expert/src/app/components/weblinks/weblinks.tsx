import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetchWeblinks().then((data) => {
      setWeblinks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>OSINT Weblinks</h2>
      <ul>
        {weblinks.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Weblinks;
