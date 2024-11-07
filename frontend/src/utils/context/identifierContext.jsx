// import React, { createContext, useState, useContext } from 'react';

// // Create the context
// const IdentifierContext = createContext();

// // Provider component to wrap around the app or relevant parts
// export const IdentifierProvider = ({ children }) => {
//     const [lastIdentifier, setLastIdentifier] = useState("A");

//     // Function to get the next identifier and update the last identifier
//     const getNextIdentifier = () => {
//         const nextIdentifier = String.fromCharCode(lastIdentifier.charCodeAt(0) + 1);
//         setLastIdentifier(nextIdentifier);
//         return nextIdentifier;
//     };

//     // Function to set lastIdentifier manually (used when a tier finishes)
//     const setIdentifier = (identifier) => setLastIdentifier(identifier);

//     // Value to provide to context consumers
//     const value = {
//         lastIdentifier,
//         getNextIdentifier,
//         setIdentifier,
//     };

//     return (
//         <IdentifierContext.Provider value={value}>
//             {children}
//         </IdentifierContext.Provider>
//     );
// };

// // Custom hook for convenience
// export const useIdentifier = () => useContext(IdentifierContext);

import React, { createContext, useState, useContext } from 'react';

// Create a context with a default value
const LastIdentifierContext = createContext(null);

// Custom hook to access the context easily
export const useLastIdentifier = () => useContext(LastIdentifierContext);

// Context Provider component
export const IdentifierProvider = ({ children }) => {
  const [lastIdentifier, setLastIdentifier] = useState(null);

  // Function to update lastIdentifier
  const updateLastIdentifier = (newIdentifier) => {
    setLastIdentifier(newIdentifier);
  };

  return (
    <LastIdentifierContext.Provider value={{ lastIdentifier, updateLastIdentifier }}>
      {children}
    </LastIdentifierContext.Provider>
  );
};

