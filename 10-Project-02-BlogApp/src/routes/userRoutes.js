import express from "express";
import getAllUsers from "../controllers/getAllUsers.js";
import getUserById from "../controllers/getUserById.js";
import updateUser from "../controllers/updateUser.js";
import createUser from "../controllers/createUser.js";
import deleteUser from "../controllers/deleteUser.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id",getUserById);
router.patch("/:id",updateUser);
router.post('/',createUser);
router.delete('/:id',deleteUser);


export default router;