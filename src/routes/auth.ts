import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// TODO save return to in session
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
