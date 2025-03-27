import { createContext, useContext, useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

//create show context
const ShowsContext = createContext();

//custom hook using the shows context
export const useShows = () => useContext(ShowsContext);

export const ShowsProvider = ({ children }) => {
  const [myShows, setMyShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyShows = async () => {
    //get user data
    const tokenData = localStorage.getItem('token');
    //if no user data, return early and don't set show state
    if (!tokenData) {
      setLoading(false);
      return;
    }

    //get all shows then filter which shows belong to the logged in user
    const data = await getShows();
    const userId = JSON.parse(tokenData).id;
    const filteredShows = data.filter((show) => show.user.id === userId);
    setMyShows(filteredShows);
    setLoading(false);
  };

  //get and set shows on initial render
  useEffect(() => {
    getMyShows();
  }, []);

  //wrap the show context provider in the children, in this case is the entire app - see application views file
  return (
    <ShowsContext.Provider value={{ myShows, setMyShows, getMyShows, loading }}>
      {children}
    </ShowsContext.Provider>
  );
};
