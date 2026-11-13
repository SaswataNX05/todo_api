import { useEffect, useState, useMemo } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (formData) => {
    try {
      const { data } = await API.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTasks((prev) => [data, ...prev]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    });
  }, [tasks, filter, searchQuery]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#D2CF9A',
        padding: '2.5rem 1rem',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Top Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            background: '#fefee3',
            border: '1.5px solid rgba(73, 87, 20, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(40, 48, 28, 0.08)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.78rem',
                color: '#9A7E3B',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '800',
              }}
            >
              Personal Workspace
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#28301C' }}>
              {user?.name}
            </h2>
          </div>
          <button
            onClick={logout}
            style={{
              background: '#fefee3',
              border: '1.5px solid #9A7E3B',
              color: '#323D25',
              fontWeight: '700',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#323D25';
              e.target.style.color = '#fcfcbb';
              e.target.style.borderColor = '#323D25';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#fefee3';
              e.target.style.color = '#323D25';
              e.target.style.borderColor = '#9A7E3B';
            }}
          >
            Sign Out
          </button>
        </header>

        {/* Task Creation Form */}
        <TaskForm onTaskAdded={handleAddTask} />

        {/* Progress & Overview Card */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: '#fefee3',
            border: '1.5px solid rgba(71, 79, 26, 0.47)',
            borderRadius: '14px',
            boxShadow: '0 6px 16px rgba(40, 48, 28, 0.06)',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#28301C' }}>
              Completion Progress
            </span>
            <span style={{ fontSize: '0.85rem', color: '#a07c26', fontWeight: '700' }}>
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: '#E5E2B8', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #9A7E3B 0%, #323D25 100%)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              background: '#fefee3',
              border: '1.5px solid rgba(154, 126, 59, 0.45)',
              color: '#28301C',
              padding: '0.7rem 1rem',
              borderRadius: '12px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.background = '#dcffb7';
              e.target.style.borderColor = 'rgba(27, 43, 26, 0.73)';
            }}
            onBlur={(e) => {
              e.target.style.background = '#fefee3';
              e.target.style.borderColor = 'rgba(42, 56, 30, 0.47))';
            }}
          />

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              background: '#fefee3',
              padding: '4px',
              borderRadius: '12px',
              border: '1.5px solid rgba(42, 56, 29, 0.47))',
            }}
          >
            {[
              { key: 'all', label: `All (${totalCount})` },
              { key: 'pending', label: `Pending (${pendingCount})` },
              { key: 'completed', label: `Done (${completedCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  background: filter === tab.key ? '#323D25' : 'transparent',
                  color: filter === tab.key ? '#fefee3' : '#323D25',
                  border: 'none',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '9px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#323D25', fontWeight: '600' }}>
            Loading your tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#fefee3',
              borderRadius: '14px',
              border: '1.5px dashed #9A7E3B',
            }}
          >
            <p style={{ color: '#323D2C', fontSize: '0.95rem', fontWeight: '600' }}>
              {searchQuery
                ? `No tasks matching "${searchQuery}"`
                : filter === 'completed'
                ? 'No completed tasks yet.'
                : filter === 'pending'
                ? 'Great job! No pending tasks.'
                : 'No tasks yet. Create one above! ✨'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;