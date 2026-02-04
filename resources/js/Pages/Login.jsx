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
     {/*  <img src={gasSensor1} alt="Gas Sensor" className="overflow-hidden object-none w-full h-full transform rotate-[22deg]" /> */}

        {/* <div className="w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
              <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back</h2>
            <p className="text-gray-600 px-12">
              Sign in to access your account and continue your journey with us.
            </p>
          </div>
        </div> */}
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
                  className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-1 peer-focus:bg-white peer-focus:text-greycode-light-blue">Email Address</label>
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
                <label htmlFor="password" className="absolute text-sm text-body duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-1 peer-focus:bg-white peer-focus:text-greycode-light-blue">Password</label>
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




/* import { Head } from '@inertiajs/react'
import React from 'react'

export default function Login() {
  return (
    <div className="flex h-[700px] w-full">
      <Head title="Login" />
      
      <div className="w-full hidden md:inline-block">
        {/* Left side placeholder */
        /* <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-64 h-64 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
              <svg className="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h3>
            <p className="text-gray-600">Sign in to access your account and continue your journey with us.</p>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col items-center justify-center p-4">
        <form className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
          <p className="text-sm text-gray-500/90 mt-3">Welcome back! Please sign in to continue</p><br />
          
          <br />
          
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#2C7DE6"/>
            </svg>
            <input type="email" placeholder="Email id" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />                 
          </div>
          
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#2C7DE6"/>
            </svg>
            <input type="password" placeholder="Password" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />
          </div>
          
          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5 w-5 accent-greycode-light-blue" type="checkbox" id="checkbox" />
              <label className="text-sm" htmlFor="checkbox">Remember me</label>
            </div>
            <a className="text-sm underline hover:text-indigo-500 transition-colors" href="#">Forgot password?</a>
          </div>
          
          <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-greycode-light-blue hover:bg-indigo-600 transition-colors font-medium">
            Login
          </button>
          <p className="text-gray-500/90 text-sm mt-4">Don't have an account? <a className="text-indigo-500 hover:underline font-medium" href="#">Sign up</a></p>
        </form>
      </div>
    </div>
  );
} */