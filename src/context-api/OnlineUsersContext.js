// OnlineUsersContext.js
import { createContext, useContext } from 'react';
export const OnlineUsersContext = createContext({});
export const useOnlineUsers = () => useContext(OnlineUsersContext);


export const ProfileImageChangedContext = createContext({
  profileImageChanged: false,
  setProfileImageChanged: () => {},
});

export const useProfileImageChanged = () => useContext(ProfileImageChangedContext);