<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    // Display the contact form
    public function showForm()
    {
        return view('contact'); 
    }

    // Handle form submission and send email
    public function sendEmail(Request $request)
    {
        // Validate the form data
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Send the email
        Mail::to('sales@greycode.co.za') 
            ->send(new ContactFormMail($validated));

        // Redirect back to the contact page with success message
        return redirect()->route('contact')
            ->with('success', 'Thank you for contacting us! We will get back to you soon.');
    }
}
