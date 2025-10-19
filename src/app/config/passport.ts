import passport, { Profile } from 'passport'
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import config from '.';
import { UserModel } from '../modules/user/user.model';
import { userRole } from '../modules/user/user.const';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: 'No Email Found' });
        }

        let user = await UserModel.findOne({ email });

        const authDetails = {
          provider: 'Google',
          providerId: profile.id,
        };

        if (!user) {
          user = await UserModel.create({
            email,
            name: profile.displayName,
            image: profile.photos?.[0].value,
            role: userRole.customer,
            auths: [authDetails],
          });
        } else {
           const isAlreadyLinked = user.auths.some(
             auth =>
               auth.provider === authDetails.provider &&
               auth.providerId === authDetails.providerId
           );

           if (!isAlreadyLinked) {
             user.auths.push(authDetails);
             await user.save(); 
           }
        }
        return done(null, user);
      } catch (error) {
        console.log('Google Strategy Error:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
