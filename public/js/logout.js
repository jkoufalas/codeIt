const logout = async () => {
  // Make a POST request to destroy the session on the back end
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    // If successfully logged out, redirect to the login page
    document.location.assign("/");
  } else {
    alert(response.statusText);
  }
};

//if normal nav button used or burger button logout
document.querySelector("#logout").addEventListener("click", logout);
document.querySelector("#logout-burger").addEventListener("click", logout);
