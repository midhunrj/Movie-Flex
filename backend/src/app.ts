import express, {Application} from 'express';
import connectDB from './infrastructure/database/connection';
import expressConfig from './presentation/express/express';
import serverConfig from './presentation/webserver/server';
import http, { Server } from 'http';

const app:Application = express(); 

connectDB(); 

const server: Server = http.createServer(app); 

expressConfig(app); 
serverConfig(server).startServer(); 
