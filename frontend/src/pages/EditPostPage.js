import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
        setCurrentImage(data.image || '');
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <p className='page-feedback'>Loading post...</p>;

  return (
    <>
      <PageHero
        eyebrow='Edit content'
        title='Edit Post'
        subtitle='Use the same consistent hero and form card style for editing published content.'
        compact
      />

      <section className='content-block section-light'>
        <div className='auth-shell'>
          <div className='page-card auth-card'>
            <h3>Update Post</h3>
            {error && <p className='error-msg'>{error}</p>}
            {currentImage && (
              <div className='current-image'>
                <p>Current cover image</p>
                <img src={`http://localhost:5000/uploads/${currentImage}`} alt='Current cover' />
              </div>
            )}
            <form onSubmit={handleSubmit} className='contact-form'>
              <div className='form-group'>
                <label>Post title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className='form-group'>
                <label>Post body</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} required />
              </div>
              {user?.role === 'admin' && (
                <div className='form-group'>
                  <label>Replace Cover Image</label>
                  <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                </div>
              )}
              <button type='submit' className='btn btn-solid'>
                Update Post
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default EditPostPage;
