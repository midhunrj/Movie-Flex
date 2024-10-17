import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class FileUploadService {
    private uploadDirectory = path.join(__dirname, '../../../../frontend/public/uploads');

    constructor() {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(this.uploadDirectory)) {
            fs.mkdirSync(this.uploadDirectory, { recursive: true });
        }
    }

    saveFile(file: Express.Multer.File): string {
        // console.log("jfjsjj","before file upload");
        // const filePath = path.join(this.uploadDirectory, file.originalname);
        // fs.writeFileSync(filePath, file.buffer); // Save the file
        // console.log("jfjsjj","after file upload",this.uploadDirectory);
        
        // return file.originalname; // Return the path to the file
        const uniqueSuffix = uuidv4(); // or use Date.now() for timestamp-based uniqueness
        const fileExtension = path.extname(file.originalname);
        const fileNameWithoutExtension = path.basename(file.originalname, fileExtension);
        const uniqueFileName = `${fileNameWithoutExtension}-${uniqueSuffix}${fileExtension}`;

        const filePath = path.join(this.uploadDirectory, uniqueFileName);
        fs.writeFileSync(filePath, file.buffer); // Save the file

        console.log("After file upload", this.uploadDirectory);

        return uniqueFileName; 
    }
}
