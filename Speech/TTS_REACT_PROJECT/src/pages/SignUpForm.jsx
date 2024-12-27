import React, { useState } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; 
import LoginForm  from '../components/LoginForm'


const SignUpForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', // Remplacer 'name' par 'username'
    firstName: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis'; // Validation du nom d'utilisateur
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'La confirmation du mot de passe ne correspond pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleClick = () => {
    const googleLoginButton = document.querySelector('[aria-label="Continue with Google"]');
    if (googleLoginButton) {
      googleLoginButton.click();
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await axios.post('http://127.0.0.1:8000/accounts/auth/google/', {
        token: credential,
      });

      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);

        setSuccessMessage('Connexion réussie avec Google ! Redirection...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      setGlobalError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    setGlobalError('La connexion avec Google a échoué. Veuillez réessayer.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setGlobalError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', formData);

      if (response.status === 201) {
        setSuccessMessage('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          navigate('/signup_rediriger')
        }, 2000);
      }
    } catch (error) {
      setGlobalError('Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error(error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header gotstarted={true} />
      <div className="my-10 lg:my-0 flex flex-col justify-center items-center font-[Poppins] lg:flex-row lg:mx-4">
        <div className="flex flex-col justify-center items-center xl:block">
          <div className="lg:block hidden lg:mb-24">
            <p className="text-black leading-9 w-[450px]">Get the full experience for</p>
            <h1 className="text-green-700 text-4xl leading-9 font-bold w-[450px]">0$ today</h1>
            <h1 className="font-semibold text-2xl text-gray-500 leading-9 w-[450px] mb-8">
              Transform Your Words into Lifelike Speech.
            </h1>
          </div>

          <div className="max-w-[650px] lg:-mt-16">
            <div className="flex justify-center py-1 px-7">
              <Check />
              <p className="font-normal text-lg leading-7 ml-3">
                Explore optimized voices for narration, training, and announcements.
              </p>
            </div>
            <div className="flex justify-center py-1 px-7">
              <Check />
              <p className="font-normal text-lg leading-7 ml-3">
                Access a smooth audio player, compatible with all your devices.
              </p>
            </div>
            <div className="flex justify-center py-1 px-7">
              <Check />
              <p className="font-normal text-lg leading-7 ml-3">
                Easily convert your documents and content into audio formats.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-3 flex justify-center items-center flex-col bg-[#FAF6F4] rounded-3xl w-10/12 max-w-[550px]">
          {globalError && <div className="text-red-500 mb-4">{globalError}</div>}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          
          <h1 className="my-1 mt-4 font-semibold text-3xl">Sign up</h1>
          <p className="my-3">
            Already Have An Account? <a href="/signup_rediriger" className="font-semibold text-[#6366F1]">Log in</a>
          </p>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="Username *"
            />
            {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
          </div>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="First name *"
            />
            {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName}</span>}
          </div>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="Name *"
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="Email address *"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="Password (8 characters minimum) *"
            />
            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
          </div>

          <div className="flex flex-col w-11/12 my-3">
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="font-light border-gray-500 border-2 rounded-md p-3 mt-1 bg-transparent"
              placeholder="Repeat password *"/>
            {errors.password2 && <span className="text-red-500 text-sm mt-1">{errors.password2}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full my-4 bg-[#0040EA] w-11/12 p-4 text-white font-semibold active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform disabled:opacity-50"
          >
            {isLoading ? 'Registration...' : 'Register'}
          </button>

          <button 
    type="button" 
    onClick={handleGoogleClick}
    className="mb-4 w-11/12 rounded-full flex items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-3 text-gray-700 font-medium text-lg border-2 border-black">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
      <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
      <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
      <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
    </svg>
    Sign in with Google
  </button>

  <div style={{ display: 'none' }}>
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;