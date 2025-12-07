import { createContext } from 'react';

// Create a Context to share the search state
export const CalendarContext = createContext({
    searchText: '',
    setSearchText: () => {}
});