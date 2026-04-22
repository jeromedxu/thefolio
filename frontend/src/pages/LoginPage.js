import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <PageHero
        eyebrow='Account access'
        title='Login'
        subtitle='Sign in to unlock profile updates, posting, messaging, and admin tools.'
        compact
      />

      <section className='content-block section-light'>
        <div className='auth-shell'>
          <div className='page-card auth-card'>
            <h3>Login</h3>
            {error && <p className='error-msg'>{error}</p>}
            <form onSubmit={handleSubmit} className='contact-form'>
              <div className='form-group'>
                <label htmlFor='login-email'>Email address</label>
                <input
                  id='login-email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='login-password'>Password</label>
                <input
                  id='login-password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='btn btn-solid'>
                Login
              </button>
            </form>
            <p className='form-footnote'>
              Don&apos;t have an account? <Link to='/register'>Register here</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LoginPage;
