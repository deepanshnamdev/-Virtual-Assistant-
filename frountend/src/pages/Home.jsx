import React, { useEffect, useRef, useState, useContext } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AI from "../assets/AI.gif";
import USER from "../assets/USER.gif";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const isSpeaking = useRef(false);
  const isRecognizing = useRef(false);
  const synth = window.speechSynthesis;

  const recognitionRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = ham ? "hidden" : "auto";
  }, [ham]);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    isSpeaking.current = true;

    utterance.onend = () => {
      isSpeaking.current = false;
      setAiText("");

      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch {}
      }, 800);
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    if (!data || !data.type) return;

    const { type, userInput } = data;
    const query = encodeURIComponent(userInput || "");

    const actions = {
      google_search: () =>
        window.open(`https://www.google.com/search?q=${query}`, "_blank"),
      youtube_search: () =>
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        ),
      youtube_play: () =>
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        ),
      wikipedia_search: () =>
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank"),
      calculator_open: () =>
        window.open(`https://www.google.com/search?q=calculator`, "_blank"),
      instagram_open: () =>
        window.open(`https://www.instagram.com/`, "_blank"),
      facebook_open: () =>
        window.open(`https://www.facebook.com/`, "_blank"),
      weather_show: () =>
        window.open(
          `https://www.google.com/search?q=weather+in+${query}`,
          "_blank"
        ),
    };

    actions[type]?.();
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.lang = "en-US";

    const safeStart = () => {
      if (!isSpeaking.current && !isRecognizing.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onstart = () => {
      isRecognizing.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizing.current = false;
      setListening(false);

      if (!isSpeaking.current) {
        setTimeout(safeStart, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);

      isRecognizing.current = false;
      setListening(false);

      setTimeout(() => {
        safeStart();
      }, 1200);
    };

    recognition.onresult = async (e) => {
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      if (
        userData?.assistantName &&
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {
        recognition.stop();
        isRecognizing.current = false;
        setListening(false);

        setUserText(transcript);
        setAiText("Thinking...");

        try {
          const data = await getGeminiResponse(transcript);

          if (!data) {
            speak("Sorry, I could not get a response.");
            setTimeout(() => safeStart(), 1500);
            return;
          }

          if (data.response) {
            setAiText(data.response);
            speak(data.response);
          }

          handleCommand(data);
        } catch (err) {
          console.log(err);
          speak("Something went wrong.");
          setTimeout(() => safeStart(), 2000);
        } finally {
          setUserText("");
        }
      }
    };

    safeStart();

    const micWatcher = setInterval(() => {
      if (!isRecognizing.current && !isSpeaking.current) {
        try {
          recognition.start();
        } catch {}
      }
    }, 3000);

    return () => {
      recognition.stop();
      clearInterval(micWatcher);
    };
  }, [userData]);

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-b from-[#2b3dffbc] via-black to-black flex flex-col items-center justify-between px-4 py-6">

      <GiHamburgerMenu
        className="lg:hidden text-white absolute top-[20px] left-[20px] w-[25px] h-[25px] cursor-pointer z-40"
        onClick={() => setHam(true)}
      />

      <div className="hidden lg:flex absolute top-[20px] right-[20px] gap-[15px]">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md !py-1.5 !text-sm"
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>

        <button
          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      <div
        className={`fixed lg:hidden top-0 left-0 w-full h-screen bg-black/90 backdrop-blur-md p-[20px] flex flex-col gap-[20px] overflow-y-auto
        transform transition-transform duration-300 ease-in-out z-50
        ${ham ? "translate-x-0" : "-translate-x-full"}`}
      >
        <RxCross2
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer"
          onClick={() => setHam(false)}
        />

        <button
          className="w-[250px] h-[50px] bg-blue-500 text-white rounded-md !h-[40px] !text-sm"
          onClick={() => {
            navigate("/customize");
            setHam(false);
          }}
        >
          Customize Your Assistant
        </button>

        <button
          className="w-[250px] h-[50px] bg-blue-500 text-white rounded-md !h-[40px] !text-sm"
          onClick={handleLogOut}
        >
          Log Out
        </button>

        {/* History Section */}
        <div className="mt-4 flex-1 overflow-y-auto w-full">
          <h2 className="text-white text-lg font-semibold mb-3">History</h2>

          {userData?.history && userData.history.length > 0 ? (
            userData.history.slice().reverse().map((item, index) => (
              <div
                key={index}
                className="bg-white/10 text-gray-300 text-sm p-2 rounded-md mb-2 break-words"
              >
                {item}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No history yet</p>
          )}
        </div>
      </div>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg">
        <img
          src={userData?.assistantImage || ""}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[15px] font-semibold">
        I'm <span className="text-cyan-500">{userData?.assistantName}</span>
      </h1>

      {!aiText ? (
        <img src={USER} alt="User" className="w-40 h-40 rounded-full" />
      ) : (
        <img src={AI} alt="AI" className="w-40 h-40 rounded-full" />
      )}

      <h1 className="text-green-400 text-[16px] font-medium animate-pulse mb-9">
        {userText}
      </h1>

      <h1 className="text-cyan-400 text-[16px] font-medium">
        {aiText}
      </h1>
    </div>
  );
};

export default Home;
