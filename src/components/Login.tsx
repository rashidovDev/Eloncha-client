import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'react-feather'
import { SIGNIN, SIGNUP } from './api/api'
import axios from 'axios';
import googleIcon from "../assets/google.png"
import { useAuth } from './Authcontext';

import { SIGNUProps, User, UserResponseProps } from '../types/types'
import { useLanguage } from './LanguageContext';

// ------------------ TRANSLATIONS ------------------
const LOGIN_TEXT = {
  title: {
    login: { ru: "Войти", en: "Login", ko: "로그인" },
    register: { ru: "Регистрация", en: "Register", ko: "회원가입" },
  },
  fields: {
    username: { ru: "Имя пользователя", en: "Username", ko: "사용자 이름" },
    email: { ru: "E-mail", en: "Email", ko: "이메일" },
    password: { ru: "Пароль", en: "Password", ko: "비밀번호" },
    confirmPassword: { ru: "Подтвердите пароль", en: "Confirm password", ko: "비밀번호 확인" },
  },
  google: {
    login: { ru: "Войти через Google", en: "Login with Google", ko: "Google로 로그인" },
    register: {
      ru: "Зарегистрируйтесь через Google",
      en: "Register with Google",
      ko: "Google로 회원가입",
    },
  },
  left: {
    title: { ru: "Добро пожаловать!", en: "Welcome!", ko: "환영합니다!" },
    desc: {
      ru: "Чтобы оставаться на связи с нами, пожалуйста, войдите, указав свои личные данные.",
      en: "To stay connected with us, please login using your personal information.",
      ko: "계속 이용하시려면 개인 정보를 입력하고 로그인해주세요.",
    },
    btn: { ru: "Войти", en: "Login", ko: "로그인" },
  },
  right: {
    title: { ru: "Здравствуйте!", en: "Hello!", ko: "안녕하세요!" },
    desc: {
      ru: "Введите свои личные данные и начните путешествие вместе с нами",
      en: "Enter your personal details and start your journey with us",
      ko: "개인 정보를 입력하고 저희와 여정을 시작하세요",
    },
    btn: { ru: "Зарегистрироваться", en: "Register", ko: "회원가입" },
  },
};
// ---------------------------------------------------

