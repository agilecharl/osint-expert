import { useState } from 'react';

type Code = {
  id: string;
  value: string;
};

type Category = {
  id: string;
  name: string;
  codes: Code[];
};

const initialCategories: Category[] = [
  // Example initial data
  {
    id: '1',
    name: 'Social Media',
    codes: [
      { id: 'a', value: 'FB' },
      { id: 'b', value: 'TW' },
    ],
  },
  { id: '2', name: 'Search Engines', codes: [{ id: 'c', value: 'GOOG' }] },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCodeValue, setNewCodeValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Add a new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([
        ...categories,
        { id: Date.now().toString(), name: newCategoryName.trim(), codes: [] },
      ]);
      setNewCategoryName('');
    }
  };

  // Remove a category
  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  // Add a code to selected category
  const handleAddCode = () => {
    if (selectedCategoryId && newCodeValue.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategoryId
            ? {
                ...cat,
                codes: [
                  ...cat.codes,
                  { id: Date.now().toString(), value: newCodeValue.trim() },
                ],
              }
            : cat
        )
      );
      setNewCodeValue('');
    }
  };

  // Remove a code from category
  const handleRemoveCode = (catId: string, codeId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? { ...cat, codes: cat.codes.filter((code) => code.id !== codeId) }
          : cat
      )
    );
  };

  return (
    <div>
      <h2>Manage Categories</h2>
      <div>
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id} style={{ marginBottom: 16 }}>
            <button
              type="button"
              style={{
                cursor: 'pointer',
                color: selectedCategoryId === cat.id ? 'blue' : 'black',
                background: 'none',
                border: 'none',
                padding: 0,
                fontWeight: 'bold',
                fontSize: 'inherit',
              }}
              onClick={() => setSelectedCategoryId(cat.id)}
              aria-pressed={selectedCategoryId === cat.id}
            >
              {cat.name}
            </button>
            <button
              style={{ marginLeft: 8 }}
              onClick={() => handleRemoveCategory(cat.id)}
            >
              Remove
            </button>
            <ul>
              {cat.codes.map((code) => (
                <li key={code.id}>
                  {code.value}
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleRemoveCode(cat.id, code.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {selectedCategoryId === cat.id && (
              <div>
                <input
                  type="text"
                  placeholder="New code"
                  value={newCodeValue}
                  onChange={(e) => setNewCodeValue(e.target.value)}
                />
                <button onClick={handleAddCode}>Add Code</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
