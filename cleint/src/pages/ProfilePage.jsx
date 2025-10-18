import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';


const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState("Hi Everyone, I'm using Quick Chat");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName: name,bio})
      navigate('/');
      return 

    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage)
    reader.onload = async ()=>{
      const base64Image = reader.result
      await updateProfile({ProfilePage: base64Image, fullName: name,bio})
      navigate('/')
    }

    
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg shadow-lg">
        
        {/* ---- Left: Profile Form ---- */}
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg font-semibold text-gray-800">Profile Details</h3>

          {/* Avatar Upload */}
          <label 
            htmlFor="avatar" 
            className="flex items-center gap-3 cursor-pointer text-gray-700"
          >
            <input 
              onChange={(e) => setSelectedImage(e.target.files[0])} 
              type="file" 
              id="avatar"  
              accept=".png,.jpg,.jpeg" 
              hidden 
            />
            <img 
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} 
              alt="avatar" 
              className="w-12 h-12 rounded-full border border-gray-400 object-cover" 
            />
            <span>Upload Profile Image</span>
          </label>

          {/* Name Input */}
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name}
            type="text" 
            required  
            placeholder="Your Name" 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" 
          />

          {/* Bio Input */}
          <textarea 
            placeholder="Write profile bio" 
            required 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" 
            rows={4} 
            value={bio}
            onChange={(e) => setBio(e.target.value)}   
          ></textarea>

          {/* Save Button */}
          <button 
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer hover:opacity-90 transition"
          >
            Save
          </button>
        </form>

        {/* ---- Right: Profile Preview ---- */}
        <div className="flex flex-col items-center mx-10 max-sm:mt-10">
          <img  
            className={`w-44 h-44 aspect-square rounded-full object-cover shadow-md ${selectedImage && 'rounded-full '}`}
            src={authUser?.profilePic || assets.logo_icon} 
            alt="profile-preview" 
          />
          <h4 className="mt-4 text-lg font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-600 text-center px-4">{bio}</p>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
