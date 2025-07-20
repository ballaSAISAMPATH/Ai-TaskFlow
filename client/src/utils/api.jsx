export function fakeLogin(username) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: username });
    }, 500);
  });
}
