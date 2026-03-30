<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'surname'  => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'message'  => 'required|string|max:5000',
        ]);

        // Send email to sales@greycode.co.za
        Mail::to('sales@greycode.co.za')->send(new ContactMail($validated));

        return redirect()->back()->with('success', 'Your message has been sent. We will get back to you soon.');
    }
}