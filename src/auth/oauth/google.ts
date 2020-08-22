import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { pgPool, User } from "../../db";
import { auth } from "../../config";

const { google } = auth;

interface Name {
  familyName: string;
  givenName: string;
}
interface Email {
  value: string;
  verified: boolean;
}

interface Photo {
  value: string;
}

interface GoogleProfile extends Profile {
  id: string;
  displayName: string;
  name: Name;
  emails: Email[];
  photos: Photo[];
}

const handleUserIsAuthed = (profile: GoogleProfile, user: User) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        rows: [{ google_id: currentLinkedAccount }],
      } = await pgPool.query(
        "SELECT google_id FROM users.profile_google WHERE user_id = $1",
        [user.id]
      );

      if (currentLinkedAccount !== profile.id) {
        new Error("There is already a linked Google Account");
      }

      await pgPool.query(
        "INSERT INTO users.profile_google(user_id, google_id) VALUES ($1, $2) ON CONFLICT (user_id, google_id) DO NOTHING",
        [user.id, profile.id]
      );

      resolve(user);
    } catch (err) {
      return reject(err);
    }
  });

const handleAnonymousUser = (profile: GoogleProfile) =>
  new Promise(async (resolve, reject) => {
    try {
      const email = profile.emails.filter((email) => email.verified)[0]?.value;

      let {
        rows: [user],
      } = await pgPool.query(
        "SELECT user_id AS id FROM users.profile_google WHERE google_id = $1",
        [profile.id]
      );

      if (!user) {
        const {
          rows: [{ exists: emailExists }],
        } = await pgPool.query(
          "SELECT EXISTS (SELECT email FROM users.profile WHERE email = $1::citext)",
          [email]
        );

        if (emailExists) {
          throw new Error(
            "There's already an account using this email address"
          );
        }

        const {
          rows: [newUser],
        } = await pgPool.query(
          "INSERT INTO users.profile (user_name, first_name, last_name, picture, email) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [
            profile.name.givenName,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos[0]?.value,
            email,
          ]
        );

        await pgPool.query(
          "INSERT INTO users.profile_google (user_id, google_id) VALUES ($1, $2)",
          [newUser.id, profile.id]
        );

        user = newUser;
      }

      resolve(user);
    } catch (err) {
      reject(err);
    }
  });

const handleGoogleProfile = (
  req: Request,
  token: string,
  refreshToken: string,
  profile: Profile,
  done: any
) => {
  if (req.user) {
    const user = req.user as User;
    handleUserIsAuthed(<GoogleProfile>profile, user)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  } else {
    handleAnonymousUser(<GoogleProfile>profile)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  }
};

passport.use(new GoogleStrategy(google, handleGoogleProfile));
