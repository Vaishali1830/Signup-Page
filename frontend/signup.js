document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const dob = document.getElementById("dob").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, phone, dob }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Error signing up");
  }
});
