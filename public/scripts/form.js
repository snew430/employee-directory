const profileForm = document.querySelector(".form-signin form");

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/directory", {
    method: "POST",
    body: new FormData(profileForm),
  });

  const results = await response.json();

  if (results.error) {
    alert(results.error);
  } else {
    location.replace("/directory");
  }
});
