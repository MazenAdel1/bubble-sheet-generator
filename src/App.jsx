import { useState } from "react";
import "./App.css";

const ANSWERS = ["أ", "ب", "ج", "د"];

function App() {
  const [mode, setMode] = useState("form"); // "form" or "sheet"
  const [questions, setQuestions] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const amount = Number(e.target["questions-amount"].value);
    if (amount > 0) {
      setQuestions(amount);
      setAnswers(Array(amount).fill(null));
      setMode("sheet");
    }
  };

  const handleBubbleClick = (qIdx, aIdx) => {
    setAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === qIdx ? (ans === aIdx ? null : aIdx) : ans
      )
    );
  };

  const handleEdit = () => setMode("form");
  const handleClear = () => setAnswers(Array(questions).fill(null));

  // Helper to determine columns count based on questions
  const getColumnsCount = () => {
    if (questions <= 20) return 1;
    if (questions <= 40) return 2;
    if (questions <= 60) return 3;
    return 4;
  };

  // Helper to split questions into columns
  const getColumns = () => {
    const cols = getColumnsCount();
    const perCol = Math.ceil(questions / cols);
    return Array.from({ length: cols }, (_, colIdx) =>
      Array.from({ length: perCol }, (_, rowIdx) => {
        const qIdx = colIdx * perCol + rowIdx;
        return qIdx < questions ? qIdx : null;
      }).filter((v) => v !== null)
    );
  };

  return (
    <main dir="rtl">
      {mode === "form" ? (
        <form onSubmit={handleFormSubmit} className="bubble-form">
          <div>
            <label htmlFor="questions-amount">أدخل عدد الأسئلة</label>
            <input
              type="number"
              id="questions-amount"
              name="questions-amount"
              min={1}
              required
              autoFocus
            />
          </div>
          <button type="submit">إنشاء</button>
        </form>
      ) : (
        <section className="bubble-sheet-section">
          <div className="bubble-sheet-actions">
            <button className="edit-btn" onClick={handleEdit}>
              تعديل
            </button>
            <button className="clear-btn" onClick={handleClear}>
              مسح الورقة
            </button>
          </div>
          <div className="bubble-sheet-grid">
            {getColumns().map((col, colIdx) => (
              <div className="bubble-sheet-col" key={colIdx}>
                <div className="bubble-header">
                  <span>السؤال</span>
                  {ANSWERS.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
                {col.map((qIdx) => (
                  <div className="bubble-row" key={qIdx}>
                    <span className="bubble-q-num">{qIdx + 1}</span>
                    {ANSWERS.map((a, aIdx) => (
                      <button
                        key={a}
                        className={`bubble-btn${
                          answers[qIdx] === aIdx ? " selected" : ""
                        }`}
                        type="button"
                        onClick={() => handleBubbleClick(qIdx, aIdx)}
                        aria-label={`اختر ${a} للسؤال ${qIdx + 1}`}
                      >
                        {/* empty for visual bubble */}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
