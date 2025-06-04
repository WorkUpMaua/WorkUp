import express from 'express';
import { router } from './shared/server/router';


const app = express();
app.use(express.json());
app.use(router);
