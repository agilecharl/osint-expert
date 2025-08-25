import { apiGet, apiPost } from '@osint-expert/data';
import { useEffect, useState } from 'react';

type Category = {
  id: string;
  category: string;
};

type Code = {
  id: string;
  category?: string;
  code: string;
  value: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCodeValue, setNewCodeValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const getCategories = async () => {
    await apiGet<Category[]>('/categories')
      .then((data: Category[]) => {
        const safeData = data.map((cat) => ({
          ...cat,
          codes: [] as Code[],
        }));
        setCategories(safeData);
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
      });
  };

  const saveCategory = async (category: Category) => {
    // Implement save logic here, e.g., POST or PUT to your API
    await apiPost('/categories', category);
    // After saving, refresh the categories list
    await getCategories();
  };

  // Add a new category
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      saveCategory({ id: '', category: newCategoryName.trim() });
      setCategories([
        ...categories,
        { id: Date.now().toString(), category: newCategoryName.trim() },
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
                  {
                    id: Date.now().toString(),
                    categoryId: cat.id,
                    code: newCodeValue
                      .trim()
                      .toLowerCase()
                      .replace(/\s+/g, '_'),
                    value: newCodeValue.trim(),
                  },
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
    /*    setCategories(
      categories.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              codes: cat.codes.filter((code) => code.id !== codeId),
            }
          : cat
      )
    );*/
  };

  useEffect(() => {
    getCategories();
  }, []);

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
              {cat.category}
            </button>
            <button
              style={{ marginLeft: 8 }}
              onClick={() => handleRemoveCategory(cat.id)}
            >
              Remove
            </button>
            {/*  <ul>
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
            */}
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
