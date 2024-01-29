import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  return (
    <div className="container-fluid">
      <h1>Password Reset</h1>
      <div className="row">
        <div className="col-md-6">
          <RegisterUser />
        </div>
        <div className="col-md-6">
          <ForgotPassword />
        </div>
      </div>
    </div>
  );
}

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        {
          email,
        }
      );
      console.log(response.data.message);
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
        setTimeout(() => {
          console.log("Setting email to an empty string");
          setEmail("");
          setMessage("");
        }, 10000);
      } else {
        setMessage("Unexpected response from the server");
      }
    } catch (error) {
      console.log(error.response.data.message);
      setMessage(error.response.data.message);

      setTimeout(() => {
        // setEmail("");
        setMessage("");
      }, 5000);
    }
  }

  return (
    <div className="container ">
      <p>Lost password? Enter your email to reset!</p>

      <div className="row">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Registered email address *"
              value={email}
              className="form-control"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

function RegisterUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();

    let response;
    try {
      response = await axios.post("http://localhost:5000/api/register", {
        email,
        password,
      });
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
        setEmail("");
        setPassword("");
      } else {
        setMessage("Unexpected response from the server");
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 5000);

      setEmail("");
      setPassword("");
    }
  }
  return (
    <div className="container">
      <p>New? Join for a quick password reset!</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            value={email}
            placeholder="Email address *"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text">
            Your email stays confidential with us.
          </div>
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password *"
            value={password}
            className="form-control"
            id="exampleInputPassword1"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Sign Up Now
        </button>
      </form>
      {message && <p className="btn">{message}</p>}
    </div>
  );
}

export default App;
