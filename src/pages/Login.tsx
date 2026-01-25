import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import HomeLogo from "../assets/HomeLogo.svg";
import loginLogo from "../assets/Logo (1).svg";
import loginImg from "../assets/LoginImg.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/features/store";
import { loginUser, registerUser, clearError } from "@/features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Validation errors
  const [validationError, setValidationError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!loginEmail || !loginPassword) {
      setValidationError("Email and password are required");
      return;
    }

    try {
      await dispatch(
        loginUser({ email: loginEmail, password: loginPassword }),
      ).unwrap();
      // User will be redirected by useEffect
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (
      !registerName ||
      !registerEmail ||
      !registerPhone ||
      !registerPassword
    ) {
      setValidationError("All fields are required");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          password: registerPassword,
        }),
      ).unwrap();
      // User will be redirected by useEffect
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRegPasswordVisibility = () =>
    setShowRegPassword(!showRegPassword);
  const toggleRegConfirmPasswordVisibility = () =>
    setShowRegConfirmPassword(!showRegConfirmPassword);

  const displayError = error || validationError;

  return (
    <div className="fixed z-60 top-0 left-0 right-0 gap-2 flex md:grid md:grid-cols-2 min-h-screen justify-center bg-white p-4 md:p-0">
      <div className="hidden md:block">
        <img src={loginImg} alt="Login Image" />
      </div>
      <div className="flex flex-col md:left-1/4 md:relative h-screen w-full gap-2 md:max-w-94 justify-center md:items-center">
        <div className="flex flex-col gap-2 text-left md:w-full">
          <Link to="/" className="flex items-center gap-2">
            <img src={loginLogo} alt="Foody Logo" />
            <h1 className="text-2xl md:text-3xl font-extrabold md:font-bold text-black ">
              Foody
            </h1>
          </Link>
          <h2 className="text-2xl font-extrabold">Welcome Back</h2>
          <p>Good to see you again! Let's eat</p>
        </div>

        <Tabs defaultValue="login" className="w-full md:max-w-[400px]">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" className="py-3 text-sm font-medium">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="register" className="py-3 text-sm font-medium">
              Sign up
            </TabsTrigger>
          </TabsList>

          {/* Error Display */}
          {displayError && (
            <div className=" p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {displayError}
            </div>
          )}

          {/* --- FORM LOGIN --- */}
          <TabsContent value="login">
            <Card className="border-none shadow-none">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 px-0">
                  <div className="space-y-2">
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="Email"
                      className="h-11"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 pr-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="remember" name="remember" />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Remember Me
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="px-0">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-4 text-base font-semibold bg-[#C12116] rounded-full hover:bg-red-600"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* --- FORM REGISTRASI --- */}
          <TabsContent value="register">
            <Card className="shadow-none border-none">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 px-0">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    className="h-11"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    disabled={isLoading}
                  />
                  <Input
                    id="email-reg"
                    type="email"
                    placeholder="Email"
                    className="h-11"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Number Phone"
                    className="h-11"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="relative">
                    <Input
                      id="password-reg"
                      type={showRegPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 pr-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleRegPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={
                        showRegPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showRegPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password-confirm"
                      type={showRegConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="h-11 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleRegConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={
                        showRegConfirmPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showRegConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="px-0">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 mt-4 text-base font-semibold bg-[#C12116] rounded-full hover:bg-red-600"
                    variant="default"
                  >
                    {isLoading ? "Loading..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
