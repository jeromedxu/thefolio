import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { useState } from "react";

const quizItems = [
  {
    question: "What gives a strong sense of freedom on this page?",
    options: ["Motorcycle travel", "Sleeping indoors", "Airport waiting"],
    correct: "Motorcycle travel",
  },
  {
    question: "What matters most in moto travel here?",
    options: ["Only the destination", "The route and the story", "Luxury shopping"],
    correct: "The route and the story",
  },
  {
    question: "Which location appears in the travel timeline?",
    options: ["Tuba, Benguet", "Tokyo", "Singapore Zoo"],
    correct: "Tuba, Benguet",
  },
];

function AboutPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = quizItems[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  const answeredCount = Object.keys(answers).length;
  const totalScore = quizItems.reduce(
    (score, item, index) => (answers[index] === item.correct ? score + 1 : score),
    0
  );

  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestion(0);
  };

  return (
    <>
      <PageHero
        eyebrow="About the journey"
        title="Travel Adventure"
        subtitle='"The road is life, the journey is freedom."'
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

          <div className="cards-container about-cards">
            <div className="vertical-card">
              <img src="/asset/travel28.jpg" alt="Travel route with scenic mountain view" />
              <div className="check-icon">OK</div>
            </div>
            <div className="vertical-card">
              <img src="/asset/travel21.jpg" alt="Motorcycle travel route scenery" />
              <div className="check-icon">OK</div>
            </div>
            <div className="vertical-card">
              <img src="/asset/travel15.jpg" alt="Forest ride stop during a road trip" />
              <div className="check-icon">OK</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-block section-dark">
        <div className="gallery-wrapper about-timeline">
          <h2 className="slide-title">
            Timeline Of <span>Our Travel Adventure</span>
          </h2>
          <div className="feature-grid">
            {[
              "First ride of 200 km along the coast",
              "Group ride to Tarlac and nearby mountain stops",
              "Explored Tuba, Benguet mountain roads",
              "Malico and Maranum Falls adventure routes",
            ].map((item, index) => (
              <div key={item} className="feature-card">
                <span className="feature-index">0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block section-light">
        <div className="gallery-wrapper">
          <h2 className="slide-title">
            Travel <span>Quiz</span>
          </h2>

          <div className="page-card quiz-panel">
            <div className="quiz-topline">
              <p className="quiz-progress">
                Question {currentQuestion + 1} of {quizItems.length}
              </p>
              <p className="quiz-score">
                Score: {totalScore}/{quizItems.length}
              </p>
            </div>
            <p className="quiz-question">{question.question}</p>
            <div className="quiz-option-list">
              {question.options.map((option) => (
                <button
                  key={option}
                  className={`quiz-option ${
                    selectedAnswer
                      ? option === question.correct
                        ? "correct"
                        : option === selectedAnswer
                          ? "incorrect"
                          : ""
                      : ""
                  }`}
                  type="button"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswer && (
              <p className={`quiz-feedback ${isCorrect ? "correct" : "incorrect"}`}>
                {isCorrect ? "Correct answer." : `Wrong answer. Correct: ${question.correct}`}
              </p>
            )}
            {answeredCount === quizItems.length && (
              <div className="quiz-summary">
                <strong>Total Score</strong>
                <span>
                  You answered {totalScore} out of {quizItems.length} correctly.
                </span>
              </div>
            )}
            <div className="quiz-actions">
              <button
                className="btn btn-outline community-outline"
                type="button"
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-solid"
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) => Math.min(prev + 1, quizItems.length - 1))
                }
                disabled={currentQuestion === quizItems.length - 1}
              >
                Next
              </button>
              <button
                className="btn btn-outline community-outline"
                type="button"
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="content-block section-light">
        <div className="gallery-wrapper">
          <h2 className="slide-title">
            Travel <span>Gallery</span>
          </h2>
          <div className="home-gallery-grid">
            {[
              "/asset/travel28.jpg",
              "/asset/travel33.jpg",
              "/asset/travel11.jpg",
              "/asset/travel12.jpg",
              "/asset/travel13.jpg",
              "/asset/travel14.jpg",
            ].map((image, index) => (
              <div key={image} className="home-gallery-card">
                <img src={image} alt={`Travel gallery ${index + 1}`} />
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
