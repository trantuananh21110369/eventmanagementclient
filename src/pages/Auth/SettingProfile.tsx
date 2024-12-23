import React, { useState, useEffect } from 'react';
import { toastNotify, inputHepler } from 'Helper';
import { useSelector } from 'react-redux';
import { RootState } from 'Storage/Redux/store';
import { useSettingProfileMutation, useGetProfileQuery } from 'Apis/authApi';
import { Button } from '@headlessui/react';

const SettingProfile = () => {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [profile, setProfile] = useState({
    fullname: '',
    email: ''
  });
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [settingProfile] = useSettingProfileMutation();
  const { data } = useGetProfileQuery(userId!);

  useEffect(() => {
    if (data) {
      const tempData = {
        fullname: data.result.fullName || '',
        email: data.result.email || '',
      }
      setProfile(tempData);
      setImageToDisplay(data.result.urlImage || "");
    }
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHepler(e, profile);
    setProfile(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File must be less than 1 MB", "error");
        return;
      } else if (!validImgTypes.includes(imgType)) {
        setImageToStore("");
        toastNotify("File must be in jpeg, jpg, or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (profile.fullname.trim() === "") {
      toastNotify("Full name is required", "error");
      return;
    }

    setLoading(true);
    if (!imageToStore && !userId) {
      toastNotify("Please upload an image", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", profile.fullname);
    if (imageToStore) formData.append("File", imageToStore);

    try {
      const response = await settingProfile({ profile: formData, userId: userId }).unwrap();
      if (response.isSuccess) {
        toastNotify("Profile updated successfully", "success");
      } else {
        toastNotify("Profile update failed: " + (response?.message || "Unknown error"), "error");
      }
    } catch (err: any) {
      if (err.status === 403) {
        toastNotify("You are not authorized to perform this action", "error");
      }
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-screen bg-white py-8 px-4"
    >
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 w-full max-w-lg">
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-orange-500 mb-2">Profile Image</label>
          {imageToDisplay && (
            <img
              src={imageToDisplay}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-orange-500"
            />
          )}
          <Button
            as="label"
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Your Email</label>
          <input
            type="text"
            name="email"
            value={profile.email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={profile.fullname}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
};

export default SettingProfile;
