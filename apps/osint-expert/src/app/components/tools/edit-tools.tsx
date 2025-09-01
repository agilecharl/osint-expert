import { apiGet, apiPut } from '@osint-expert/data';
import React, { useEffect, useState } from 'react';

type Tool = {
  id: number;
  tool: string;
  description: string;
  url: string;
};

type EditToolsProps = {
  id?: number;
  onClose?: (updatedTools: Tool[]) => void;
};

export const EditTools: React.FC<EditToolsProps> = ({ id, onClose }) => {
  const [tool, setTool] = useState<Tool | undefined>();
  const currentTool = id || 0;

  const handleSave = async () => {
    if (onClose && tool) {
      await apiPut<Tool, Tool>('/tools/' + currentTool, tool).then(() => {
        onClose([tool]);
      });
    }
  };

  const getTool = async (toolId: number) => {
    try {
      const data = await apiGet<Tool[]>(`/tools/${toolId}`);
      if (data) {
        setTool(data[0]);
      }
    } catch (error) {
      console.error('Error fetching tool:', error);
    }
  };

  useEffect(() => {
    getTool(currentTool);
  }, [currentTool]);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        background: '#fff',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Edit Tool</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="tool-name"
          style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}
        >
          Name:
        </label>
        <input
          id="tool-name"
          type="text"
          value={tool?.tool ?? ''}
          onChange={(e) =>
            setTool({
              id: tool?.id ?? currentTool,
              tool: e.target.value,
              description: tool?.description ?? '',
              url: tool?.url ?? '',
            })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="tool-description"
          onChange={(e) =>
            setTool({
              id: tool?.id ?? currentTool,
              tool: tool?.tool ?? '',
              description: (e.target as HTMLTextAreaElement).value,
              url: tool?.url ?? '',
            })
          }
        >
          Description:
        </label>
        <textarea
          id="tool-description"
          value={tool?.description ?? ''}
          onChange={(e) =>
            setTool({
              id: tool?.id ?? currentTool,
              tool: tool?.tool ?? '',
              description: e.target.value,
              url: tool?.url ?? '',
            })
          }
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 6,
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="tool-url"
          style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}
        >
          URL:
        </label>
        <input
          id="tool-url"
          type="text"
          value={tool?.url ?? ''}
          onChange={(e) =>
            setTool({
              id: tool?.id ?? currentTool,
              tool: tool?.tool ?? '',
              description: tool?.description ?? '',
              url: e.target.value,
            })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          onClick={() => {
            onClose && onClose([]);
          }}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: 'none',
            background: '#eee',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: 6,
            border: 'none',
            background: '#0078d4',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditTools;
