import { v4 as uuid } from "uuid";

export interface Entry {
  id: typeof uuid;
  service: string;
  user: string;
  password: string;
}
