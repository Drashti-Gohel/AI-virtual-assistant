import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userImg from "../assets/user.gif";
import aiImg from "../assets/ai.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
    const [ham,setHam] = useState(false)
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("recognition request to start");
        // setListening(true);
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
}
    //text to speech by assistant
    const speak = (text) => {
      const utterence = new SpeechSynthesisUtterance(text);
      isSpeakingRef.current = true;
      utterence.onend = () => {
        setAiText("");
        isSpeakingRef.current = false;
        setTimeout(() => {
          startRecognition();
        }, 800);
      };
      synth.cancel();
      synth.speak(utterence);
    };
    const handleCommand = (data) => {
      const { type, userInput, response } = data;
      speak(response);

      if (type === "google_search") {
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank",
        );
      }
      if (response.toLowerCase().includes("youtube")) {
    window.open("https://www.youtube.com", "_blank");
}
      if (type === "youtube_search") {
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
          "_blank",
        );
      }

      if (type === "weather_show") {
        window.open(
          `https://www.google.com/search?q=weather+${encodeURIComponent(userInput)}`,
          "_blank",
        );
      }

      if (type === "instagram_open") {
        window.open("https://www.instagram.com", "_blank");
      }

      if (type === "facebook_open") {
        window.open("https://www.facebook.com", "_blank");
      }
      if (type === "google_open") {
        window.open("https://www.google.com", "_blank");
      }
      if (type === "youtube_open") {
        window.open("https://www.youtube.com", "_blank");
      }

      if (type === "whatsapp_open") {
        window.open("https://web.whatsapp.com", "_blank");
      }

      if (type === "spotify_open") {
        window.open("https://open.spotify.com", "_blank");
      }
    };
    // speech to text by user
    useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("SpeechRecognition not supported");
        return;
      }
      const recognition = new SpeechRecognition();
      ((recognition.continuous = true), (recognition.lang = "en-US"));
      recognition.interimResults = false;
      recognitionRef.current = recognition;
      let isMounted = true;

      const startTimeout = setTimeout(() => {
        if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
          try {
            recognition.start();
            console.log("Recognition requested to start");
          } catch (err) {
            if (err.name !== "InvalidStateError") {
              console.error("Start error:", err);
            }
          }
        }
      }, 1000);
      recognition.onstart = () => {
        console.log("recognition started");
        isRecognizingRef.current = true;
        setListening(true);
      };

      recognition.onend = () => {
        console.log("Recognition ended ");
        isRecognizingRef.current = false;
        setListening(false);

        if (isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
                console.log("restarted");
              } catch (err) {
                if (err.name !== "InvalidStateError") {
                  console.error("Start error:", err);
                }
              }
            }
          }, 1000);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Recognition error:", event.error);
        isRecognizingRef.current = false;
        setListening(false);
        if (event.error !== "aborted" && !isSpeakingRef.current && isMounted) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
                console.log("restarted after error");
              } catch (error) {
                if (error.name !== "InvalidStateError") {
                  console.error("Start error:", error);
                }
              }
            }
          }, 1000);
        }
      };

      recognition.onresult = async (e) => {
        const script = e.results[e.results.length - 1][0].transcript.trim();

        console.log(script);
        if (
          script.toLowerCase().includes(userData?.assistantName?.toLowerCase())
        ) {
          setAiText("");
          setUserText(script);
          try {
            recognition.stop();
          } catch (err) {}

          isRecognizingRef.current = false;
          setListening(false);
          const data = await getGeminiResponse(script);

          if (!data) {
            console.warn("No response from getGeminiResponse");
            return;
          }
          console.log(data);
          handleCommand(data); // function call for response
          setAiText(data.response);
          setUserText("");
        }
      };

    
      return () => {
        isMounted = false;
        clearTimeout(startTimeout);
        try {
          recognition.stop();
        } catch (err) {}
        setListening(false);
        isRecognizingRef.current = false;
        //   clearInterval(fallback);
      };
    }, [getGeminiResponse, userData]);
    return (
      <div className="  w-full h-screen bg-linear-to-t from-black to-blue-800  flex justify-center items-center flex-col">
             <IoMenu className="text-white w-7 h-7 absolute top-10 right-10 " onClick={()=>setHam(true)} />
              <div className={` lg:hidden overflow-x-hidden p-5 absolute top-0  w-full h-screen backdrop-blur-md bg-transperent  flex items-start flex-col  ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
<RxCross2 className="text-white w-7 h-7 absolute top-10 right-10 " onClick={()=>setHam(false)} />
 <button
          className="cursor-pointer  min-w-47 text-black font-semibold h-12 mt-15 bg-white rounded-3xl "
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize your Avatar
        </button>
        <button
          className="cursor-pointer  min-w-35 text-black font-semibold h-12 mt-5 bg-white rounded-3xl "
          onClick={handleLogOut}
        >
          Logout
        </button>
        <div className="w-full h-1 bg-gray-700 mt-8 mb-5"> </div>
        <h1 className="text-white font-semibold text-xl" > History</h1>
          <div className="w-full h-400px  bg-gray-500 overflow-y-auto flex flex-col"> 
            {userData.history?.map((his, index) => (
              <span key={index} className="text-white">
                {his}
              </span>
            ))}
          </div>
</div>
        <button
          className="cursor-pointer hidden lg:block min-w-45 text-black font-semibold h-12 mt-2 bg-white rounded-3xl absolute top-22 right-5"
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize your Avatar
        </button>
        <button
          className="cursor-pointer hidden lg:block min-w-35 text-black font-semibold h-12 mt-2 bg-white rounded-3xl absolute top-6 right-5"
          onClick={handleLogOut}
        >
          Logout
        </button>

        <div className="w-30 h-45  lg:w-45 lg:h-55 bg-[#030326] border-2 border-blue rounded-2xl overflow-hidden shadow-lg">
          <img src={userData?.assistantImg} className="object-cover w-full h-full" />
        </div>
        <h1 className="text-white mt-3 text-[20px] mb-10">
          {" "}
          I am {userData?.assistantName}
        </h1>
        {!aiText && <img src={userImg} className="lg:w-40 lg:h-40 w-30 h-30" />}
        {aiText && <img src={aiImg} className="lg:w-40 lg:h-40 w-30 h-30" />}
        <h1 className="text-white mt-5">
          {" "}
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
    );
  };


export default Home;
