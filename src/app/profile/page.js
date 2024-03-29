'use client';

// pages/profile.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found.');
        }

        // Make API call to fetch user profile with the token
        const response = await fetch('http://localhost:8080/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Parse profile data from response
          const data = await response.json();
          setProfileData(data.data);
        } else {
          // Handle error response
          throw new Error('Failed to fetch profile data.');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found.');
      }

      // Make API call to upload avatar with the token
      const response = await fetch('http://localhost:8080/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Redirect back to profile page
        router.push('/profile');
      } else {
        // Handle upload error
        throw new Error('Avatar upload failed.');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setError('Avatar upload failed.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error fetching profile: {error}</p>;
  }

  if (!profileData) {
    // Handle case when profile data is empty
    return <p>No profile data available.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Profile information display */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Profile Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="flex justify-between sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img src={"http://localhost:8080/" + profileData.avatar.replace('public/', '')} alt="Avatar" className="h-10 w-10 rounded-full" />
                </dd>
              </div>
              <div className="flex justify-between sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.name}</dd>
              </div>
              <div className="flex justify-between sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.email}</dd>
              </div>
              <div className="flex justify-between sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profileData.phone}</dd>
              </div>
              {/* Add more profile data fields as needed */}
            </dl>
          </div>
        </div>
        {/* Avatar upload form */}
        <div className="mt-8">
          <form encType="multipart/form-data" onSubmit={handleAvatarUpload}>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Upload Avatar
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="mr-2"
                onChange={handleAvatarChange}
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
