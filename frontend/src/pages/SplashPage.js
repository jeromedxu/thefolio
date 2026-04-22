import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SplashPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <img src="/asset/logo.png" alt="Wander & Explore logo" className="splash-logo" />
        <h1>WANDER & EXPLORE</h1>
        <div className="spinner"></div>
        <p>Loading your next route...</p>
      </div>
    );
  }

  return (
    <div
      className="splash-page travel-bg-page"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 76, 117, 0.45), rgba(15, 76, 117, 0.58)), url('/asset/travel28.jpg')",
      }}
    >
      <div className="page-overlay"></div>
      <div className="splash-panel">
        <img src="/asset/logo.png" alt="Wander & Explore logo" className="splash-logo" />
        <h1>Welcome to TheFolio</h1>
        <p>
          A travel community space for stories, route planning, admin messaging,
          and member updates.
        </p>
        <div className="splash-actions">
          <Link to="/home" className="btn btn-solid">
            Browse Homepage
          </Link>
          {!user && (
            <>
              <Link to="/register" className="btn btn-outline splash-outline">
                Register
              </Link>
              <Link to="/login" className="btn btn-outline splash-outline">
                Login
              </Link>
            </>
          )}
          {user && (
            <Link to="/profile" className="btn btn-outline splash-outline">
              Open Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
