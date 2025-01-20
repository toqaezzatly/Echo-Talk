import React from "react";
import { Camera, Mail, User, Phone, MapPin, Link } from "lucide-react";


const OtherUserProfile = ({ user, onClose }) => {
    if (!user) {
        return null;
    }
      console.log("User data for profile:", user);

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md max-w-md overflow-y-auto">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">User Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                 <div className="flex flex-col items-center">
                    <img src={ user.profilePic || "/avatar.png"} alt="Profile Pic" className="w-24 h-24 rounded-full mb-4 border-2" />
                     <h2 className="text-lg font-medium mb-4 text-gray-600">{user?.fullName || "N/A"}</h2>
                 </div>

                <div className="bg-base-200 rounded-xl p-4 mt-6">
                  <h2 className="text-lg font-medium mb-4 text-gray-600">Info</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm py-2  border-b border-base-300">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Full Name</span>
                        <span className="ml-auto text-gray-500">{user?.fullName || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Email</span>
                        <span className="ml-auto text-gray-500">{user?.email || "N/A"}</span>
                    </div>
                 </div>
               </div>


            {/* Contact Information Section */}
            <div className="bg-base-200 rounded-xl p-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-600">Contact Information</h2>
                 </div>
                <div className="space-y-2">

                  <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Phone Number</span>
                      <span className="ml-auto text-gray-500">{user?.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">Location</span>
                      <span className="ml-auto text-gray-500">{user?.location || "N/A"}</span>
                  </div>
                    <div className="flex items-center gap-3 text-sm py-2">
                      <Link className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Website</span>
                      <span className="ml-auto text-gray-500">{user?.website || "N/A"}</span>
                  </div>
               </div>
           </div>
       </div>
   </div>
    );
};

export default OtherUserProfile;