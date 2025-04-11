export const BLANK_PATHS = {
  login: "/user/login",
  signup: "/user/signup",
  socialSignup: "/user/signup/social",
  resetPrefix: "/user/help",
};

export const isBlankPath = (pathname: string) => {
  return Object.values(BLANK_PATHS).some((path) => pathname.startsWith(path));
};
