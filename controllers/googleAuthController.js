import axios from 'axios';

import { googleOAuthService } from '../service/google-oauth-service.js';
import { tokenService } from '../service/token-service.js';

class GoogleAuthController {
  getGoogleOAuthUrl() {
    const oAuthServerEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const queryParams = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.API_URL}/api/user/auth/google`,
      response_type: 'code',
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      prompt: 'consent',
    };
    const qs = new URLSearchParams(queryParams);
    return `${oAuthServerEndpoint}?${qs.toString()}`;
  }

  async getGoogleUser(req, res, next) {
    try {
      
      const { code } = req.query;

      const { id_token, access_token } =
        await googleOAuthService.getGoogleTokens({
          code,
          // clientId: "1073086270333-c5h4tukvqvdtcd28cl6j8qvf9d7lnmfh.apps.googleusercontent.com",
          // clientSecret: "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",
          // redirectUri: `https://api-yummy.onrender.com/api/user/auth/google`,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          redirectUri: `${process.env.API_URL}/api/user/auth/google`,
        });
        const googleUser = await axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
          )
          .then((res) => res.data);
          console.log("googleUser:",googleUser);
      const tokens = tokenService.generateTokens(googleUser);
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      });
      await res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.log(`Не вдалося отримати данні користувача`);
      next(error);
      // throw new Error(error.message);
    }
  }

  async getCurentGoogleUser(req, res, next) {
    try {
      const cook = await req.cookie
      const refreshToken = await req.cookies['refreshToken'];
      console.log('RT:', cook);
      if (refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const email = await userData.email;
        const name = await userData.name;
        const user = await googleOAuthService.registration(
          email,
          name,
          refreshToken
        );
        const result = await res.json(user);
        console.log('USER:', result);
        return await res.json(user);
      }
    } catch (error) {
      next(error);
    }
  }
}

export const googleAuthController = new GoogleAuthController();
