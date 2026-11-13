import { useState, useRef } from 'react';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB.' }));
        return;
      }
      setErrors((prev) => ({ ...prev, image: null }));
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const validationErrors = {};
    if (!title.trim()) validationErrors.title = 'Title is required';
    if (title.length > 80) validationErrors.title = 'Title must be under 80 characters';
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await onTaskAdded(formData);
    setSubmitting(false);

    setTitle('');
    setDescription('');
    removeImage();
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '1.5rem',
        background: '#fbf7e3',
        border: '1.5px solid rgba(154, 126, 59, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(40, 48, 28, 0.08)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#28301C', margin: 0 }}>
          Create a New Task
        </h3>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#9A7E3B',
            background: '#fef9df',
            padding: '3px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(154, 126, 59, 0.3)',
          }}
        >
          New Entry
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#fcfcd5',
              border: '1.5px solid rgba(154, 126, 59, 0.45)',
              color: '#28301C',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#9A7E3B';
              e.target.style.boxShadow = '0 0 0 3px rgba(154, 126, 59, 0.18)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(154, 126, 59, 0.45)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.title && (
            <p style={{ color: '#BE123C', fontSize: '0.8rem', marginTop: '0.35rem', fontWeight: '700' }}>
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Add notes, context, or instructions (optional)..."
            value={description}
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#fcfcd5',
              border: '1.5px solid rgba(154, 126, 59, 0.45)',
              color: '#28301C',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#9A7E3B';
              e.target.style.boxShadow = '0 0 0 3px rgba(154, 126, 59, 0.18)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(154, 126, 59, 0.45)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Media Preview & Upload */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                background: '#fffae3',
                border: '1.5px dashed #9A7E3B',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#323D25',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#eae3c5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#F2EFE0';
              }}
            >
              <span>📷 Attach Image</span>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>

            {previewUrl && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '2px solid #9A7E3B',
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  title="Remove image"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#28301C',
                    color: '#fbf7e3',
                    border: '1.5px solid #FBFBF3',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#323D25',
              color: '#fafadc',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.92rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(40, 48, 28, 0.22)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!submitting) e.target.style.background = '#9A7E3B';
            }}
            onMouseOut={(e) => {
              if (!submitting) e.target.style.background = '#323D25';
            }}
          >
            {submitting ? 'Saving...' : '+ Add Task'}
          </button>
        </div>

        {errors.image && (
          <p style={{ color: '#BE123C', fontSize: '0.8rem', fontWeight: '700', margin: 0 }}>
            {errors.image}
          </p>
        )}
      </div>
    </form>
  );
};

export default TaskForm;