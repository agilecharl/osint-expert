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
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const getCategories = async () => {
    try {
      const categoriesData = await apiGet<Category[]>('/categories');
      const categoriesWithCodes = await Promise.all(
        categoriesData.map(async (cat) => {
          const codes = await apiGet<Code[]>(`/categories/${cat.id}/codes`);
          return {
            ...cat,
            codes: codes || [],
          };
        })
      );
      setCategories(categoriesWithCodes);
    } catch (error) {
      console.error('Error fetching categories or codes:', error);
    }
  };

  const saveCategory = async (category: Category) => {
    await apiPost('/categories', category);
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

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    if (selectedCategoryId === id) setSelectedCategoryId(null);
  };

  const saveCode = async (code: Code) => {
    await apiPost('/codes', code);

    await getCategories();
  };

  const handleAddCode = () => {
    if (selectedCategoryId && newCode.trim()) {
      saveCode({
        id: '',
        category: selectedCategoryId,
        code: newCode.trim(),
      });
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategoryId
            ? {
                ...cat,
                codes: [
                  {
                    id: Date.now().toString(),
                    category: cat.id,
                    code: newCode.trim(),
                  },
                ],
              }
            : cat
        )
      );
      setNewCode('');
    }
  };

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
            <ul>
              {(cat as any).codes?.map((code: Code) => (
                <li key={code.id}>
                  {code.code}
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleRemoveCode(cat.id, code.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {selectedCategoryId === cat.id && (
                <li>
                  <input
                    type="text"
                    placeholder="New code"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                  <button onClick={handleAddCode}>Add Code</button>
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
