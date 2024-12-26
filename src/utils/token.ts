// 3rd party
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    return Date.now() / 1000 > exp;
  } catch (e) {
    return true;
  }
};
