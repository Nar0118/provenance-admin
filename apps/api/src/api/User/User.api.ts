import { Router } from 'express';
import {
  requireAuth,
  requireAuthAdmin,
} from '../../middleware/auth.middleware';
import {
  getAllUsers,
  updateCurrentUser,
  deleteUser,
  signup,
  login,
  changePassword,
  getCurrentUser,
  updateUserById,
  updateEventById,
  createUser,
  logout,
  signupByGoogle,
  checkVerificationCode,
  loginByGoogle,
  twitter,
  loginForAdmin,
  twitterCallback,
  sendRecoverPasswordEmail,
  updateForgottenPassword,
} from './User.api.handlers';

const router = Router();

router.get('/admin', requireAuthAdmin, getAllUsers);
router.get('/me', requireAuth, getCurrentUser);
router.post('/recover-password', sendRecoverPasswordEmail);
router.post('/admin', requireAuthAdmin, createUser);
router.post('/logout', requireAuth, logout);
router.put('/update', requireAuth, updateCurrentUser);
router.put('/admin/update-user/:id', requireAuthAdmin, updateUserById);
router.put('/admin/update-event/:id', requireAuthAdmin, updateEventById);
router.delete('/admin/:id', requireAuthAdmin, deleteUser);
router.post('/signup', signup);
router.post('/login/admin', loginForAdmin);
router.post('/check-mail', checkVerificationCode);
router.post('/createUser', requireAuthAdmin, createUser);
router.post('/login', login);
router.post('/signup/google', signupByGoogle);
router.get('/login/twitter', twitter);
router.get('/twitter/callback', twitterCallback);
router.put('/update-forgotten-password', updateForgottenPassword);
router.post('/login/google', loginByGoogle);
router.put('/change-password', requireAuth, changePassword);

export default router;
