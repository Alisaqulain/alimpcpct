"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TopicWiseMCQPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    fetchTopics();
  }, []);

  // Auto-select topic from URL parameter
  useEffect(() => {
    const topicIdFromUrl = searchParams.get("topicId");
    if (topicIdFromUrl && topics.length > 0 && !selectedTopic) {
      const topic = topics.find(t => t.topicId === topicIdFromUrl);
      if (topic) {
        setSelectedTopic(topic);
        fetchQuestions(topic.topicId);
      }
    }
  }, [topics, searchParams, selectedTopic]);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/topicwise/my-topics", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Topics fetched:', data.topics?.length || 0, 'topics');
        console.log('Topics data:', data.topics);
        setTopics(data.topics || []);
        if (!data.isPaid) {
          setError("subscription_required");
        }
      } else if (res.status === 401) {
        setError("Please login to view your topics");
      } else if (res.status === 403) {
        const data = await res.json();
        if (data.error === "Active subscription required") {
          setError("subscription_required");
        } else {
          setError(data.error || "Access denied");
        }
      } else {
        setError("Failed to load topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (topicId) => {
    setQuestionsLoading(true);
    setSelectedAnswers({});
    setShowResults(false);
    try {
      const res = await fetch(`/api/topicwise/questions?topicId=${topicId}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      } else {
        alert("Failed to load questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions");
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    fetchQuestions(topic.topicId);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q._id] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      if (!confirm("You haven't answered all questions. Do you want to submit anyway?")) {
        return;
      }
    }
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fff]">
        <div className="text-center">
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (error === "subscription_required") {
      return (
        <div className="min-h-screen flex justify-center items-center bg-[#fff] px-4">
          <div className="w-full max-w-4xl border border-gray-300 px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 md:pt-20 rounded-2xl">
            <div className="text-center py-12">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                  Subscription Required
                </h2>
                <p className="text-gray-700 mb-6">
                  Topic Wise MCQ is available for paid students only. Please subscribe to access this feature.
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/payment-app"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
                  >
                    Subscribe Now
                  </a>
                  <a
                    href="/price"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold"
                  >
                    View Plans
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#fff] px-4">
        <div className="w-full max-w-4xl border border-gray-300 px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 md:pt-20 rounded-2xl">
          <div className="text-center py-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <p className="text-red-700">{error}</p>
              <a
                href="/login"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] px-4 py-10">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#290c52]">
          Topic Wise MCQ
        </h1>

        {!selectedTopic ? (
          <div className="border border-gray-300 rounded-2xl p-6">
            {topics.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
                  <p className="text-gray-600 mb-4">
                    No topics assigned yet. Contact your administrator to get topics assigned to your account.
                  </p>
                  <p className="text-sm text-gray-500">
                    Note: Topic Wise MCQ is available for paid students only.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-[#290c52]">
                  Select a Topic
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics.map((topic) => (
                    <div
                      key={topic._id}
                      onClick={() => handleTopicSelect(topic)}
                      className="border border-gray-200 rounded-xl shadow-md p-4 cursor-pointer hover:bg-[#290c52] hover:text-white transition-colors duration-300"
                    >
                      <h3 className="text-lg font-medium mb-2">{topic.topicName}</h3>
                      {topic.description && (
                        <p className="text-sm opacity-80">{topic.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center border border-gray-300 rounded-xl p-4 bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-[#290c52]">
                  {selectedTopic.topicName}
                </h2>
                {selectedTopic.description && (
                  <p className="text-sm text-gray-600">{selectedTopic.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setQuestions([]);
                  setSelectedAnswers({});
                  setShowResults(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
              >
                Back to Topics
              </button>
            </div>

            {questionsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8">
                  <p className="text-gray-600">No questions available for this topic.</p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">
                      Language:
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="ml-2 border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी</option>
                      </select>
                    </label>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.keys(selectedAnswers).length} / {questions.length} answered
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((question, index) => {
                    const isCorrect = selectedAnswers[question._id] === question.correctAnswer;
                    const userAnswer = selectedAnswers[question._id];
                    const options = language === "hi" && question.options_hi?.length > 0
                      ? question.options_hi
                      : question.options_en;
                    const questionText = language === "hi" && question.question_hi
                      ? question.question_hi
                      : question.question_en;

                    return (
                      <div
                        key={question._id}
                        className={`border rounded-lg p-4 ${
                          showResults
                            ? isCorrect
                              ? "bg-green-50 border-green-300"
                              : "bg-red-50 border-red-300"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <span className="font-semibold text-[#290c52]">
                            Q{index + 1}.
                          </span>
                          <p className="flex-1">{questionText}</p>
                        </div>

                        <div className="space-y-2 ml-6">
                          {options.map((option, optIndex) => {
                            const isSelected = userAnswer === optIndex;
                            const isCorrectOption = optIndex === question.correctAnswer;

                            return (
                              <label
                                key={optIndex}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                                  showResults
                                    ? isCorrectOption
                                      ? "bg-green-200"
                                      : isSelected && !isCorrectOption
                                      ? "bg-red-200"
                                      : ""
                                    : isSelected
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question._id}`}
                                  checked={isSelected}
                                  onChange={() => handleAnswerSelect(question._id, optIndex)}
                                  disabled={showResults}
                                  className="cursor-pointer"
                                />
                                <span>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </span>
                                {showResults && isCorrectOption && (
                                  <span className="ml-auto text-green-600 font-semibold">
                                    ✓ Correct
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>

                        {showResults && question.explanation_en && (
                          <div className="mt-3 ml-6 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm">
                              <strong>Explanation:</strong>{" "}
                              {language === "hi" && question.explanation_hi
                                ? question.explanation_hi
                                : question.explanation_en}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  {!showResults ? (
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-lg font-semibold text-[#290c52]">
                          Score: {calculateScore().correct} / {calculateScore().total}
                        </p>
                        <p className="text-sm text-gray-600">
                          Percentage:{" "}
                          {((calculateScore().correct / calculateScore().total) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopicWiseMCQPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-[#fff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <TopicWiseMCQPageContent />
    </Suspense>
  );
}

