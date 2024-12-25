export interface User {
  id: number;
  email: string;
  username: string;
  name?: {
    firstname: string,
    lastname: string
  }
}
