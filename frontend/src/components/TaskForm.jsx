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
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem', color: '#384959' }}>
        Create a New Task
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: '600' }}>
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
          />
        </div>

        {/* Media Preview & Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            background: '#f2f7fc',
            border: '1.5px dashed #88BDF2',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#384959'
          }}>
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
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid #88BDF2' }}
              />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {errors.image && (
          <p style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600' }}>{errors.image}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
          {submitting ? 'Saving...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;