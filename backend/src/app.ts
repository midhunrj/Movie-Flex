import express, {Application} from 'express';
import connectDB from './infrastructure/database/connection';
import expressConfig from './presentation/express/express';
import serverConfig from './presentation/webserver/server';
import http, { Server } from 'http';

const app:Application = express(); // Explicitly define the type for the app

connectDB(); // Connect to the database

const server: Server = http.createServer(app); // Explicitly define the server type

expressConfig(app); // Configure Express
serverConfig(server).startServer(); // Start the server
