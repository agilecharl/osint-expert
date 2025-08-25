import { apiGet } from '@osint-expert/data';
import React, { useEffect, useState } from 'react';
import { EditStageWeblink } from './edit-stage-weblink';

interface StageWeblinkParams {
  onClose: () => void;
}

const StageWeblinks: React.FC<StageWeblinkParams> = ({ onClose }) => {
  const [weblinks, setWeblinks] = useState<
    Array<{ id: number; url: string; title: string; description?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWeblink, setSelectedWeblink] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(true);

  async function fetchStageWeblinks(): Promise<
    Array<{ id: number; url: string; title: string; description?: string }>
  > {
    try {
      setRefreshFlag(false);
      const data = await apiGet('/stage-weblinks');
      if (Array.isArray(data)) {
        // Map data to weblink format if necessary
        return data.map((item: any) => ({
          id: item.id,
          url: item.url,
          title: item.title || item.url,
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
  }, [refreshFlag]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {!showEditModal && (
        <>
          <h2>Stage Weblinks</h2>
          <button onClick={onClose}>Close</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {weblinks.map((link) => (
                <tr key={link.id}>
                  <td>{link.id}</td>
                  <td>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedWeblink(link.id);
                        setShowEditModal(true);
                      }}
                    >
                      {link.title}
                    </button>
                  </td>
                  <td>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedWeblink(link.id);
                        setShowEditModal(true);
                      }}
                    >
                      {link.description || ''}
                    </button>
                  </td>
                  <td>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {showEditModal && (
        <EditStageWeblink
          id={selectedWeblink}
          onClose={() => {
            setShowEditModal(false);
            setRefreshFlag(true);
          }}
        />
      )}
    </div>
  );
};

export default StageWeblinks;
