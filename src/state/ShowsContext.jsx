import { createContext, useContext, useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

const ShowsContext = createContext();

export const useShows = () => useContext(ShowsContext);

export const ShowsProvider = ({ children }) => {
  const [myShows, setMyShows] = useState([]);

  const getMyShows = async () => {
    const data = await getShows();
    const filteredShows = data.filter(
      (show) => show.user.id === JSON.parse(localStorage.getItem('token')).id
    );
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
