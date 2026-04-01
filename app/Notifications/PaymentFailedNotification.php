<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentFailedNotification extends Notification
{
    use Queueable;

    protected $order;
    protected $reason;

    public function __construct(Order $order, $reason = null)
    {
        $this->order = $order;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('⚠️ Payment Failed - ' . $this->order->order_number)
            ->greeting('Hello Admin,')
            ->line('A payment has failed for order ' . $this->order->order_number . '.')
            ->line('**Order Number:** ' . $this->order->order_number)
            ->line('**Customer:** ' . ($this->order->user->first_name . ' ' . $this->order->user->last_name))
            ->line('**Email:** ' . $this->order->user->email)
            ->line('**Amount:** R ' . number_format($this->order->total_amount, 2))
            ->line('**Payment Method:** ' . ucfirst($this->order->payment_method));

        if ($this->reason) {
            $mail->line('**Reason:** ' . $this->reason);
        }

        $mail->action('View Order', url('/admin/order/' . $this->order->id))
             ->line('Please investigate and follow up with the customer if needed.');

        return $mail;
    }
}