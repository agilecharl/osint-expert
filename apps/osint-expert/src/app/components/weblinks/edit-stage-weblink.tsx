import { apiGet, apiPut } from '@osint-expert/data';
import React, { useEffect, useState } from 'react';

type StageWeblink = {
  id: string;
  url: string;
  description: string;
};

type EditStageWeblinksProps = {
  id: number;
  onClose: () => void;
};

export const EditStageWeblink: React.FC<EditStageWeblinksProps> = ({
  id,
  onClose,
}) => {
  const [weblinkTitle, setWeblinkTitle] = useState<string>('');
  const [weblinkDescription, setWeblinkDescription] = useState<string>('');
  const [weblinkUrl, setWeblinkUrl] = useState<string>('');
  const [weblinkType, setWeblinkType] = useState<string>('');

  const handleSave = () => {
    apiPut('/stage-weblinks/' + id, {
      url: weblinkUrl,
      description: weblinkType,
    })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error saving weblink:', error);
      });
  };

  const getWeblinkById = async () => {
    console.log('Fetching weblink with ID:', id);
    await apiGet<StageWeblink[]>('/stage-weblinks/' + id)
      .then((data: StageWeblink[]) => {
        setWeblinkTitle(
          data.find((weblink) => Number(weblink.id) === id)?.title || ''
        );
        setWeblinkDescription(
          data.find((weblink) => Number(weblink.id) === id)?.description || ''
        );
        setWeblinkUrl(
          data.find((weblink) => Number(weblink.id) === id)?.url || ''
        );
        setWeblinkType(
          data.find((weblink) => Number(weblink.id) === id)?.description || ''
        );
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
      });
  };

  useEffect(() => {
    getWeblinkById();
  }, [id]);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '0 auto',
        padding: 24,
        background: '#fafafa',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Edit Stage Weblink</h2>
      <p>{id}</p>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="weblink-title-input">Title</label>
        <input
          id="weblink-title-input"
          type="text"
          value={weblinkTitle}
          onChange={(e) => setWeblinkTitle(e.target.value)}
          placeholder="Enter Title"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />
        <br />
        <label htmlFor="weblink-description-input">Description</label>
        <textarea
          id="weblink-description-input"
          value={weblinkDescription}
          onChange={(e) => setWeblinkDescription(e.target.value)}
          placeholder="Enter Description"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 16,
            marginTop: 8,
            minHeight: 60,
            resize: 'vertical',
          }}
        />
        <label
          htmlFor="weblink-url-input"
          style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}
        >
          Weblink URL
        </label>
        <input
          id="weblink-url-input"
          type="url"
          value={weblinkUrl}
          onChange={(e) => setWeblinkUrl(e.target.value)}
          placeholder="Enter URL"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="weblink-type-input"
          style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}
        >
          Weblink Type
        </label>
        <input
          id="weblink-type-input"
          type="text"
          value={weblinkType}
          onChange={(e) => setWeblinkType(e.target.value)}
          placeholder="Enter Weblink Type"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 16,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#eee',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            borderRadius: 4,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
          disabled={!weblinkUrl.trim()}
          title={!weblinkUrl.trim() ? 'URL is required' : undefined}
        >
          Save
        </button>
      </div>
    </div>
  );
};
