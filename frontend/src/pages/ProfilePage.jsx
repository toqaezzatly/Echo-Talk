import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Phone, MapPin, Link } from "lucide-react";

const ProfilePage = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [error, setError] = useState(null);
    const [statusText, setStatusText] = useState("");
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [locationInput, setLocationInput] = useState("");
     const [websiteInput, setWebsiteInput] = useState("");
    const [isEditingContact, setIsEditingContact] = useState(false);

     useEffect(() => {
         if (authUser) {
            console.log("useEffect authUser changed:", authUser)
            setStatusText(authUser?.status || "Hey. I am using Echo-Talk!");
              setPhoneInput(authUser?.phone || "");
             setLocationInput(authUser?.location || "");
             setWebsiteInput(authUser?.website || "");

        }
    }, [authUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            try {
                const base64Image = reader.result;
                setSelectedImg(base64Image);
                await updateProfile({ profilePic: base64Image });
                setError(null);
            } catch (err) {
                console.error("Error updating profile:", err);
                setError("Failed to upload image. Please try again.");
            }
        };
    };

    const handleStatusChange = (e) => {
        setStatusText(e.target.value);
    };

    const handleSaveStatus = async () => {
        const statusToSave = statusText.trim() === "" ? "Hey. I am using Echo-Talk!" : statusText;
        await updateProfile({ status: statusToSave });
        setIsEditingStatus(false);
    };

    const handleEditStatus = () => {
        setIsEditingStatus(true);
    };

    const handleCancelStatusEdit = () => {
        setIsEditingStatus(false);
       setStatusText(authUser?.status || "Hey. I am using Echo-Talk!");
    };

    const handleEditContact = () => {
        setIsEditingContact(true);
    };

      const handleCancelContactEdit = () => {
          setIsEditingContact(false);
            setPhoneInput(authUser?.phone || "");
             setLocationInput(authUser?.location || "");
             setWebsiteInput(authUser?.website || "");
        
             

    };


    const handleSaveContact = async () => {
      await updateProfile({
          phone: phoneInput.trim(), // Save trimmed value (empty string remains empty)
          location: locationInput.trim(),
          website: websiteInput.trim(),
      });
      setIsEditingContact(false);
  };
  

    const handlePhoneChange = (e) => {
        setPhoneInput(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocationInput(e.target.value);
    };

    const handleWebsiteChange = (e) => {
        setWebsiteInput(e.target.value);
    };


    if (!authUser) {
        return <div className="text-center mt-20">Loading profile...</div>;
    }


    return (
        <div className="bg-base-100 text-base-content min-h-screen">
            <div className="max-w-md mx-auto py-8 px-4 space-y-6 mt-16">
                {/* Profile Header Section */}
                <div className="flex items-center space-x-4">
                    {/* Avatar Section */}
                    <div className="relative">
                        <img
                            src={selectedImg || authUser.profilePic || "/avatar.png"}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-base-300"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className={`absolute bottom-0 right-0 bg-base-200 hover:scale-105 p-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                            }`}
                        >
                            <Camera className="w-4 h-4 text-base-content" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                    {/* Name and Status Section */}
                    <div className="flex-1">
                        <h1 className="font-bold text-xl">{authUser?.fullName || "N/A"}</h1>
                        {/* Status Section - Editable */}
                        <div className="flex items-center  gap-2 mt-1">
                            {!isEditingStatus ? (
                                <>
                                    <p className="text-sm text-gray-400">
                                        {statusText}
                                    </p>
                                    <button onClick={handleEditStatus} className="text-gray-500 text-xs hover:underline focus:outline-none">Edit</button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={statusText}
                                        onChange={handleStatusChange}
                                        className="text-sm bg-base-200 rounded-lg px-2 py-1 focus:outline-none"
                                    />
                                    <button onClick={handleSaveStatus} className="btn btn-xs btn-primary">Save</button>
                                    <button onClick={handleCancelStatusEdit} className="btn btn-xs btn-ghost">Cancel</button>
                                </div>

                            )}
                        </div>


                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                        {isUpdatingProfile && <p className="text-xs text-gray-500">Uploading...</p>}
                    </div>
                </div>


                {/* User Info Section */}
                <div className="bg-base-200 rounded-xl p-4 mt-6">
                    <h2 className="text-lg font-medium mb-4 text-gray-600">Info</h2>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm py-2  border-b border-base-300">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">Full Name</span>
                            <span className="ml-auto text-gray-500">{authUser?.fullName || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">Email</span>
                            <span className="ml-auto text-gray-500">{authUser?.email || "N/A"}</span>

                        </div>
                    </div>
                </div>


                {/* Contact Information Section */}
                <div className="bg-base-200 rounded-xl p-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-600">Contact Information</h2>
                        {!isEditingContact &&
                            <button onClick={handleEditContact} className="text-gray-500 text-sm hover:underline focus:outline-none">Edit</button>}
                        </div>


                    {!isEditingContact ? (
                        <div className="space-y-2">

                                <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">Phone Number</span>
                                    <span className="ml-auto text-gray-500">{phoneInput || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm py-2 border-b border-base-300">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">Location</span>
                                    <span className="ml-auto text-gray-500">{locationInput || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm py-2">
                                    <Link className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">Website</span>
                                    <span className="ml-auto text-gray-500">{websiteInput || "N/A"}</span>
                                </div>

                        </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={phoneInput}
                                        onChange={handlePhoneChange}
                                        placeholder="Phone Number"
                                        className="text-sm bg-base-300 rounded-lg px-2 py-1 focus:outline-none w-full"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                   <MapPin className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={locationInput}
                                        onChange={handleLocationChange}
                                        placeholder="Location"
                                        className="text-sm bg-base-300 rounded-lg px-2 py-1 focus:outline-none w-full"
                                    />
                                </div>

                                 <div className="flex items-center gap-2">
                                    <Link className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={websiteInput}
                                        onChange={handleWebsiteChange}
                                        placeholder="Website"
                                        className="text-sm bg-base-300 rounded-lg px-2 py-1 focus:outline-none w-full"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button onClick={handleSaveContact} className="btn btn-xs btn-primary">Save</button>
                                    <button onClick={handleCancelContactEdit} className="btn btn-xs btn-ghost">Cancel</button>
                                </div>

                            </div>
                        )}

                </div>

                {/* Account Information */}
                <div className="mt-6 bg-base-200 rounded-xl p-4">
                    <h2 className="text-lg font-medium mb-4 text-gray-600">Account Information</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-base-300">
                            <span className="text-gray-700">Member Since</span>
                            <span className="text-gray-500">{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-700">Account Status</span>
                            <span className="text-green-500">Active</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;