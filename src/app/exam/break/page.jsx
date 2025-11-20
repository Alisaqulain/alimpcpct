"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BreakScreenContent() {
  const [seconds, setSeconds] = useState(60);
  const [userName, setUserName] = useState("User");
  const [breakComplete, setBreakComplete] = useState(false);
  const searchParams = useSearchParams();
  const nextSection = searchParams.get("next") || "/exam/english-ty";

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // First try to get from API
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.name) {
            setUserName(data.user.name);
            return;
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

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setBreakComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-redirect when break completes
  useEffect(() => {
    if (breakComplete && seconds === 0) {
      // Auto-redirect after 2 seconds
      const redirectTimer = setTimeout(() => {
        window.location.href = nextSection;
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [breakComplete, seconds, nextSection]);

  const handleNextSection = () => {
    if (breakComplete) {
      window.location.href = nextSection;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center mt-[-110]">
      <div className="w-full bg-[#290c52] text-yellow-400 text-left px-4 py-2 font-bold text-lg">
        MPCPCTMASTER 2025
      </div>

      <div className="flex flex-col items-center py-10 space-y-2 w-full">
        <img
          src="/lo.jpg"
          alt="avatar"
          className="w-20 h-20 rounded-full"
        />
        <p className="text-xl font-semibold">{userName}</p>
        <p className="text-sm font-semibold">
          Break End - <span className="italic text-gray-600">({`00:${seconds < 10 ? `0${seconds}` : seconds}`})</span>
        </p>

        <div className="mt-6 text-center space-y-2">
          <p className="text-base">
            1 मिनट का ब्रेक शुरू हो गया है। अगले सेक्शन पर तुरंत जाने के लिए{" "}
            <span className="font-bold">'Start Next Section'</span> बटन पर क्लिक करें।
          </p>
          <p className="text-sm italic text-pink-500">
            ब्रेक खत्म होते ही आप अपने आप अगले सेक्शन में चले जाएँगे।
          </p>
        </div>

        <button 
          onClick={handleNextSection}
          disabled={!breakComplete}
          className={`mt-6 px-5 py-2 rounded text-white ${
            breakComplete 
              ? "bg-[#290c52] cursor-pointer hover:bg-blue-700" 
              : "bg-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          Start Next Section
        </button>
      </div>
    </div>
  );
}

export default function BreakScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#290c52]"></div>
      </div>
    }>
      <BreakScreenContent />
    </Suspense>
  );
}
