import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.PORT,"hgg");


const configKeys={
    MONGODB_URI:process.env.MONGODB_URI as string,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET as string,
    CLIENT_URL:process.env.CLIENT_URL,
    SERVER_EMAIL:process.env.USER,
    SERVER_PASS:process.env.PASS

}

export default configKeys