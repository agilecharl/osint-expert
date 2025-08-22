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
      <div>
        <label htmlFor="target-name">Name</label>
        <input
          id="target-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="target-description">Description</label>
        <textarea
          id="target-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