const Login: React.FC = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const GOOGLE_BASE_URL = import.meta.env.VITE_GOOGLE_BASE_URL;

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [loginIsTrue, setLoginIsTrue] = useState<boolean>(false);

  const [text, setText] = useState<boolean>(false);

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  const [usernameDirty, setUsernameDirty] = useState<boolean>(false);
  const [emailDirty, setEmailDirty] = useState<boolean>(false);
  const [passwordDirty, setPasswordDirty] = useState<boolean>(false);
  const [confirmPasswordDirty, setConfirmPasswordDirty] = useState<boolean>(false);

  const [usernameError, setUsernameError] = useState('Обязательное поле');
  const [emailError, setEmailError] = useState('Обязательное поле');
  const [passwordError, setPasswordError] = useState('Обязательное поле');
  const [confirmPasswordError, setConfirmPasswordError] = useState('Обязательное поле');

  const [formValid, setFormValid] = useState(false);

  const [strength, setStrength] = useState('');
  const [strengthColor, setStrengthColor] = useState('black');
  const [strengthRange, setStrengthRange] = useState('');

  let score: number = 0;

  const userData: SIGNUProps = { username, email, password };

  const loginWithGoogle = async () => {
    window.open(`${GOOGLE_BASE_URL}/auth/google`, "_self");
  };

  const authLogin = async (email: string, password: string) => {
    try {
      const response: UserResponseProps = await SIGNIN(email, password, "/user/auth/login");

      if (response) {
        const { data } = await axios.get<User>(BASE_URL + "/user/auth", {
          headers: { Authorization: "Bearer " + response.token },
        });
        login(data, response.token);

        if (data.role === "user") navigate("/");
        else if (data.role === "admin") navigate("/admin/main");
        else navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  async function createUser(userData: SIGNUProps) {
    await SIGNUP(userData, `user/auth/registration`);
    await authLogin(email, password);
  }

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!e.target.value) setEmailError("Обязательное поле");
    else if (!re.test(String(e.target.value).toLowerCase()))
      setEmailError("Неправильный Email");
    else setEmailError("");
  };

  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (!e.target.value) setUsernameError("Обязательное поле");
    else if (e.target.value.length < 5 || e.target.value.length > 12)
      setUsernameError("Имя пользователя должно быть больше 5 и меньше 12");
    else setUsernameError("");
  };

  function evaluatePasswordStrength(password: string) {
    if (!password) return '';

    if (password.length > 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
      case 2:
        setStrengthColor('bg-red-400');
        setStrengthRange('Weak');
        return 'w-1/3';
      case 3:
        setStrengthColor('bg-yellow-200');
        setStrengthRange('Middle');
        return 'w-2/3';
      case 4:
      case 5:
        setStrengthColor('bg-green-500');
        setStrengthRange('Strong');
        return 'w-full';
      default:
        return '';
    }
  }

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!e.target.value) setPasswordError("Обязательное поле");
    else setPasswordError("");
    validateConfirmPassword(password, e.target.value);
    setStrength(evaluatePasswordStrength(e.target.value));
  };

  const confirmPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPass(e.target.value);
    if (!e.target.value) setConfirmPasswordError("Обязательное поле");
    else setConfirmPasswordError("");
    validateConfirmPassword(password, e.target.value);
  };

  const validateConfirmPassword = (password: string, confirmPass: string) => {
    if (!confirmPass) setConfirmPasswordError("Обязательное поле");
    else if (password !== confirmPass)
      setConfirmPasswordError("Пароль подтверждения не совпадает");
    else setConfirmPasswordError("");
  };

  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "username":
        setUsernameDirty(true);
        break;
      case "email":
        setEmailDirty(true);
        break;
      case "password":
        setPasswordDirty(true);
        break;
      case "confirmPass":
        setConfirmPasswordDirty(true);
        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(loginIsTrue);

      if (loginIsTrue) {
        if (emailError || password.length < 5) setFormValid(false);
        else setFormValid(true);
      } else {
        if (emailError || passwordError || usernameError || confirmPasswordError)
          setFormValid(false);
        else setFormValid(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    loginIsTrue,
    usernameError,
    emailError,
    password,
    passwordError,
    confirmPasswordError,
  ]);

  return (
    <div>

    <div>
{/* ================= MOBILE LOGIN ================= */}
<div className="md:hidden min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">

    {/* TITLE */}
    <h1 className="text-2xl font-bold text-center mb-6">
      {text ? "Login" : "Register"}
    </h1>

    {/* USERNAME */}
    {!text && (
      <input
        type="text"
        value={username}
        onChange={usernameHandler}
        className="w-full mb-3 px-4 py-3 border rounded-lg"
        placeholder="Username"
      />
    )}

    {/* EMAIL */}
    <input
      type="text"
      value={email}
      onChange={emailHandler}
      className="w-full mb-3 px-4 py-3 border rounded-lg"
      placeholder="Email"
    />

    {/* PASSWORD */}
    <div className="relative mb-3">
      <input
        type={passwordVisible ? "text" : "password"}
        value={password}
        onChange={passwordHandler}
        className="w-full px-4 py-3 border rounded-lg"
        placeholder="Password"
      />
      <span
        onClick={() => setPasswordVisible(!passwordVisible)}
        className="absolute right-3 top-3 cursor-pointer"
      >
        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    </div>

    {/* CONFIRM PASSWORD */}
    {!text && (
      <div className="relative mb-3">
        <input
          type={confirmPasswordVisible ? "text" : "password"}
          value={confirmPass}
          onChange={confirmPasswordHandler}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Confirm password"
        />
        <span
          onClick={() =>
            setConfirmPasswordVisible(!confirmPasswordVisible)
          }
          className="absolute right-3 top-3 cursor-pointer"
        >
          {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    )}

    {/* SUBMIT */}
    <button
      disabled={!formValid}
      onClick={() => {
        if (text) authLogin(email, password);
        else createUser(userData);
      }}
      className="w-full bg-primary text-white py-3 rounded-lg disabled:opacity-60"
    >
      {text ? "Login" : "Register"}
    </button>

    {/* GOOGLE */}
    <button
      onClick={loginWithGoogle}
      className="w-full mt-3 border border-primary rounded-lg py-2 flex items-center justify-center"
    >
      <img src={googleIcon} className="w-6 mr-2" />
      {text ? "Login with Google" : "Register with Google"}
    </button>

    {/* SWITCH */}
    <p className="text-center text-sm mt-4">
      {text ? "No account?" : "Already have an account?"}{" "}
      <span
        onClick={() => {
          setEmail("");
          setPassword("");
          setLoginIsTrue(!loginIsTrue);
        }}
        className="text-primary font-medium cursor-pointer"
      >
        {text ? "Register" : "Login"}
      </span>
    </p>
  </div>
</div>
{/* =============== END MOBILE LOGIN =============== */}

    </div>
    <div className="hidden md:flex justify-center items-center fixed inset-0">
      <div className="relative w-[1100px] h-[600px] rounded-[15px] login-shadow flex justify-between items-center">

        {/* Background Sliding Block */}
        <div
          className={`${loginIsTrue ? "color-right z-20 rounded-r-[15px]" : "color-left z-20 rounded-l-[15px]"
            } absolute w-1/2 h-full bg-primary flex justify-center items-center`}
        />

        {/* LOGIN / REGISTER FORM */}
        <div
          className={`${loginIsTrue ? "login-left" : "login-right"
            } w-1/2 h-full absolute right-0 z-10 rounded-l-[15px] flex justify-center items-center`}
        >
          <div className="text-center">
            <h1 className="text-[40px] font-bold my-3">
              {text
                ? LOGIN_TEXT.title.login[language]
                : LOGIN_TEXT.title.register[language]}
            </h1>

            <div>
              {/* USERNAME */}
              {!text && (
                <div className="my-5 relative">
                  <input
                    type="text"
                    name="username"
                  
                    value={username}
                    onChange={usernameHandler}
                    onBlur={blurHandler}
                    className="w-[400px] py-3 px-4 bg-white border-2 rounded-lg"
                  />
                  <span className="input-text absolute bg-white left-[20px] top-[9px] py-1 pr-3">
                    {LOGIN_TEXT.fields.username[language]}
                  </span>

                  {usernameDirty && usernameError && (
                    <div className="text-red-500 text-[12px] text-left">{usernameError}</div>
                  )}
                </div>
              )}

              {/* EMAIL */}
              <div className="my-5 relative">
                <input
                  name="email"
                  value={email}
                  onChange={emailHandler}
                  onBlur={blurHandler}
                  type="text"
                  className="w-[400px] py-3 px-4 bg-white border-2 rounded-lg"
                />
                <span className="input-text1 absolute bg-white left-[20px] top-[9px] py-1 pr-3">
                  {LOGIN_TEXT.fields.email[language]}
                </span>
                {emailDirty && emailError && (
                  <div className="text-red-500 text-[12px] text-left">{emailError}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="my-5 relative">
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-[5px] top-[16px] cursor-pointer"
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>

                <input
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={passwordHandler}
                  onBlur={blurHandler}
                  className="w-[400px] py-3 px-4 bg-white border-2 rounded-lg"
                />
                <span className="input-text1 absolute bg-white left-[20px] top-[9px] py-1 pr-3">
                  {LOGIN_TEXT.fields.password[language]}
                </span>

                {/* Strength bar */}
                {!text && strength && (
                  <div className="w-full h-[20px] my-2 rounded-[10px]">
                    <div
                      className={`${strength} h-[20px] ${strengthColor} text-[12px] flex justify-center items-center rounded-[10px] transition-all`}
                    >
                      {strengthRange}
                    </div>
                  </div>
                )}

                {passwordDirty && passwordError && (
                  <div className="text-red-500 text-[12px] text-left">{passwordError}</div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              {!text && (
                <div className="my-5 relative">
                  <div
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    className="absolute right-[5px] top-[16px] cursor-pointer"
                  >
                    {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>

                  <input
                    name="confirmPass"
                    type={confirmPasswordVisible ? "text" : "password"}
                    onChange={confirmPasswordHandler}
                    onBlur={blurHandler}
                    className="w-[400px] py-3 px-4 bg-white border-2 rounded-lg"
                  />

                  <span className="input-text bg-white absolute left-[20px] top-[9px] py-1 pr-3">
                    {LOGIN_TEXT.fields.confirmPassword[language]}
                  </span>

                  {confirmPasswordDirty && confirmPasswordError && (
                    <div className="text-red-500 text-[12px] text-left">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                disabled={!formValid}
                onClick={() => {
                  if (text) authLogin(email, password);
                  else createUser(userData);
                }}
                className={`border bg-primary text-white rounded-[20px] p-3 w-[200px] ${!formValid && "opacity-70"}`}
              >
                {text
                  ? LOGIN_TEXT.title.login[language]
                  : LOGIN_TEXT.title.register[language]}
              </button>

              {/* GOOGLE BUTTON */}
              <div className="my-1">
                <button
                  onClick={loginWithGoogle}
                  className="border border-primary rounded-[10px] py-1 px-3 w-full flex justify-center items-center hover:bg-primary hover:text-white"
                >
                  <img src={googleIcon} className="w-[30px]" />
                  <span className="ml-2">
                    {text
                      ? LOGIN_TEXT.google.login[language]
                      : LOGIN_TEXT.google.register[language]}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT SIDE TEXT */}
        <div className={`${!text && "z-20"} w-1/2 text-white`}>
          <div className="py-4">
            <h1 className="text-[40px] text-center">{LOGIN_TEXT.left.title[language]}</h1>
            <p className="px-3 text-center py-2">{LOGIN_TEXT.left.desc[language]}</p>
          </div>

          <div className="flex justify-center py-5">
            <button
              onClick={() => {
                setEmail('');
                setPassword('');
                setStrength('')
                  setStrengthColor('black')
                setStrengthRange('')
                setLoginIsTrue(!loginIsTrue);
              }}
              className={`${loginIsTrue && 'hidden'} border rounded-[20px] p-3 w-[180px]`} 
            >
              {LOGIN_TEXT.left.btn[language]}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE TEXT */}
        <div className={`${text && "z-20"} w-1/2 text-white`}>
          <div className="py-4">
            <h1 className="text-[40px] text-center">{LOGIN_TEXT.right.title[language]}</h1>
            <p className="px-3 text-center w-2/3 mx-auto py-2">
              {LOGIN_TEXT.right.desc[language]}
            </p>
          </div>

          <div className="flex justify-center py-5">
            <button
              onClick={() => {
                setEmail('');
                setPassword('');
                setStrength('')
                setStrengthColor('black')
                setStrengthRange('')
                setLoginIsTrue(!loginIsTrue);
              }}
              className={`${!loginIsTrue && 'hidden'} border rounded-[20px] py-3 w-[200px]`}
            >
              {LOGIN_TEXT.right.btn[language]}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
