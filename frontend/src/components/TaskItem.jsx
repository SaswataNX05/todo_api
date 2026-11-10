const TaskItem = ({ task, onToggle, onDelete }) => {
  const BASE_URL = 'http://localhost:5000';
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.75rem',
        gap: '1rem',
        borderLeft: task.completed ? '4px solid #BDDDFC' : '4px solid #88BDF2',
        background: task.completed ? '#f9fbfe' : '#ffffff',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task._id, !task.completed)}
          style={{
            width: '20px',
            height: '20px',
            accentColor: '#384959',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />

        {/* Thumbnail Preview */}
        {task.image && (
          <a href={`${BASE_URL}${task.image}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`${BASE_URL}${task.image}`}
              alt={task.title}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid #BDDDFC',
                flexShrink: 0,
              }}
            />
          </a>
        )}

        {/* Task Info */}
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h4
              style={{
                fontSize: '0.98rem',
                fontWeight: '700',
                color: task.completed ? '#6A89A7' : '#384959',
                textDecoration: task.completed ? 'line-through' : 'none',
                margin: 0,
              }}
            >
              {task.title}
            </h4>

            {/* Pill Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px',
                background: task.completed ? '#e5f0fa' : '#BDDDFC',
                color: task.completed ? '#6A89A7' : '#384959',
              }}
            >
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </div>

          {task.description && (
            <p
              style={{
                fontSize: '0.85rem',
                color: '#6A89A7',
                marginTop: '0.25rem',
                marginBottom: 0,
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </p>
          )}

          {formattedDate && (
            <span style={{ fontSize: '0.72rem', color: '#88BDF2', fontWeight: '600', marginTop: '0.25rem', display: 'inline-block' }}>
              Added {formattedDate}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task._id)}
        className="btn-danger"
        title="Delete task"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;