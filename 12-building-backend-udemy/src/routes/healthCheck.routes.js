import express from "express";
import healthCheck from "../config/healthCheck.controller.js";

const router = express.Router();

router.get('/',healthCheck);

export default router;