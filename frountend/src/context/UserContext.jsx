import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
export const userDataContext = createContext();
function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = React.useState(null);
  const [backendImage, setBackendImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data.user);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

 const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );

    return result.data;
  } catch (error) {
    if (error.response?.status === 429) {
      return {
        type: "general",
        response: "Too many requests right now. Please try again."
      };
    }

    console.log(error);
    return null;
  }
};

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
