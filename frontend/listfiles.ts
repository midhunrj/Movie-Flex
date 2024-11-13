// const fs = require('fs');
// const path = require('path');

// function getAllFiles(dirPath, arrayOfFiles) {
//   const files = fs.readdirSync(dirPath);

//   arrayOfFiles = arrayOfFiles || [];

//   files.forEach(file => {
//     const filePath = path.join(dirPath, file);
//     if (fs.statSync(filePath).isDirectory()) {
//       arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
//     } else {
//       arrayOfFiles.push(filePath);
//     }
//   });

//   return arrayOfFiles;
// }

// const projectDir = './src'; // Update this path to your frontend folder
// const allFiles = getAllFiles(projectDir).filter(file => 
//   file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')
// );

// console.log('List of frontend files:', allFiles);
