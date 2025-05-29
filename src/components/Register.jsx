import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = ({ toggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      setError('');
      toggleView(); // Switch to login after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--text-color)]">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Password"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-[var(--text-color)]">
        Already have an account?{' '}
        <button
          onClick={toggleView}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;