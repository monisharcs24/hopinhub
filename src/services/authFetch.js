import { auth } from "../firebase";

export const authFetch = async (url, options = {}) => {
  const token = await auth.currentUser.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
