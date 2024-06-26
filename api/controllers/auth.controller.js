const bcryptjs = require('bcryptjs')
const User = require('../models/user.model.js')
const errorHandler = require('../utils/errorHandler.js')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail.js')
const {validPassword, validUsername, validEmail} = require('../utils/validation.js')

const registerController = async (req, res, next) => {
    const { username, password, email } = req.body;

    if (!validUsername(username)) {
        next(errorHandler(400, "Username must be at most 20 characters long, and not contain spaces or special characters."));
        return
    }
    if (!validPassword(password)) {
        next(errorHandler(400, "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>)."));
        return
    }
    if (!validEmail(email)) {
        next(errorHandler(400, "Email is not in a valid format."));
        return
    }

    try {
        const email_token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const newUser = new User({
            username,
            email,
            password: bcryptjs.hashSync(password, 10),
        })
        await newUser.save();
        const sendEmailRes = await sendEmail(email, email_token, 'verify');
        if (sendEmailRes) {
            return res.status(201).json({message: 'Register successed, please verify your email'});
        }
    } catch (e) {
        next(e);
    }
}

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password.length === 0) {
        next(errorHandler(400, "Password cannot be empty."));
        return;
    }
    if (!email || email.length === 0) {
        next(errorHandler(400, "Email cannot be empty."));
        return;
    }
    try {
        const currUser = await User.findOne({ email });
        if (!currUser) {
            next(errorHandler(404, "Invalid email or password."));
            return
        }
        if(currUser.activate === false) {
            next(errorHandler(403, "Please verify your email first"));
            return
        }
        const validPassword = bcryptjs.compareSync(password, currUser.password);
        if (!validPassword) {
            next(errorHandler(404, "Invalid email or password."));
            return;
        }
        const token = jwt.sign({id: currUser._id, isAdmin: currUser.isAdmin}, process.env.JWT_SECRET_KEY);
        const { password: hashedPassword, ...withOutPassword } = currUser._doc;
        res
        .status(200)
        .cookie('access_token', token, {
            httpOnly: true,
        })
        .json(withOutPassword)
    } catch(e) {
        next(e);
    }

}

const emailVerifyController = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            next(errorHandler(400, "Invalid verification token."));
            return;
        }
        const decodedEmail = jwt.verify(token, process.env.JWT_SECRET_KEY).email;
        const user = await User.findOne({ email: decodedEmail });
        if (!user) {
            next(errorHandler(400, "Invalid verification token."));
            return;
        }
        // Activate email
        if (user.activate === true) {
            next(errorHandler(409, "This email has already been verified."));
            return;
        }
        user.activate = true;
        await user.save();
        res.status(200).json({ message: 'Your email was verified, you can now login to your account.' });
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            next(errorHandler(400, "Your verification session has expired."));
            return;
        }
        next(errorHandler(500, "Server error during verification."));
        return;
    }
}

const passwordResetController = async (req, res, next) => {
    try {
        const { token, password  } = req.body;
        const decodedEmail = jwt.verify(token, process.env.JWT_SECRET_KEY).email;
        const currUser = await User.findOne({ email: decodedEmail });
        if (!currUser) {
            next(errorHandler(404, "You haven't registered yet."));
            return;
        }
        currUser.password = bcryptjs.hashSync(password, 10);
        currUser.save();
        res.status(200).json({ message: 'Your password has been reset. You can now log in.' });
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            next(errorHandler(400, "Your session has expired. Please try again"));
            return;
        }
        next(errorHandler(500, "Server error during password setting."));
        return;
    }
}

const resetRequestController = async (req, res, next) => {
    try {
        const { email } = req.body;
        const currUser = await User.findOne({ email: email });
        if (!currUser) {
            next(errorHandler(404, "You haven't registered yet."));
            return;
        }
        if(currUser.activate === false) {
            next(errorHandler(403, "Please verify your email first"));
            return
        }
        const email_token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const sendEmailRes = await sendEmail(email, email_token, 'reset');
        if (sendEmailRes) {
            res.status(200).json({ message: 'Reset link send, please check your email' });
        }
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            next(errorHandler(400, "Your verification token has expired."));
            return;
        }
        next(errorHandler(500, "Server error during verification."));
        return;
    }
}

const resendEmailController = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decodedEmail = jwt.verify(token, process.env.JWT_SECRET_KEY).email;
        const user = await User.findOne({ email: decodedEmail });
        if (!user) {
            next(errorHandler(400, "Invalid verification token"));
            return;
        }
        const email_token = jwt.sign({ decodedEmail }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        const sendEmailRes = await sendEmail(decodedEmail, email_token, 'verify');
        if (sendEmailRes) {
            res.status(201).json({message: 'Verified email sent'});
        }
    } catch (e) {
        next(errorHandler(500, "Server error during resend email."));
        return;
    }
}

const googleController = async (req, res, next) => {
    const { email, name, photoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:name.split(" ").join(""),
          email,
          password: hashedPassword,
          photoUrl,
          activate: true
        });
        await newUser.save();
        const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET_KEY);
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (e) {
        next(e);
    }
};

const logoutController = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('You have successfully logged out.')
    } catch (e) {
        next(e)
    }
}

module.exports = {
    registerController,
    loginController,
    emailVerifyController,
    resetRequestController,
    passwordResetController,
    resendEmailController,
    googleController,
    logoutController
}