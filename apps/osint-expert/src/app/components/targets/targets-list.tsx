import { PlusOutlined } from '@ant-design/icons';
import { apiGet } from '@osint-expert/data';
import { Button, message, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditTarget } from './edit-target';

// Define the Target type if not imported from elsewhere
type Target = {
  id: string | number;
  target: string;
  description?: string;
};

const TargetsList: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<Target | null>(null);

  const loadTargets = async () => {
    setLoading(true);

    await apiGet('/targets')
      .then((data) => {
        // Ensure data is an array of Target
        if (Array.isArray(data)) {
          setTargets(data as Target[]);
        } else {
          setTargets([]);
          message.error('Failed to load targets: invalid data format.');
        }
      })
      .catch((error) => {
        console.error('Error fetching tools:', error);
      });

    setLoading(false);
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const handleCreate = () => {
    setEditTarget(null);
    setShowEdit(true);
  };

  const handleEditClose = (saved: boolean) => {
    setShowEdit(false);
    if (saved) loadTargets();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Target) => (
        <Button
          type="link"
          onClick={() => {
            setEditTarget(record);
            setShowEdit(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
      >
        New Target
      </Button>
      <Spin spinning={loading}>
        <Table
          dataSource={targets}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      {showEdit && (
        <EditTarget
          inputTarget={
            editTarget
              ? {
                  id: String(editTarget.id),
                  target: editTarget.target,
                  description: editTarget.description,
                }
              : {
                  id: '',
                  target: '',
                  description: '',
                }
          }
          onSave={() => handleEditClose(true)}
          onCancel={() => handleEditClose(false)}
        />
      )}
    </div>
  );
};

export default TargetsList;
