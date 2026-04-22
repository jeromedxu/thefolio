import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error changing password');
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : '/asset/logo.png';

  return (
    <>
      <PageHero
        eyebrow='Member profile'
        title='My Profile'
        subtitle='Keep the same travel hero treatment while giving the profile page a cleaner account layout.'
        compact
      />

      <section className='content-block section-light'>
        <div className='standard-page-grid'>
          <div className='page-card profile-summary-card'>
            <img src={picSrc} alt='Profile' className='profile-pic-preview' />
            <h3>{user?.name || 'Traveler'}</h3>
            <p>{user?.bio || 'Add a short bio so the community can know your travel style.'}</p>
            <div className='community-meta'>
              <span className={`status-pill ${user?.role === 'admin' ? 'admin' : 'active'}`}>
                {user?.role || 'member'}
              </span>
            </div>
            {msg && <p className='success-msg'>{msg}</p>}
          </div>

          <div className='profile-forms'>
            <div className='page-card'>
              <h3>Edit Profile</h3>
              <form onSubmit={handleProfile} className='contact-form'>
                <div className='form-group'>
                  <label>Display name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='form-group'>
                  <label>Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder='Short bio...'
                    rows={4}
                  />
                </div>
                <div className='form-group'>
                  <label>Change Profile Picture</label>
                  <input type='file' accept='image/*' onChange={(e) => setPic(e.target.files[0])} />
                </div>
                <button type='submit' className='btn btn-solid'>
                  Save Profile
                </button>
              </form>
            </div>

            <div className='page-card'>
              <h3>Change Password</h3>
              <form onSubmit={handlePassword} className='contact-form'>
                <div className='form-group'>
                  <label>Current password</label>
                  <input
                    type='password'
                    value={curPw}
                    onChange={(e) => setCurPw(e.target.value)}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>New password</label>
                  <input
                    type='password'
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button type='submit' className='btn btn-solid'>
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProfilePage;
