import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleDemoLogin = async (e) => { // Make this async
    e.preventDefault();
    setEmail("demo@aa.io");
    setPassword("password");
    
    const serverResponse = await dispatch(thunkLogin({  // Wait for the response
      email: 'demo@aa.io',
      password: 'password'
    }));

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");  // Navigate after successful login
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="page-container">
      <div className="log-in-container">
        <h1>Log In</h1>
        {errors.length > 0 &&
          errors.map((message) => <p key={message}>{message}</p>)}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              placeholder="Please enter your email......"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              placeholder="Please enter your password......"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <div className="action-buttons">
            <button type="submit">Log In</button>
            <button type="button" onClick={handleDemoLogin}>Demo Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
