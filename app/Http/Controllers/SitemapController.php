<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $sitemap = Sitemap::create();

        // Static pages
        $sitemap->add(
            Url::create('/')
                ->setPriority(1.0)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
        );

        $sitemap->add(
            Url::create('/products')
                ->setPriority(0.9)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
        );

        $sitemap->add(
            Url::create('/contact')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        );

        $sitemap->add(
            Url::create('/tracking')
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        );

        // Categories
        $categories = Category::where('is_active', true)->get();

        foreach ($categories as $category) {
            $sitemap->add(
                Url::create("/products?category={$category->id}")
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            );
        }

        // Products
        $products = Product::with('productImages')
            ->where('is_active', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        foreach ($products as $product) {
            $imageUrl = null;

            // Get the first product image if available
            if ($product->productImages->isNotEmpty()) {
                $filename = $product->productImages->first()->url;
                $cleanFilename = collect(explode('\\', $filename))->last();
                $cleanFilename = collect(explode('/', $cleanFilename))->last();
                $imageUrl = url("/images/{$cleanFilename}");
            }

            $url = Url::create("/products/{$product->id}")
                ->setLastModificationDate($product->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.7);

            // Add image for better indexing
            if ($imageUrl) {
                $url->addImage($imageUrl, $product->name);
            }

            $sitemap->add($url);
        }

        return $sitemap->toResponse(request());
    }
}