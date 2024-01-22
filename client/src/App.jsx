import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setMessage("enter email id");
    }
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      setMessage(response.data.message);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setMessage("Registration failed. Try again..");
    }
  }

  return (
    <div>
      <h1>Register User</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
      <ForgotPassword />
      {message && <p>{message}</p>}
    </div>
  );
}

function ForgotPassword() {
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  async function handleSubmit(e) {
    e.preventDefault();

    let response;
    try {
      response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
      });
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      console.log(error);
      setMessage(response.data.message);
      setEmail("");
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="forgotPassword"></label>
        <input
          id="forgotPassword"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Forget Password</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
export default App;
