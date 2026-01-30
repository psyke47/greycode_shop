<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // Show login form
    public function showLogin()
    {
        return Inertia::render('Login');
    }
    
    // Handle web login
    public function login(Request $request)
    {
        // Check if it's an API request
        if ($request->expectsJson()) {
            return $this->apiLogin($request);
        }
        
        // Web login
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        if (Auth::attempt($credentials, $request->remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }
        
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
    
    // API login (returns JSON)
    public function apiLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        
        $user = User::where('email', $request->email)->first();
        
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }
        
        $token = $user->createToken('api-token')->plainTextToken;
        
        return response()->json(['user' => $user, 'token' => $token]);
    }
    
    // Show registration form
    public function showRegister()
    {
        return Inertia::render('Signup');
    }
    
    // Handle web registration
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'required|date|before:today',
        ]);
        
        $user = User::create([
            'username' => $validated['username'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'date_of_birth' => $validated['date_of_birth'],
            'is_admin' => 0,
        ]);
        
        // For web, log the user in
        if (!$request->expectsJson()) {
            Auth::login($user);
            $request->session()->regenerate();
            return redirect('/');
        }
        
        // For API, return token
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }
    
    // Handle logout
    public function logout(Request $request)
    {
        if ($request->expectsJson()) {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Logged out successfully']);
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }
}