const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../model/User");
const errorHandler = require("../../utils/errorHandler/errorHandler");

async function createUser(req, res) {
	const { firstName, lastName, username, email, password } = req.body;

	try {
		let salt = await bcrypt.genSalt(10);
		let hashedPassword = await bcrypt.hash(password, salt);

		const createdUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
		});

		let savedUser = await createdUser.save();

		res.json({ message: "success", payload: savedUser });
	} catch (error) {
		res.status(500).json({ message: "error", error: errorHandler(error) });
	}
}

//not in class
async function login(req, res) {
	const { email, password } = req.body;
	//log the user in using email and password
	//if email does not exists, error message "please go sign up"
	//if email exists but wrong password error message "please check your email and password"
	//if successful - for now send message "Login success"

	try {
		let foundUser = await User.findOne({ email: email });
		if (!foundUser) {
			return res.status(500).json({
				message: "error",
				error: "please go sign up",
			});
		} else {
			let comparedPassword = await bcrypt.compare(
				password,
				foundUser.password
			);

			if (!comparedPassword) {
				return res.status(500).json({
					message: "error",
					error: "Please check your email and password",
				});
			} else {
				let jwtToken = jwt.sign(
					{
						email: foundUser.email,
						username: foundUser.username,
					},
					process.env.JWT_SECRET,
					{ expiresIn: "24h" }
				);

				res.json({ message: "success", payload: jwtToken });
			}
		}
	} catch (e) {
		res.status(500).json({ message: "error", error: e.message });
	}
}

async function getAllUser(req, res) {
	try {
		let fetchedUser = await User.find({});

		res.json({ message: "success", payload: fetchedUser });
	} catch (error) {
		res.status(500).json({
			message: "you have failed",
			error: error.message,
		});
	}
}
async function deleteUserById(req, res) {
	try {
		let deletedUser = await User.findByIdAndDelete(req.params.id);

		res.json({ message: "success", payload: deletedUser });
	} catch (error) {
		res.status(500).json({
			message: "you have failed",
			error: error.message,
		});
	}
}

module.exports = {
	getAllUser,
	createUser,
	deleteUserById,
	login,
};
