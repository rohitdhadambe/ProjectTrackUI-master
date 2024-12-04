import { useState, useEffect } from 'react';
import ProfilePng from '../../../assets/Profile.png';
import NotificationPng from '../../../assets/notification-ring.png';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext"; // Assuming you are using an AuthContext

export default function NavBar() {
  const { user } = useAuth(); // Get the user from the AuthContext
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.UniqeID) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/api/chat/messages", {
            params: { receiver_id: user.UniqeID }, // Using the logged-in user's ID
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
  }, [user]);

  return (
    <div className="fixed top-[140px] right-4 flex gap-5 z-50">
      <a href="/investigator/notification" className="relative">
        <img
          src={NotificationPng}
          alt="Notification"
          className="w-10 h-10 border-2 border-purple-500 rounded-full hover:opacity-80 transition duration-300"
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span> // Red dot on notification
        )}
      </a>
      <a href="/investigator/profile">
        <img
          src={ProfilePng}
          alt="Profile"
          className="w-10 h-10 border-2 border-purple-500 rounded-full hover:opacity-80 transition duration-300"
        />
      </a>
    </div>
  );
}
