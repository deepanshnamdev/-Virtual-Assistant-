import React from 'react'
import { userDataContext } from '../context/UserContext';

const Card = ({ image }) => {
  const{serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage}=React.useContext(userDataContext);
  return (
    <div className=
      {`w-[120px] h-[200px]
      sm:w-[140px] sm:h-[230px]
      md:w-[160px] md:h-[260px]
      bg-gray-800
      rounded-lg
      border-[3px] border-[#1E3A8A]
      hover:border-cyan-300
      transition-colors duration-300
      hover:border-5
      shadow-lg
      cursor-pointer
      overflow-hidden ${selectedImage === image ? 'border-cyan-300 border-5 shadow-lg' : ''}`}
     onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
      
      }}>
      <img
        src={image}
        alt="AI avatar"
        className="w-full h-full object-cover "
      />
    </div>
  )
}

export default Card
