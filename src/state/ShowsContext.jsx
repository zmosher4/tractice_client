import { createContext, useContext, useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

const ShowsContext = createContext();

export const useShows = () => useContext(ShowsContext);

export const ShowsProvider = ({ children }) => {
  const [myShows, setMyShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyShows = async () => {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) {
      setLoading(false);
      return;
    }

    const data = await getShows();
    const userId = JSON.parse(tokenData).id;
    const filteredShows = data.filter((show) => show.user.id === userId);
    setMyShows(filteredShows);
    setLoading(false);
  };

  useEffect(() => {
    getMyShows();
  }, []);

  return (
    <ShowsContext.Provider value={{ myShows, setMyShows, getMyShows, loading }}>
      {children}
    </ShowsContext.Provider>
  );
};
