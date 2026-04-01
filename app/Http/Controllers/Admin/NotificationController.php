<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user->is_admin) abort(403);

        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $user = Auth::user();
        if (!$user->is_admin) return response()->json(['count' => 0]);

        $count = $user->unreadNotificationsCount();
        return response()->json(['count' => $count]);
    }

    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) abort(403);
        $notification->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        Auth::user()->notifications()->unread()->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }
}