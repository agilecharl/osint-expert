import Button from '@mui/material/Button'; // <-- And this
import TextField from '@mui/material/TextField'; // <-- Add this
import React, { useState } from 'react';

interface EditTargetProps {
  target: {
    id: string;
    name: string;
    description?: string;
  };
  onSave: (updatedTarget: {
    id: string;
    name: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

export const EditTarget: React.FC<EditTargetProps> = ({
  target,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(target.name);
  const [description, setDescription] = useState(target.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: target.id, name, description });
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
            Name
          </label>
          <TextField
            id="target-name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
