const TaskItem = ({ task, onToggle, onDelete }) => {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderRadius: '14px',
        marginBottom: '0.75rem',
        gap: '1rem',
        background: task.completed ? '#F2EFE0' : '#FBFBF3',
        border: '1.5px solid rgba(154, 126, 59, 0.35)',
        borderLeft: task.completed ? '5px solid #323D25' : '5px solid #9A7E3B',
        boxShadow: '0 4px 12px rgba(40, 48, 28, 0.06)',
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
            accentColor: '#323D25',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />

        {/* Thumbnail Preview */}
        {task.image && (
          <a href={`${BASE_URL}${task.image}`} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
            <img
              src={`${BASE_URL}${task.image}`}
              alt={task.title}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '1.5px solid #9A7E3B',
                display: 'block',
              }}
            />
          </a>
        )}

        {/* Task Info */}
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: task.completed ? '#6A715D' : '#28301C',
                textDecoration: task.completed ? 'line-through' : 'none',
                margin: 0,
              }}
            >
              {task.title}
            </h4>

            {/* Status Pill Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 10px',
                borderRadius: '12px',
                background: task.completed ? 'rgba(50, 61, 37, 0.12)' : 'rgba(154, 126, 59, 0.18)',
                color: task.completed ? '#323D25' : '#7D6328',
                border: task.completed
                  ? '1px solid rgba(50, 61, 37, 0.25)'
                  : '1px solid rgba(154, 126, 59, 0.35)',
              }}
            >
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </div>

          {task.description && (
            <p
              style={{
                fontSize: '0.86rem',
                color: '#4F5940',
                marginTop: '0.25rem',
                marginBottom: 0,
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </p>
          )}

          {formattedDate && (
            <span
              style={{
                fontSize: '0.73rem',
                color: '#9A7E3B',
                fontWeight: '700',
                marginTop: '0.3rem',
                display: 'inline-block',
              }}
            >
              Added {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task._id)}
        title="Delete task"
        style={{
          background: '#FFFFFF',
          color: '#28301C',
          border: '1.5px solid rgba(154, 126, 59, 0.5)',
          padding: '0.45rem 0.9rem',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '0.82rem',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#BE123C';
          e.target.style.color = '#FFFFFF';
          e.target.style.borderColor = '#BE123C';
        }}
        onMouseOut={(e) => {
          e.target.style.background = '#FFFFFF';
          e.target.style.color = '#28301C';
          e.target.style.borderColor = 'rgba(154, 126, 59, 0.5)';
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;