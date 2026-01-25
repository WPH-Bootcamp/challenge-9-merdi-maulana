import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/features/store";
import { User, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "@/features/auth/authSlice";
import ProfileSidebar from "@/components/uiCustom/ProfileSidebar";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setUpdateSuccess(false);

    try {
      if (avatarFile) {
        await dispatch(uploadUserAvatar(avatarFile)).unwrap();
      }

      await dispatch(updateUserProfile(formData)).unwrap();

      setUpdateSuccess(true);
      setAvatarFile(null);
      setAvatarPreview(null);

      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const displayAvatar = avatarPreview || user?.avatar;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProfileSidebar activePage="profile" user={user} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold mb-8">Profile</h1>

              {isLoading && !user ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C12116]" />
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {displayAvatar ? (
                          <img
                            src={displayAvatar}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 bg-[#C12116] text-white rounded-full p-2 hover:bg-[#a01812] transition-colors"
                      >
                        <Camera size={16} />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {updateSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      Profile updated successfully!
                    </div>
                  )}

                  <div className="max-w-xl mx-auto space-y-6">
                    <div className="flex items-center justify-between py-4 border-b">
                      <label className="text-gray-600 font-medium">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="text-right font-semibold focus:outline-none bg-transparent"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <label className="text-gray-600 font-medium">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="text-right font-semibold focus:outline-none bg-transparent"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <label className="text-gray-600 font-medium">
                        Nomor Handphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="text-right font-semibold focus:outline-none bg-transparent"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="pt-6">
                      <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="w-full h-12 bg-[#C12116] hover:bg-[#a01812] rounded-2xl text-base font-bold"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
