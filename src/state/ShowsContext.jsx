import { createContext, useContext, useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

const ShowsContext = createContext();

export const useShows = () => useContext(ShowsContext);

export const ShowsProvider = ({ children }) => {
  const [myShows, setMyShows] = useState([]);

  const getMyShows = async () => {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) {
      return;
    }

    const data = await getShows();
    const userId = JSON.parse(tokenData).id;
    const filteredShows = data.filter((show) => show.user.id === userId);
    setMyShows(filteredShows);
  };

  useEffect(() => {
    getMyShows();
  }, []);

  return (
    <ShowsContext.Provider value={{ myShows, setMyShows, getMyShows }}>
      {children}
    </ShowsContext.Provider>
  );
};
