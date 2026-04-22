// frontend/src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Theme from './Theme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link to='/'>
          <img src='/asset/logo.png' alt='Wander & Explore logo' className='navbar-logo' />
          <span>Wander & Explore</span>
        </Link>
      </div>
      <nav className="nav-buttons">
        <Link to='/home'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/contact'>Contact</Link>
        {!user && (
          <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
          </>
        )}
        {user && (
          <>
            <Link to='/create-post'>Write Post</Link>
            <Link to='/profile'>Profile</Link>
            {user.role === 'admin' && <Link to='/admin'>Admin</Link>}
            <button onClick={handleLogout} className='btn-logout'>LOGOUT</button>
          </>
        )}
      </nav>
      <div className='navbar-right'>
        <Theme/>
      </div>
    </nav>
  );
};
export default Navbar;
