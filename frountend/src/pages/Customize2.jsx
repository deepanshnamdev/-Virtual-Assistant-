import React from 'react'
import { userDataContext } from '../context/userContext.jsx'
import axios from 'axios'
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {
    userData,
    backendImage,
    selectedImage,
    serverUrl,
    setUserData
  } = React.useContext(userDataContext)

  const [assistantName, setAssistantName] = React.useState(userData?.assistantName || "")
  const [loading, setLoading] = React.useState(false)

  const navigate = useNavigate()

  const handleUpdateAssistantName = async () => {
    if (!assistantName.trim()) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("assistantName", assistantName)

      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else {
        formData.append("selectedImage", selectedImage)
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      )

      console.log(result.data);


      setUserData(result.data.user)

       navigate("/") 
     

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-[#0B0F14] to-[#0040ff69] flex flex-col justify-center items-center px-4 relative'>

      <IoArrowBackCircle
        className="text-white text-3xl cursor-pointer absolute top-[30px] left-[30px] w-[25px] h-[25px] hover:text-cyan-300 transition-colors duration-300"
        onClick={() => navigate("/customize")}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Enter Your <span className="text-cyan-300">AI Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="Example: Jarvis"
        className="w-[80%] h-[50px] rounded-md px-[20px] focus:outline-none border-[2px] border-gray-600 focus:border-cyan-300 transition-colors duration-300"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {assistantName.trim() && (
        <button
          className="w-[35%] h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer mt-4"
          disabled={loading}
          onClick={handleUpdateAssistantName}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  )
}

export default Customize2
