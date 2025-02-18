import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }

    // Use the login function from AuthContext to save user data
    login(data.token, data.user);
    navigate('/');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to login');
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-sm  shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {error && (
          <div className=" text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <Button type="button" onClick={handleLogin} className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}