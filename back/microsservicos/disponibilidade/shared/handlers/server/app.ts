import express from "express";
import { router } from "./router";
import cors from "cors";
import path from "path";

export class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
        this.server.use(cors());
        this.server.use(
            "/uploads",
            express.static(path.join(__dirname, '..', '..', '..', '..', 'uploads'))
        );
    }

    private router() {
        this.server.use(router);
    }
}
