"use client";
import React, { useState, useEffect } from "react";

export default function CpctScoreCard() {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Fetch user name from API
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.name) {
            setUserName(data.user.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
      
      // Fallback to localStorage
      const userDataStr = localStorage.getItem('examUserData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.name) {
            setUserName(userData.name);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };
    
    fetchUserName();
  }, []);

  // Load result data from localStorage or API
  useEffect(() => {
    const loadResultData = () => {
      try {
        // Try to get from localStorage (set by keyboard/typing pages)
        const savedResult = localStorage.getItem('learningResult');
        if (savedResult) {
          const parsed = JSON.parse(savedResult);
          // Use fetched userName if available, otherwise use saved one
          if (userName) {
            parsed.userName = userName;
          }
          setResultData(parsed);
        } else {
          // Default data for display
          setResultData({
            timeUsed: 0,
            grossSpeed: 0,
            accuracy: 0,
            netSpeed: 0,
            difficultKeys: [],
            userName: userName || "User",
            exerciseName: "",
            language: "English",
            resultDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            resultTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            timeDuration: 0
          });
        }
      } catch (error) {
        console.error('Error loading result data:', error);
        // Fallback to default data
        setResultData({
          timeUsed: 0,
          grossSpeed: 0,
          accuracy: 0,
          netSpeed: 0,
          difficultKeys: [],
          userName: userName || "User",
          exerciseName: "",
          language: "English",
          resultDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
          resultTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          timeDuration: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadResultData();
  }, [userName]);

  // Format time in minutes (e.g., "2:26 min.")
  const formatTimeInMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")} min.`;
  };

  // Get difficult keys sorted by difficulty
  const getDifficultKeys = () => {
    if (!resultData || !resultData.difficultKeys) return [];
    return resultData.difficultKeys
      .sort((a, b) => b.difficulty - a.difficulty)
      .slice(0, 15);
  };

  // Calculate bar height based on difficulty value
  // Higher difficulty = taller bar, lower difficulty = shorter bar
  // Bars scale proportionally: more data = taller bar, less data = shorter bar
  const calculateBarHeight = (difficulty, maxDifficulty, containerHeight = 140) => {
    if (maxDifficulty === 0) {
      // If no max difficulty, show all bars at minimum height
      return difficulty > 0 ? 10 : 5;
    }
    if (difficulty === 0) {
      // Zero difficulty = minimum visible bar
      return 5;
    }
    // Scale difficulty to container height proportionally
    // Formula: (current difficulty / max difficulty) * container height
    // This ensures: more difficulty = taller bar, less difficulty = shorter bar
    const height = (difficulty / maxDifficulty) * containerHeight;
    // Ensure minimum height of 5px for visibility and maximum of containerHeight
    return Math.max(5, Math.min(containerHeight, Math.round(height)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#290c52]"></div>
      </div>
    );
  }

  const difficultKeys = getDifficultKeys();
  const maxDifficulty = difficultKeys.length > 0 
    ? Math.max(1, ...difficultKeys.map(k => k.difficulty)) 
    : 1;
  return (
      <div>
    <div className="max-w-4xl mx-auto border-4 border-[#290c52] bg-white shadow-xl text-sm font-sans my-5">
      {/* Full-Width Header */}
      <div
        className="w-full px-4 py-2 border"
        style={{
          backgroundColor: "#290c52",
          backgroundImage: "url('/bg.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* Left Logo - order changes on mobile */}
          <img
            src="/logor.png"
            alt="MP Logo"
            className="h-20 w-auto md:h-24 md:mt-[-8] md:order-1 order-2"
          />

          {/* Center Title - comes first on mobile */}
          <div className="text-center flex-1 md:-ml-12 order-1 md:order-2">
            <h1
              className="text-3xl md:text-5xl font-extrabold uppercase leading-[1.2] text-white"
              style={{
                textShadow: `
                  0 0 10px black,
                  1px 1px 0 #39245f,
                  2px 2px 0 #341f57,
                  3px 3px 0 #2d1a4e,
                  4px 4px 0 #241244,
                  5px 5px 6px rgba(0, 0, 0, 0.4)
                `,
                letterSpacing: '2px',
              }}
            >
              MPCPCT
            </h1>
            <p className="text-lg md:text-2xl text-pink-300 font-semibold">
              (To Help in typing & computer proficiency)
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4 font-semibold text-lg mt-2 py-4 relative">
        {/* Student Photo - position adjusted for mobile */}
        <img
          src="/lo.jpg"
          alt="Student"
          className="w-16 sm:w-24 h-12 sm:h-20 border ml-2 absolute left-0 top-[40] md:top-1/2 transform -translate-y-1/2"
        />
        <p className="uppercase font-bold text-xl md:text-2xl">Result</p>
        <p className="text-xl md:text-2xl">Learning Section</p>
      </div>

      {/* Details Table */}
      <div className="overflow-x-auto text-sm border border-gray-300 w-full max-w-full mx-auto">
        <table className="table-auto w-full border border-black">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black px-2 py-1 font-semibold">Name of Student</td>
              <td className="border border-black px-2 py-1">{resultData?.userName || "User"}</td>
              <td className="border border-black px-2 py-1 font-semibold">Result Date</td>
              <td className="border border-black px-2 py-1">{resultData?.resultDate || ""} {resultData?.resultTime || ""}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black px-2 py-1 font-semibold">Test Language</td>
              <td className="border border-black px-2 py-1">{resultData?.language || "English"}</td>
              <td className="border border-black px-2 py-1 font-semibold">Time Duration</td>
              <td className="border border-black px-2 py-1">{resultData?.timeDuration ? `${resultData.timeDuration} seconds` : "0 seconds"}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black px-2 py-1 font-semibold">Exercise Name</td>
              <td className="border border-black px-2 py-1" colSpan={3}>{resultData?.exerciseName || "Keyboard Practice"}</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1 font-semibold">Exam Centre Name</td>
              <td className="border border-black px-2 py-1" colSpan={3}>MPCPCT</td>
            </tr>
            <tr>
              <td className="text-center" colSpan={4}>Result</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Performance Metrics Section */}
      <div className="mb-6 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Time Used</div>
            <div className="text-xl font-bold flex items-center gap-2">
              {resultData ? formatTimeInMinutes(resultData.timeUsed || 0) : "0:00 min."}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Gross Speed</div>
            <div className="text-xl font-bold">{resultData?.grossSpeed || 0} wpm</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Accuracy</div>
            <div className="text-xl font-bold">{resultData?.accuracy || 0}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Net Speed</div>
            <div className="text-xl font-bold">{resultData?.netSpeed || 0} wpm</div>
          </div>
        </div>
      </div>

      {/* Difficult Keys Section */}
      {difficultKeys.length > 0 && (
        <div className="bg-white p-4 w-full max-w-full text-sm mb-3">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">Difficult Keys in this Exercise</h2>
            <a href="#" className="text-blue-600 text-xs underline">Review</a>
          </div>
          
          {/* Bar Chart Container */}
          <div className="bg-green-50 rounded-lg p-4 relative" style={{ minHeight: '180px' }}>
            {/* Difficulty Zones Labels - Left Side */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-2 text-xs font-semibold" style={{ height: '150px' }}>
              <div className="text-red-600">Problematic</div>
              <div className="text-orange-600">Difficult</div>
              <div className="text-green-600">OK</div>
            </div>
            
            {/* Bars Container */}
            <div className="ml-12 flex items-end justify-start gap-3" style={{ height: '150px' }}>
              {difficultKeys.map(({ key, difficulty }) => {
                // Calculate bar height directly from difficulty value
                // More difficulty = taller bar, less difficulty = shorter bar
                const barHeight = calculateBarHeight(difficulty, maxDifficulty, 140);
                
                // Determine zone based on percentage of max difficulty
                const difficultyPercentage = maxDifficulty > 0 ? (difficulty / maxDifficulty) * 100 : 0;
                const zone = difficultyPercentage > 70 ? 'problematic' : difficultyPercentage > 40 ? 'difficult' : 'ok';
                const barColor = '#3b82f6'; // Blue color like in image
                
                return (
                  <div key={key} className="flex flex-col items-center" style={{ width: '40px' }}>
                    <div 
                      className="w-8 rounded-t transition-all"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: barColor,
                        minHeight: '5px'
                      }}
                    />
                    <div className="text-xs mt-1 font-semibold text-center">{key}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center text-md border-t pt-4 px-4 font-semibold">
        <p className="mb-2 md:mb-0 text-sm md:text-base">Date of Publication of Result : <span>{resultData?.resultDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
        <img
          src="/seal.png"
          alt="Seal"
          className="h-20 md:h-30 mx-auto pb-2 md:pb-5"
        />
        <div className="relative mt-2 md:mt-0">
          <img 
            src="/sing.png" 
            alt="Controller" 
            className="h-20 md:h-30 ml-auto  mb-[-35]" 
          />
          <p className="italic text-gray-500 text-sm md:text-base">
            Head of Examinations
          </p>
        </div>
      </div>
      </div>
         <button className="bg-red-600 hover:bg-blue-700 text-white font-medium px-4 py-2 mb-2 ml-35 sm:ml-40 md:ml-70 lg:ml-80 xl:ml-156">
  <a href="/">Go To Home</a>
</button>
    </div>
  );
}