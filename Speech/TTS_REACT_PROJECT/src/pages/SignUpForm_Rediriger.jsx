import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm_Rediriger = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Ajout de l'état pour l'erreur

  // Fonction de gestion du login
  const handleLogin = async () => {
    const data = { email, password };
    setError(''); // Réinitialiser l'erreur avant chaque tentative de login
    try {
        const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',  // Assurez-vous que le header est bien présent
            },
            body: JSON.stringify(data),  // Assurez-vous que les données sont correctement formatées
          });

      if (response.ok) {
        const result = await response.json();
        const { access, refresh } = result;

        // Sauvegarder le token (par exemple dans le localStorage ou dans un state global)
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Rediriger vers la page de conversion
        navigate('/page_conversion');
      } else {
        // Gérer les erreurs de login
        const result = await response.json();
        setError(result.error || 'Login failed');  // Afficher le message d'erreur de l'API
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred while logging in');  // Message d'erreur générique
    }
  };

  return (
    <div className='fixed z-50 top-0 left-0 w-full h-screen flex items-center bg-black bg-opacity-50'>
      <div className='md:pt-0 pt-6 relative font-[Poppins] h-full w-full md:h-[600px] md:w-8/12 xl:w-1/2 mx-auto shadow-2xl bg-white md:rounded-3xl'>
        <div className='flex flex-col justify-center items-center gap-3'>
          <h1 className='font-bold pt-2 mt-12 text-4xl'>Welcome back.</h1>
          <div>New to us?<a href="" className='text-indigo-600 pl-2 font-semibold underline'>Sign up</a></div>

          {/* Affichage des erreurs */}
          {error && (
            <div className="text-red-500 text-sm mt-4">{error}</div>  // Affichage de l'erreur
          )}

          {/* Email Input */}
          <div className='flex flex-col md:w-4/6 w-2/3 lg:w-1/2 xl:w-3/5'>
            <label className='text-sm font-normal' htmlFor='email'>Email</label>
            <input 
              type='text'
              id='email'
              className='w-full border-2 border-gray rounded-md p-3 mt-1 bg-transparent'
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className='flex flex-col mt-4 md:w-4/6 w-2/3 lg:w-1/2 xl:w-3/5'>
            <label className='text-sm font-normal' htmlFor='password'>Password</label>
            <input 
              className='w-full border-2 border-gray rounded-md p-3 mt-1 bg-transparent'
              placeholder="Enter your password"
              type="password"
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember checkbox and forgot password */}
          <div className='font-normal mt-8 flex justify-between items-center w-2/3 md:w-4/6 mb-3 lg:w-1/2 xl:w-3/5'>
            <div>
              <input type="checkbox" id='remember' />
              <label className='ml-2 font-normal text-xs' htmlFor="remember">Remember for 30 days</label>
            </div>
            <button className='font-medium text-xs text-violet-500 underline font-[roboto]'>Forgot password</button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className='w-2/3 md:w-4/6 lg:w-1/2 xl:w-3/5 p-3 bg-violet-500 rounded-full active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out'>
            Log in
          </button>

          {/* Social login option */}
          <div className='w-2/3 font-normal text-sm'>
            Or login with
          </div>

          <button className='w-2/3 md:w-4/6 lg:w-1/2 xl:w-3/5 rounded-full flex items-center justify-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 text-lg border-2 border-black'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
              <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
              <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
              <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm_Rediriger;
