import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
import gasSensor from '/./public/images/GasSensor.png';
import gasSensor1 from '/./public/images/GasSensor1.png';
import blackLogo from '../../images/Greycode_G_Logo_black.png'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-screen flex">
      <Head title="Login" />
      
      {/* Left side - only visible on larger screens */}
      <div className="hidden lg:flex lg:w-3/5 bg-white">
      <div className="flex items-center justify-left">
          <img 
            src={gasSensor1} 
            alt="Gas Sensor" 
            className="w-full h-full object-cover [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]"
            loading='lazy'
          />
        </div>
      </div>
      {/* Right side - login form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center ">
              <img src={blackLogo} alt="Greycode Logo" className="mx-auto pb-5 lg:py-5  object-contain w-36 h-36" />
            </div>

            <h2 className="text-center text-4xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link href="/signup" className="font-medium text-greycode-light-blue hover:text-indigo-500">
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {errors.email && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{errors.email}</p>
              </div>
            )}
            
            <div className="space-y-6">
              {/* <div className="relative">
                <input type="text" id="floating_outlined" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none outline-none focus:border-greycode-light-blue focus:outline-none focus:ring-0 peer" placeholder=" " />
                <label htmlFor="floating_outlined" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-2 rtl:peer-focus:left-auto start-1 peer-focus:bg-white peer-focus:text-greycode-light-blue ">Floating outlined</label>
              </div>
              <div className="relative">
                <input type='text' id='floatingLabel' className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-heading bg-transparent rounded-base border-1 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer' placeholder=' ' />
                <label htmlFor="floatingLabel" className='absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-1'>Random Label</label>
              </div> */}
              <div className="relative">
                
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-greycode-light-blue focus:z-10 sm:text-sm peer"
                  placeholder=" "
                />
                <label 
                  htmlFor="email" 
                  className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-1 peer-focus:bg-white peer-focus:text-greycode-light-blue">Email Address</label>
              </div>
              
              <div class="relative">
                
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-greycode-light-blue focus:z-10 sm:text-sm peer"
                  placeholder=" "
                />
                <label htmlFor="password" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-1 peer-focus:bg-white peer-focus:text-greycode-light-blue">Password</label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 text-greycode-light-blue focus:shadow-cyan-400 border-gray-300 rounded focus:shadow-4 accent-greycode-light-blue peer"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900 peer-focus:text-greycode-light-blue ">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-greycode-light-blue hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={processing}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-greycode-light-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {processing ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

