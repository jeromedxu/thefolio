import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function AboutPage() {
  const highlights = [
    "Mountain routes, coastal roads, and community ride plans",
    "A member feed for posts, comments, replies, and reactions",
    "Private admin messaging for support and coordination",
    "Profile-based access so features unlock only after login",
  ];

  return (
    <>
      <PageHero
        eyebrow="About the journey"
        title="Travel Adventure"
        subtitle="The same travel visual language now carries through the full site, not only the homepage."
      />

      <section className="content-block section-light">
        <div className="standard-page-grid">
          <div className="page-card">
            <h2 className="slide-title">
              Why I Love <span>Moto Travel</span>
            </h2>
            <p>
              Riding long roads by motorcycle gives a different kind of freedom. It is
              slower than flying, more connected than driving, and every stop becomes
              part of the memory. The changing weather, the sound of the road, and the
              views along the route are the reason this project is built around travel.
            </p>
            <p>
              Moto travel is not only about reaching a place. It is about the route,
              the climbs, the roadside breaks, and the stories that happen between
              destinations.
            </p>
          </div>

          <div className="moto-visual-grid">
            <div className="page-card image-card">
              <img src="/asset/travel28.jpg" alt="Travel route with scenic mountain view" />
            </div>
            <div className="page-card image-card">
              <img src="/asset/travel21.jpg" alt="Motorcycle travel route scenery" />
            </div>
          </div>
        </div>
      </section>

      <section className="content-block section-dark">
        <div className="gallery-wrapper">
          <h2 className="slide-title">
            Why Members <span>Join</span>
          </h2>
          <div className="feature-grid">
            {highlights.map((item, index) => (
              <div key={item} className="feature-card">
                <span className="feature-index">0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AboutPage;
