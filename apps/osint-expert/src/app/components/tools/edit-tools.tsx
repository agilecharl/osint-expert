import React from 'react';

type Tool = {
  id: number;
  tool: string;
  description: string;
};

type EditToolsProps = {
  initialTool?: Tool;
  onClose?: (tools: Tool[]) => void;
};

export const EditTools: React.FC<EditToolsProps> = (EditToolsProps) => {
  const { initialTool, onClose } = EditToolsProps;
  const [tool, setTool] = React.useState<Tool>(
    initialTool || { id: Date.now(), tool: '', description: '' }
  );

  /*
    const handleAdd = () => {
    const newTool: Tool = {
      id: Date.now(),
      tool: '',
      description: '',
    };
    setTools((prev) => [...prev, newTool]);
  };
*/

  const handleSave = () => {
    if (onClose) {
      onClose([tool]);
    }
  };

  return (
    <div>
      <h2>Edit Tool</h2>
      {/*<button onClick={handleAdd}>Add Tool</button>*/}
      <button onClick={() => onClose && onClose([tool])}>Close</button>
      <button onClick={handleSave} style={{ marginLeft: '1rem' }}>
        Save
      </button>
    </div>
  );
};

export default EditTools;
