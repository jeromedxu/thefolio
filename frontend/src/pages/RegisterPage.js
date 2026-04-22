import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Registration"
        title="Join The Club"
        subtitle="Use the register page as the main account entry point, with the same travel hero style as the homepage."
        compact
      />

      <section className="content-block section-light">
        <div className="standard-page-grid">
          <div className="page-card">
            <h2 className="slide-title">
              Sign <span>Up</span>
            </h2>
            <p>
              Register to access profile editing, community posting, admin messaging,
              and member-only homepage interactions.
            </p>
            <ul className="benefits-list">
              <li><strong>Profile Access:</strong> Update your name, bio, and account details.</li>
              <li><strong>Community Feed:</strong> Post, react, comment, and reply.</li>
              <li><strong>Admin Contact:</strong> Send direct messages from your account area.</li>
            </ul>
          </div>

          <div className="page-card registration-card">
            <h3>Create Account</h3>
            <form className="contact-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" />
              </div>
              <label className="checkbox-option">
                <input type="checkbox" />
                I agree to the Terms and Conditions
              </label>
              <button className="btn btn-solid" type="submit">
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default RegisterPage;
