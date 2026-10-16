/**
 * Email validation helper (used by controllers and Mongoose validators).
 */
const EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const value = email.trim();
  return value.length > 0 && value.length <= 254 && EMAIL_REGEX.test(value);
};

export default isValidEmail;
