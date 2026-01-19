import { Head } from '@inertiajs/react'
import React from 'react'

export default function SignUp() {
  return (
    <div className="flex h-[700px] w-full">
      <Head title="Sign Up" />
      
      <div className="w-full hidden md:inline-block">
        {/* Left side placeholder */}
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-64 h-64 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 flex items-center justify-center">
              <svg className="w-32 h-32 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Create Account</h3>
            <p className="text-gray-600">Join our community and start your journey with us.</p>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col items-center justify-center p-4">
        <form className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
          <p className="text-sm text-gray-500/90 mt-3">Create your account to get started</p><br /><br />
          
          
          
          {/* Full Name Field */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8C9.93333 8 11.5 6.43333 11.5 4.5C11.5 2.56667 9.93333 1 8 1C6.06667 1 4.5 2.56667 4.5 4.5C4.5 6.43333 6.06667 8 8 8ZM8 9.83333C5.42 9.83333 1 11.1533 1 13.75V15C1 15.4583 1.375 15.8333 1.83333 15.8333H14.1667C14.625 15.8333 15 15.4583 15 15V13.75C15 11.1533 10.58 9.83333 8 9.83333Z" fill="#2C7DE6"/>
            </svg>
            <input type="text" placeholder="Full Name" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />
          </div>
          
          {/* Email Field */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#2C7DE6"/>
            </svg>
            <input type="email" placeholder="Email Address" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />
          </div>
          
          {/* Date of Birth Field */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6667 2H12V1.33333C12 0.979333 11.688 0.666667 11.3333 0.666667C10.9787 0.666667 10.6667 0.979333 10.6667 1.33333V2H5.33333V1.33333C5.33333 0.979333 5.02133 0.666667 4.66667 0.666667C4.312 0.666667 4 0.979333 4 1.33333V2H3.33333C2.59733 2 2 2.59733 2 3.33333V13.3333C2 14.0693 2.59733 14.6667 3.33333 14.6667H12.6667C13.4027 14.6667 14 14.0693 14 13.3333V3.33333C14 2.59733 13.4027 2 12.6667 2ZM12.6667 13.3333H3.33333V6H12.6667V13.3333ZM3.33333 4.66667H12.6667V3.33333H3.33333V4.66667Z" fill="#2C7DE6"/>
            </svg>
            <input 
              type="date" 
              className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full appearance-none"
              required 
            />
          </div>
          
          {/* Password Field */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#2C7DE6"/>
            </svg>
            <input type="password" placeholder="Password" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />
          </div>
          
          {/* Confirm Password Field */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#2C7DE6"/>
            </svg>
            <input type="password" placeholder="Confirm Password" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" required />
          </div>
          
          {/* Phone Number Field (Optional) */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-greycode-light-blue transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6667 1.33333H5.33333C4.59695 1.33333 4 1.93029 4 2.66667V13.3333C4 14.0697 4.59695 14.6667 5.33333 14.6667H10.6667C11.403 14.6667 12 14.0697 12 13.3333V2.66667C12 1.93029 11.403 1.33333 10.6667 1.33333ZM7.33333 13H8.66667V13.3333C8.66667 13.7015 8.36819 14 8 14H8C7.63181 14 7.33333 13.7015 7.33333 13.3333V13ZM10.6667 12H5.33333V3.33333H10.6667V12Z" fill="#2C7DE6"/>
            </svg>
            <input type="tel" placeholder="Phone Number (Optional)" className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" />
          </div>
          
          {/* Terms and Conditions Checkbox */}
          <div className="w-full flex items-start mt-6 text-gray-500/80">
            <div className="flex items-start gap-2">
              <input className="h-5 w-5 mt-1 accent-greycode-light-blue" type="checkbox" id="terms" required />
              <label className="text-sm" htmlFor="terms">
                I agree to the <a href="#" className="text-greycode-light-blue hover:underline">Terms of Service</a> and <a href="#" className="text-greycode-light-blue hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          {/* Newsletter Subscription (Optional) */}
          <div className="w-full flex items-center mt-4 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5 w-5 accent-greycode-light-blue" type="checkbox" id="newsletter" />
              <label className="text-sm" htmlFor="newsletter">
                Subscribe to newsletter and updates
              </label>
            </div>
          </div>
          
          <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-greycode-light-blue hover:bg-indigo-600 transition-colors font-medium">
            Create Account
          </button>
          
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account? <a href="/login" className="text-greycode-light-blue hover:underline font-medium">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  )
}