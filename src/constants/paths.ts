export const BLANK_PATHS = {
  login: "/user/login",
  signup: "/user/signup",
  socialSignup: "/user/signup/social",
  resetPrefix: "/user/reset",
};

export const isBlankPath = (pathname: string) => {
  return Object.values(BLANK_PATHS).some((path) => pathname.startsWith(path));
};
