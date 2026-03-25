<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Notifications\LowStockNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check-low';
    protected $description = 'Check for products with low stock and notify admin';

    public function handle()
    {
        $threshold = 5; // Notify when stock is 5 or less
        $lowStockProducts = Product::where('stock_quantity', '<=', $threshold)
            ->where('is_active', true)
            ->get();

        if ($lowStockProducts->count() > 0) {
            Notification::route('mail', config('app.admin_email', 'admin@greycode.co.za'))
                ->notify(new LowStockNotification($lowStockProducts));
            
            $this->info('Low stock notification sent for ' . $lowStockProducts->count() . ' products.');
        } else {
            $this->info('No low stock products found.');
        }

        return Command::SUCCESS;
    }
}