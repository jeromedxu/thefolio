import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([...comments, data]);
      setCommentBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return <p className='page-feedback'>Loading post...</p>;
  if (error) return <p className='page-feedback error-msg'>{error}</p>;
  if (!post) return <p className='page-feedback'>Post not found.</p>;

  const isOwner = user && post.author && user._id === post.author._id;
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <PageHero
        eyebrow='Community story'
        title={post.title}
        subtitle='Single post view with the same travel banner and consistent reading layout.'
        compact
      />

      <section className='content-block section-light'>
        <div className='post-view-shell'>
          <article className='page-card post-view-card'>
            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt={post.title}
                className='post-image'
              />
            )}
            <div className='post-meta-line'>
              <small>
                By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}
              </small>
              {(isOwner || isAdmin) && (
                <div className='post-actions'>
                  <Link to={`/edit-post/${post._id}`} className='btn admin-action admin-success'>
                    Edit
                  </Link>
                  <button onClick={handleDeletePost} className='btn admin-action admin-danger'>
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className='post-body'>
              {post.body.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          <div className='page-card'>
            <h3>Comments ({comments.length})</h3>
            <div className='comment-thread'>
              {comments.map((comment) => (
                <div key={comment._id} className='comment-card'>
                  <div className='comment-header'>
                    <strong>{comment.author?.name}</strong>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{comment.body}</p>
                  {user && (comment.author?._id === user._id || isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className='btn admin-action admin-danger'
                      type='button'
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
            {user ? (
              <form onSubmit={handleAddComment} className='contact-form'>
                <div className='form-group'>
                  <label>Write a comment</label>
                  <textarea
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <button type='submit' className='btn btn-solid'>
                  Post Comment
                </button>
              </form>
            ) : (
              <p className='form-footnote'>
                <Link to='/login'>Login</Link> to leave a comment.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PostPage;
