<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class NewOrderNotification extends Notification
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $itemsList = '';
        foreach ($this->order->items as $item) {
            $itemsList .= "- {$item->product_name} (x{$item->quantity}) - R " . number_format($item->total, 2) . "\n";
        }

        return (new MailMessage)
            ->subject('🛒 New Order Received - ' . $this->order->order_number)
            ->greeting('Hello Admin,')
            ->line('A new order has been placed on Greycode Shop.')
            ->line('**Order Number:** ' . $this->order->order_number)
            ->line('**Customer:** ' . ($this->order->user->first_name . ' ' . $this->order->user->last_name))
            ->line('**Email:** ' . $this->order->user->email)
            ->line('**Total:** R ' . number_format($this->order->total_amount, 2))
            ->line('**Payment Method:** ' . ucfirst($this->order->payment_method))
            ->line('')
            ->line('**Items Ordered:**')
            ->line($itemsList)
            ->action('View Order', url('/admin/order/' . $this->order->id))
            ->line('Thank you for using Greycode Shop!');
    }
}