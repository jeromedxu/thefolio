import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("body", body);
      if (image) fd.append("image", image);

      const { data } = await API.post("/posts", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish post");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="New post"
        title="Write A Post"
        subtitle="Use the same travel background and clean card form layout for publishing."
        compact
      />

      <section className="content-block section-light">
        <div className="auth-shell">
          <div className="page-card auth-card">
            <h3>Create a New Travel Post</h3>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Post title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Post body</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={12} required />
              </div>
              {user?.role === "admin" && (
                <div className="form-group">
                  <label>Upload Cover Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>
              )}
              <button type="submit" className="btn btn-solid">
                Publish Post
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CreatePostPage;
