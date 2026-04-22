import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Connect With Us"
        subtitle="Use the same travel banner and card layout while keeping contact details easy to find."
        compact
      />

      <section className="content-block section-light">
        <div className="standard-page-grid">
          <div className="page-card">
            <h3>Send a Message</h3>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input id="contact-email" type="email" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows="5"></textarea>
              </div>
              <button className="btn btn-solid" type="submit">
                Submit Message
              </button>
            </form>
          </div>

          <div className="page-card">
            <h2 className="slide-title">
              Our <span>Location</span>
            </h2>
            <div className="map-container">
              <iframe
                title="Interactive Google Map showing the location of Nueva Vizcaya"
                src="https://www.google.com/maps?q=Nueva%20Vizcaya&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ContactPage;
