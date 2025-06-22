import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Store the user's UID in session storage
    sessionStorage.setItem("uid", user.uid);
    // Redirect to the main app if not already there
    if (window.location.pathname === "/signin") {
      window.location.href = "/";
    }
  } else {
    // Clear stored UID
    sessionStorage.removeItem("uid");
    // Redirect to sign-in page if not already there
    if (window.location.pathname !== "/signin") {
      window.location.href = "/signin";
    }
  }
});

// Optional helper function to log out and redirect
export const logOutUser = () => {
  signOut(auth).then(() => {
    window.location.href = "/signin";
  });
};