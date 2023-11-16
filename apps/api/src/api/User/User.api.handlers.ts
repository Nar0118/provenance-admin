import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as googleAuth from 'google-auth-library';
import { User, UserRoles } from '../../models/User';
import { Event } from '../../models/Event';
import { MailOptions, sendEmail } from '../../util/email/email.util.nodemailer';
import env from '../../util/constants/env';
import {
  getOAuthAccessToken,
  getOAuthRequestToken,
  getProtectedResource,
} from '../lib/oauth-promise';
const googleClient = new googleAuth.OAuth2Client(env.clientId);

const SECRET_JWT_CODE = env.secretJwtCode;

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersCount = await User.collection.countDocuments();
    const users = await User.find({ role: UserRoles.BASIC }).sort({ id: -1 });

    return res.send({ users, count: usersCount });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const user = await User.create({
      email,
      userName: name,
      id: Date.now(),
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { startDate,endDate, title, location, iconUrl } = req.body;

    const data = await Event.create({
      iconUrl,
      id: Date.now(),
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      createdDate: Date.now(),
    });

    return res.json({ success: true, data: data });
  } catch (err) {
    res.status(400);
    res.send({ success: false, error: err });
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  try {
    const user = req['user'];

    return res.send(user);
  } catch (err) {
    res.send({ success: false, error: err });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const newUserData = req['body']['data'];
    const id = newUserData.id;

    const updatedUser = await User.findOneAndUpdate(
      { id },
      {
        bio: newUserData.bio,
        email: newUserData.email,
        fullName: newUserData.fullName,
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.deleteOne({ id: id });

    return res.send({ success: true });
  } catch (err) {
    res.status(404);
    res.send({ success: false, error: err });
  }
};

export const loginForAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      error: 'Submit all required parameters',
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.json({
        success: false,
        error: `Account with ${email} doesn't exist`,
      });
    }

    if (user.role !== UserRoles.ADMIN) {
      return res.json({
        success: false,
        error: 'Only admin can log in to the Admin dashboard',
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    user.password = undefined;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_JWT_CODE
    );

    return res.json({ success: true, userData: { token, user } });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req['user'];

    if (user) {
      req['user'] = null;
    }

    return res.json({ success: true, message: 'user logout successfully' });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.json({ success: false, error: 'Send needed params' });
  }

  try {
    const registeredUser = await User.findOne({ email }).select('+password');
    if (registeredUser) {
      return res.json({ success: false, error: 'You already have account' });
    }

    const user = await User.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      userName: name,
      role: UserRoles.BASIC,
      id: Date.now(),
    });

    const token = jwt.sign({ id: user._id, email: email }, SECRET_JWT_CODE);

    const mailOptions: MailOptions = {
      to: email,
      subject: 'You have successfully registered',
      text: 'Welcome to Provenance',
    };

    await sendEmail(mailOptions);

    return res.json({ success: true, token: token });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, error: 'Send needed params' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.json({
        success: false,
        error: `Account with this ${email} doesn't exist`,
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_JWT_CODE
    );

    return res.json({ success: true, token: token });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const signupByGoogle = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.send({
        success: false,
        error: 'Token is empty',
      });
    }

    const googleResponse = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.clientId,
    });

    const { name, email, picture } = googleResponse.getPayload();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({
        success: false,
        error: `${email} has already been registered`,
      });
    }

    const newUser = await User.create({
      email,
      authenticatedByGoogle: true,
    });

    const token = jwt.sign({ id: newUser._id, email }, SECRET_JWT_CODE);

    return res.json({ success: true, token });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const loginByGoogle = async (req: Request, res: Response) => {
  try {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.send({
        success: false,
        error: 'Token is empty',
      });
    }

    const googleResponse = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: env.clientId,
    });

    const { email } = googleResponse.getPayload();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id, email }, SECRET_JWT_CODE);

      return res.send({
        success: true,
        token,
      });
    }

    return res.send({
      success: false,
      error: `There is no account for ${email}`,
    });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const checkVerificationCode = async (req: Request, res: Response) => {
  try {
    const { emailVerificationCode, email } = req.body;
    const user = await User.findOne({
      email,
    });

    if (user.emailVerificationCode === emailVerificationCode) {
      return res.json({ success: true, user });
    } else {
      return res.json({
        success: false,
        message: 'Entered code is not correct, please try again',
      });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

const hashPassword = (
  password: string,
  saltRounds = 10
): Promise<{
  isUpdated: boolean;
  hashedPassword: string;
}> => {
  if (!password) {
    throw new Error('No password available in the instance');
  }

  return bcrypt.hash(password, saltRounds).then((hashedPassword) => {
    return {
      isUpdated: true,
      hashedPassword,
    };
  });
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const currentUser = req['user'];
    const { oldPassword, newPassword } = req.body;
    const dbUser = await User.findOne({ email: currentUser.email }).select(
      '+password'
    );

    const isSame = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isSame) {
      return res.json({ success: false, error: 'Wrong password' });
    }

    const newHash = await hashPassword(newPassword);
    dbUser.password = newHash.hashedPassword;
    await dbUser.save();

    dbUser.password = undefined;

    const mailOptions: MailOptions = {
      to: currentUser.email,
      subject: 'You have successfully changed your password!',
      text: 'Change Password Alert',
    };

    await sendEmail(mailOptions);

    return res.send({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await User.findOne({ id: id });

    if (!user) {
      return res.json({ success: false, error: 'User does not exist!' });
    }

    user.email = email;
    user.name = name;

    await user.save();
    return res.send({ success: true, data: user });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const updateEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, title, endDate, location, iconUrl } = req.body;

    const event = await Event.findOne({ id: id });

    if (!event) {
      return res.json({ success: false, error: 'Event does not exist!' });
    }

    event.startDate = startDate;
    event.title = title;
    event.endDate = endDate;
    event.location = location;
    event.iconUrl = iconUrl;

    await event.save();
    return res.send({ success: true, data: event });
  } catch (err) {
    res.json({ success: false, error: err });
  }
};

export const sendRecoverPasswordEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.send({
        success: false,
        error: 'Please send email',
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.send({
        success: false,
        error: `There is no user with ${email} email`,
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    user.emailVerificationCode = code;

    const mailOptions: MailOptions = {
      to: email,
      subject: 'Recover Password',
      html: `<div>
              <div>Change your password</div>
              <div>Your code - ${code}</div>
             </div>`,
    };

    await sendEmail(mailOptions);

    await user.save();

    return res.send({
      success: true,
      message: `It was successfully sent to ${email}`,
    });
  } catch (err) {
    res.json({
      success: false,
      error: 'Something went wrong, please try again',
    });
  }
};

export const twitter = async (req: Request, res: Response) => {
  try {
    const {
      oauthRequestToken,
      oauthRequestTokenSecret,
    } = await getOAuthRequestToken();
    req.session.oauthRequestToken = oauthRequestToken;
    req.session.oauthRequestTokenSecret = oauthRequestTokenSecret;
    const authorizationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthRequestToken}`;
    res.redirect(authorizationUrl);
  } catch (err) {
    res.end();
  }
};

export const twitterCallback = async (req: Request, res: Response) => {
  let response;
  try {
    const { oauthRequestToken, oauthRequestTokenSecret } = req.session;
    const { oauth_verifier: oauthVerifier } = req.query;
    const {
      oauthAccessToken,
      oauthAccessTokenSecret,
    } = await getOAuthAccessToken({
      oauthRequestToken,
      oauthRequestTokenSecret,
      oauthVerifier,
    });
    req.session.oauthAccessToken = oauthAccessToken;
    const { data } = await getProtectedResource(
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      'GET',
      oauthAccessToken,
      oauthAccessTokenSecret
    );
    const userData = JSON.parse(data);
    const userEmail = userData.email;
    const twitterId = userData.id_str;
    if (userEmail == '') {
      response = {
        success: false,
        error: 'User do not have email linked with Twitter',
      };
      return res.end();
    }
    const twitterConnectedUser = await User.findOne({ twitterId });
    const emailRegisteredUser = await User.findOne({ email: userEmail });
    if (emailRegisteredUser == null) {
      const user = await User.create({
        email: userEmail,
        twitterId: twitterId,
      });
      const token = jwt.sign(
        { id: user._id, email: userEmail },
        SECRET_JWT_CODE
      );
      response = { success: true, token: token };
      return res.end();
    } else if (twitterConnectedUser == null) {
      emailRegisteredUser.twitterId = twitterId;
      await emailRegisteredUser.save();
    }
    const token = jwt.sign(
      {
        id: emailRegisteredUser._id,
        email: emailRegisteredUser.email,
        role: emailRegisteredUser.role,
      },
      SECRET_JWT_CODE
    );
    response = { success: true, token: token };
    return res.end();
  } catch (err) {
    response = { success: false, error: err };
    return res.end();
  }
};

export const updateForgottenPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword, email } = req.body;

    if (!newPassword || !email) {
      return res.send({
        success: false,
        error: 'Send all necessary parameters',
      });
    }

    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user) {
      return res.send({
        success: false,
        error: 'Wrong token',
      });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.emailVerificationCode = null;

    await user.save();
    user.password = undefined;

    return res.send({
      success: true,
      message: 'Password successfully updated',
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
