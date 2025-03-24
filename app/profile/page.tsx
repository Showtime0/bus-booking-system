'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../components/ThemeProvider';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    currency: string;
    theme: 'light' | 'dark' | 'system';
  };
  travelPreferences: {
    seatType: 'any' | 'window' | 'aisle';
    busType: 'any' | 'ac' | 'non-ac';
    deck: 'any' | 'lower' | 'upper';
  };
}

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

const languages = [
  { code: 'english', name: 'English' },
  { code: 'hindi', name: 'हिंदी' },
  { code: 'kannada', name: 'ಕನ್ನಡ' },
  { code: 'tamil', name: 'தமிழ்' }
];

export default function ProfilePage() {
  const router = useRouter();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Main St, Bangalore, Karnataka',
    avatar: '👤',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      language: 'english',
      currency: 'INR',
      theme: currentTheme
    },
    travelPreferences: {
      seatType: 'window',
      busType: 'ac',
      deck: 'lower'
    }
  });

  const handleInputChange = (field: keyof Omit<UserProfile, 'preferences' | 'travelPreferences' | 'avatar'>, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleTravelPreferenceChange = (field: keyof UserProfile['travelPreferences'], value: any) => {
    setProfile(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        [field]: value
      }
    }));
  };

  const avatarOptions = ['👤', '👩', '👨', '👱‍♀️', '👱‍♂️', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲'];

  const handleSave = async () => {
    // Here you would typically make an API call to save the profile
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
          {/* Profile Header */}
          <div className="bg-red-600 dark:bg-red-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div 
                className="relative"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl cursor-pointer transition-transform hover:scale-105">
                  {profile.avatar}
                </div>
                {isEditing && avatarHover && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 grid grid-cols-7 gap-1">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => setProfile(prev => ({ ...prev, avatar }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-semibold">{profile.name}</h1>
                <p className="text-red-100">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                    <button
                      onClick={() => isEditing && handlePreferenceChange('emailNotifications', !profile.preferences.emailNotifications)}
                      disabled={!isEditing}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.preferences.emailNotifications ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                      } disabled:opacity-50`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Notifications</label>
                    <button
                      onClick={() => isEditing && handlePreferenceChange('smsNotifications', !profile.preferences.smsNotifications)}
                      disabled={!isEditing}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.preferences.smsNotifications ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                      } disabled:opacity-50`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                    <select
                      value={profile.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                    <select
                      value={profile.preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Travel Preferences */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pt-4">Travel Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Seat</label>
                    <select
                      value={profile.travelPreferences.seatType}
                      onChange={(e) => handleTravelPreferenceChange('seatType', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                      <option value="any">No Preference</option>
                      <option value="window">Window Seat</option>
                      <option value="aisle">Aisle Seat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bus Type</label>
                    <select
                      value={profile.travelPreferences.busType}
                      onChange={(e) => handleTravelPreferenceChange('busType', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                      <option value="any">No Preference</option>
                      <option value="ac">AC Bus</option>
                      <option value="non-ac">Non-AC Bus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deck Preference</label>
                    <select
                      value={profile.travelPreferences.deck}
                      onChange={(e) => handleTravelPreferenceChange('deck', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-red-500
                               disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400"
                    >
                      <option value="any">No Preference</option>
                      <option value="lower">Lower Deck</option>
                      <option value="upper">Upper Deck</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                             text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg 
                             hover:bg-red-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg 
                           hover:bg-red-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 