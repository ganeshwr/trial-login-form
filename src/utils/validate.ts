// Helper & misc
import { ValidateEmail } from "../types/ValidateEmail";

export const validateEmail = (email: string): ValidateEmail => {
  if (email.length < 1) return { rule: "required", valid: false };

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return { rule: "pattern", valid: emailPattern.test(email) };
};

export const validatePassword = (password: string): boolean => {
  return password.length > 0;
};
