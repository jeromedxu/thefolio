import { useEffect, useState } from 'react';
import API from '../api/axios';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    API.get('/admin/users').then((response) => setUsers(response.data));
    API.get('/admin/posts').then((response) => setPosts(response.data));
  }, []);

  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map((user) => (user._id === id ? data.user : user)));
  };

  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map((post) => (post._id === id ? { ...post, status: 'removed' } : post)));
  };

  return (
    <>
      <PageHero
        eyebrow='Admin tools'
        title='Admin Dashboard'
        subtitle='The admin page now follows the same travel hero and card layout as the rest of the site.'
        compact
      />

      <section className='content-block section-light'>
        <div className='admin-page-shell'>
          <div className='admin-tabs'>
            <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
              Members ({users.length})
            </button>
            <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
              All Posts ({posts.length})
            </button>
          </div>

          {tab === 'users' && (
            <div className='page-card'>
              <table className='resource-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className={`btn admin-action ${
                            user.status === 'active' ? 'admin-danger' : 'admin-success'
                          }`}
                          type='button'
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'posts' && (
            <div className='page-card'>
              <table className='resource-table'>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td>{post.title}</td>
                      <td>{post.author?.name}</td>
                      <td>{post.status}</td>
                      <td>
                        {post.status === 'published' && (
                          <button
                            className='btn admin-action admin-danger'
                            onClick={() => removePost(post._id)}
                            type='button'
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AdminPage;
