<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->is_admin || $order->user_id === $user->id;
    }

    /**
     * Determine whether the user can cancel the order.
     */
    public function cancel(User $user, Order $order)
    {

        $cancellable = in_array($order->order_status, ['pending', 'processing']);
        return $cancellable && ($user->is_admin || $order->user_id === $user->id);

    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        return $user->is_admin;
    }

    public function requestReturn(User $user, Order $order)
    {
        $returnable = $order->order_status === 'delivered' && $order->created_at->diffInDays(now()) <= 30;
        return $returnable && ($user->is_admin || $order->user_id === $user->id); 
    }


    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        return $user->is_admin;
    }
    
}
