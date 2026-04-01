<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class LowStockNotification extends Notification
{
    use Queueable;

    protected $products;

    public function __construct($products)
    {
        $this->products = $products;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('⚠️ Low Stock Alert - Greycode Shop')
            ->greeting('Hello Admin,')
            ->line('The following products are running low on stock:');

        foreach ($this->products as $product) {
            $mail->line("- {$product->name} - Only {$product->stock_quantity} left (SKU: {$product->sku})");
        }

        return $mail->action('View Products', url('/admin/products'))
                    ->line('Please restock these items soon.');
    }
}