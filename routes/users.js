const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const { updateUserData, getAllUsers, getUserById, deleteUser } = require("../controllers/userController");


router.put("/:id", verifyTokenAndAuthorization, updateUserData)

router.get("/", verifyTokenAndAdmin, getAllUsers);

router.get("/:id", verifyTokenAndAuthorization, getUserById);

router.delete("/:id", verifyTokenAndAuthorization, deleteUser);

module.exports = router;