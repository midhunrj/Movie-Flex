// import { useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';

// const usePreviousPath = () => {
//     const location = useLocation();  // Get current route location
//     const previousPathRef = useRef(null);  // Reference to store previous path
    
//     useEffect(() => {
//         // Store the current path as the previous path when the location changes (during unmount)
//         const currentPath = location.pathname;

//         // Update previousPathRef in cleanup to get the previous value before location changes
//         return () => {
//             previousPathRef.current = currentPath;
//         };
//     }, [location]);
//    console.log(previousPathRef,"previous path ref");
   
//     return previousPathRef.current;  // Return the previous path
// };

// export default usePreviousPath;


// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { setPreviousPath,getPreviousPath } from './previousPathUtil'

// const usePreviousPath = () => {
//   const location = useLocation();  // Get the current location (path)

//   useEffect(() => {
//     console.log("Current Path:", location.pathname);
//     console.log("Previous Path Before Updating:", getPreviousPath());

//     // Update the previous path with the current one
//     setPreviousPath(location.pathname);

//     console.log("Previous Path After Updating:", getPreviousPath());
//   }, [location]);

//   return getPreviousPath();  // Return the previous path stored globally
// };

// export default usePreviousPath;
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePreviousPath = () => {
  const location = useLocation();
  const previousPathRef = useRef<string|null>(null); 

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Update the previous path only after rendering with the new path
    previousPathRef.current = currentPath;
  }, [location.pathname]); // Effect runs when the path changes

  // Return the previous path (before the update)
  return previousPathRef.current;
};

export default usePreviousPath;

