import Button from '@mui/material/Button'; // <-- And this
import TextField from '@mui/material/TextField'; // <-- Add this
import { apiPost } from '@osint-expert/data';
import React, { useState } from 'react';

interface EditTargetProps {
  inputTarget: {
    id: string;
    target: string;
    description?: string;
  };
  onSave: (updatedTarget: {
    id: string;
    target: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

export const EditTarget: React.FC<EditTargetProps> = ({
  inputTarget,
  onSave,
  onCancel,
}) => {
  const [target, setTarget] = useState(inputTarget?.target ?? '');
  const [description, setDescription] = useState(
    inputTarget?.description ?? ''
  );

  if (!inputTarget) {
    // Optionally, show a loading indicator or error message
    return null;
  }

  const saveTarget = async (updatedTarget: {
    id: string;
    target: string;
    description?: string;
  }) => {
    try {
      const response = (await apiPost('/targets', updatedTarget)) as Response;
      console.log('Response from API:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Target updated successfully:', data);
        onSave(data);
      } else {
        console.error('Failed to update target:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating target:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTarget({ id: inputTarget.id, target, description });
    onSave({ id: inputTarget.id, target, description });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-target-form">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          maxWidth: 400,
        }}
      >
        <div>
          <label htmlFor="target-name" style={{ display: 'none' }}>
            Target
          </label>
          <TextField
            id="target-name"
            label="Target"
            variant="outlined"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
            fullWidth
            autoFocus
            margin="normal"
          />
        </div>
        <div>
          <label htmlFor="target-description" style={{ display: 'none' }}>
            Description
          </label>
          <TextField
            id="target-description"
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};
