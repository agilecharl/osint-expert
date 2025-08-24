import { apiGet } from '@osint-expert/data';
import React, { useEffect, useState } from 'react';

interface StageWeblinkParams {
  onClose: () => void;
}

const StageWeblinks: React.FC<StageWeblinkParams> = ({ onClose }) => {
  const [weblinks, setWeblinks] = useState<
    Array<{ id: number; url: string; description?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStageWeblinks(): Promise<
    Array<{ id: number; url: string; description?: string }>
  > {
    try {
      const data = await apiGet('/stage-weblinks');
      if (Array.isArray(data)) {
        // Map data to weblink format if necessary
        return data.map((item: any) => ({
          id: item.id,
          url: item.url,
          description: item.description,
        }));
      } else {
        throw new Error('Failed to load targets: invalid data format.');
      }
    } catch (error: any) {
      console.error('Error fetching weblinks:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchStageWeblinks()
      .then(setWeblinks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Stage Weblinks</h2>
      <button onClick={onClose}>Close</button>
      <ul>
        {weblinks.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url}
            </a>
            {link.description && <span> - {link.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StageWeblinks;
