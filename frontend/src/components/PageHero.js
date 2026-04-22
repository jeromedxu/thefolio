const PageHero = ({ eyebrow, title, subtitle, compact = false }) => {
  return (
    <section
      className={`page-hero ${compact ? "compact" : ""}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 76, 117, 0.45), rgba(15, 76, 117, 0.58)), url('/asset/travel28.jpg')",
      }}
    >
      <div className="section-overlay"></div>
      <div className="page-hero-inner">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
};

export default PageHero;
