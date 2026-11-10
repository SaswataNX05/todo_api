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
    <div style={{ maxWidth: '720px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Top Header */}
      <header
        className="glass-panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#6A89A7', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Personal Workspace
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#384959' }}>{user?.name}</h2>
        </div>
        <button
          onClick={logout}
          style={{
            background: '#ffffff',
            border: '1.5px solid #BDDDFC',
            color: '#384959',
            fontWeight: '600',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#BDDDFC';
            e.target.style.borderColor = '#88BDF2';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#ffffff';
            e.target.style.borderColor = '#BDDDFC';
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Task Creation Form */}
      <TaskForm onTaskAdded={handleAddTask} />

      {/* Progress & Overview Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#384959' }}>Completion Progress</span>
          <span style={{ fontSize: '0.85rem', color: '#6A89A7', fontWeight: '600' }}>
            {completedCount} of {totalCount} completed ({progressPercent}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '9px', background: '#BDDDFC', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #88BDF2 0%, #384959 100%)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '220px' }}
        />

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#e8f2fc', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid #BDDDFC' }}>
          {[
            { key: 'all', label: `All (${totalCount})` },
            { key: 'pending', label: `Pending (${pendingCount})` },
            { key: 'completed', label: `Done (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                background: filter === tab.key ? '#384959' : 'transparent',
                color: filter === tab.key ? '#ffffff' : '#6A89A7',
                border: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
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
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6A89A7' }}>
          Loading your tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: '#6A89A7', fontSize: '0.95rem', fontWeight: '500' }}>
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
  );
};

export default Dashboard;