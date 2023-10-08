import { USER } from "@/types";

export function saveToLocalStore(users: USER[]) {
  const data = JSON.stringify(users);
  localStorage.setItem("user", data);
}
