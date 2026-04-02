export const TOKEN_KEY = "access_token";
export const USER_KEY = "user";
export const CURRENT_USER_KEY = "currentUser";

function toBodyIndex(user) {
  if (!user) return {};
  const gender =
    user.gender === "Nam" ? "male" : user.gender === "Nữ" ? "female" : "other";
  return {
    gender,
    age: user.age ?? "",
    updatedAt: new Date().toISOString(),
  };
}

export function persistAuth(accessToken, user) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    const bodyIndex = JSON.parse(localStorage.getItem("user_body_index") || "{}");
    localStorage.setItem(
      "user_body_index",
      JSON.stringify({ ...bodyIndex, ...toBodyIndex(user) })
    );
  }
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("userUpdate", { detail: user }));
}

export function updateStoredUser(user) {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  const bodyIndex = JSON.parse(localStorage.getItem("user_body_index") || "{}");
  localStorage.setItem(
    "user_body_index",
    JSON.stringify({ ...bodyIndex, ...toBodyIndex(user) })
  );
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("userUpdate", { detail: user }));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("storage"));
}

