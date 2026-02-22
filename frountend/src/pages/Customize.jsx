import React from 'react'
import Card from '../components/Card'
import AI1 from '../assets/AI1.png'
import AI2 from '../assets/AI2.png'
import AI3 from '../assets/AI3.png'
import AI4 from '../assets/AI4.png'
import AI5 from '../assets/AI5.png'
import AI6 from '../assets/AI6.png'
import AI7 from '../assets/AI7.png'
import { BiCloudUpload } from "react-icons/bi";
import { userDataContext } from '../context/userContext.jsx'
import { useNavigate } from 'react-router-dom';

const Customize = () => {
    const inputImage=React.useRef();
    const{serverUrl,
        userData,
        setUserData,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage}=React.useContext(userDataContext);

        const navigate=useNavigate();
    const handleImage=(e)=>{
        const file=e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));

    } 
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-[#0B0F14] to-[#0040ff69] flex flex-col justify-center items-center px-4 relative">  
  
  <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 ">
    Select your <span className="text-cyan-300">AI Assistant</span>
  </h1>

  <div
    className="
      w-full
      max-w-6xl
      
      flex
      justify-center
      items-center
      gap-4
      flex-wrap
      py-6
      rounded-lg
    "
  >
    <Card image={AI1} />
    <Card image={AI3} />
    <Card image={AI2} />
    <Card image={AI4} />
    <Card image={AI5} />
    <Card image={AI6} />
    <Card image={AI7} />

    <div
      className=
            {`w-[120px] h-[200px]
             sm:w-[140px] sm:h-[230px]
             md:w-[160px] md:h-[260px]
             bg-gray-800
             rounded-lg
             border-[3px] border-[#1E3A8A]
             hover:border-cyan-400
             transition-colors duration-300
             shadow-lg
             cursor-pointer
             overflow-hidden
             flex justify-center items-center ${selectedImage === "input" ? 'border-cyan-400 border-5 shadow-lg' : ''}  `}
      
        onClick={() => {
          inputImage.current.click()
          setSelectedImage("input");

        }}
    >
      {!frontendImage && <BiCloudUpload className="text-white w-[25px] h-[25px]" />}
      {frontendImage && (
        <img src={frontendImage} alt="Uploaded" className="w-full h-full object-cover" />
      )}
    </div>  
    <input type="file" accept='image/*' hidden ref={inputImage} onChange={handleImage}/>
  </div>
  {selectedImage  && <button className=" w-[20%] h-[50px] bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer " onClick={()=>navigate("/customize2")} >
            Next
        </button>}
        
</div>
   
  )
}


export default Customize