import React, { useEffect, useState } from 'react';
import MinistryLogos from '../../Common/MinistryLogos';
import ProfilePng from '../../../assets/Profile.png';
import { useAuth } from '../../context/AuthContext';

const InvestigatorProfile = () => {
  const { user, token } = useAuth(); // Assuming `useAuth` provides user info and auth token
  const [investigator, setInvestigator] = useState({
    image: ProfilePng,
    investigator_name: '',
    email: '',
    phone_no: '',
    account_number: '',
    designation: '',
    experience: '',
    dob: '',
    address: '',
    department: '',
    authority: '',
    security_clearance: '',
    highest_qualification: '',
    identification: '',
    username: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestigator((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (user && user.ID) {
      fetch(`http://127.0.0.1:5000/api/investigator/${user.ID}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch investigator data');
          return response.json();
        })
        .then((data) => {
          setInvestigator({
            ...investigator,
            ...data,
            dob: new Date(data.dob).toISOString().split('T')[0],
          });
        })
        .catch((error) => console.error('Error fetching investigator data:', error));
    }
  }, [user, token]);

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:5000/api/investigator/${user.ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Ensure token is included for authentication
      },
      body: JSON.stringify(investigator),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`Update failed with status: ${response.status}`);
          return response.json().then((error) => {
            throw new Error(error.message || 'Failed to update profile');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Profile updated successfully:', data);
        alert('Profile updated successfully!');
        setIsEditing(false); // Exit editing mode after successful update
      })
      .catch((error) => {
        console.error('Error during PUT request:', error.message);
        alert(`Update failed: ${error.message}`);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between shadow-md">
        <MinistryLogos />
      </div>
      <div className="font-bold text-xl mt-48 ml-32">
        <a href="/admin" className="text-purple-700 hover:text-purple-900">
          ◁ Home
        </a>
      </div>
      <div className="flex flex-col items-center mt-16 p-8">
        <div className="flex items-center justify-center space-x-6 mb-8">
          <img
            src={investigator.image}
            alt="Investigator"
            className="w-32 h-32 rounded-full border-4 border-purple-700 shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-700">{investigator.investigator_name}</h1>
            <h2 className="text-xl text-gray-600">{investigator.designation}</h2>
          </div>
        </div>
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.keys(investigator).map((key) =>
                key !== 'image' ? (
                  <div key={key}>
                    <p className="text-gray-700 font-semibold capitalize">{key.replace(/_/g, ' ')}</p>
                    <input
                      type={key === 'password' ? 'password' : 'text'}
                      name={key}
                      value={investigator[key]}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ) : null
              )}
            </div>
            <div className="mt-8">
              {isEditing ? (
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-6 py-2 rounded-md shadow-md"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-700 text-white px-6 py-2 rounded-md shadow-md"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvestigatorProfile;
