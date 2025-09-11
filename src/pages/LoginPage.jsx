import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email && !password) {
      setError("Please enter email and password");
      return;
    } else if (!email) {
      setError("Please enter email ");
      return;
    } else if (!password) {
      setError("Please enter password");
      return;
    }

    //debug //HAPUS NANTI!!!!
    console.log("Login submitted");
  };

  return (
    <div>
      <h1 className="justify-center">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
