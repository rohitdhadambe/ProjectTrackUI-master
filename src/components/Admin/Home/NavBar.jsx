import { useState, useEffect } from 'react';
import ProfilePng from '../../../assets/Profile.png';
import NotificationPng from '../../../assets/notification-ring.png';
import axios from 'axios';

export default function NavBar() {
  const [adminId, setAdminId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/admin');
        const data = await response.json();
        if (data && data.length > 0) {
          const loggedInAdmin = data[0]; // Assuming the first admin in the response
          setAdminId(loggedInAdmin.admin_id); // Get the admin ID
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    if (adminId) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/api/chat/messages", {
            params: { receiver_id: adminId }, // Using the logged-in admin's ID
          });
          const messages = response.data?.messages || [];
          const unreadMessages = messages.filter((msg) => !msg.is_read); // Assuming 'is_read' indicates if the message is read
          setUnreadCount(unreadMessages.length);
        } catch (error) {
          console.error('Error fetching unread notifications:', error);
        }
      };

      fetchUnreadCount();
    }
  }, [adminId]);

  return (
    <div className="fixed top-[140px] right-4 flex gap-5 z-50">
      <a href="/admin/notification" className="relative">
        <img
          src={NotificationPng}
          alt="Notification"
          className="w-10 h-10 border-2 border-purple-500 rounded-full hover:opacity-80 transition duration-300"
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span> // Red dot on notification
        )}
      </a>
      {adminId && (
        <a href={`/admin/profile/${adminId}`}>
          <img
            src={ProfilePng}
            alt="Profile"
            className="w-10 h-10 border-2 border-purple-500 rounded-full hover:opacity-80 transition duration-300"
          />
        </a>
      )}
    </div>
  );
}
