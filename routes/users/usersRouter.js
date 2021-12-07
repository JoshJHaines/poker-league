var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const {
	checkIsEmpty,
	checkIsUndefined,
	validateCreateData,
	validateLoginData,
} = require("./lib/authMiddleware");

const {
	createUser,
	getAllUser,
	deleteUserById,
	login,
} = require("./controller/userController");
/* GET users listing. */

router.get("/", getAllUser);

router.post(
	"/create-user",
	checkIsUndefined,
	checkIsEmpty,
	validateCreateData,
	createUser
);
router.post("/login", checkIsUndefined, checkIsEmpty, validateLoginData, login);

router.post("/profile", function (req, res) {
	try {
		let decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET);

		res.json({ token: decodedToken });
	} catch (e) {
		res.status(500).json({ message: "error", error: e.message });
	}
});

router.delete("/delete-user-by-id/:id", deleteUserById);

module.exports = router;
