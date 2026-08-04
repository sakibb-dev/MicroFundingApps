<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Investment;

/**
 * Generates the invoice record for a confirmed investment. PDF rendering is
 * intentionally deferred to a queued job in a later pass (needs a PDF
 * package such as barryvdh/laravel-dompdf) -- this creates the database
 * record with `path_pdf` left null so the rest of the confirm flow does not
 * block on it.
 */
class InvoiceGeneratorService
{
    public function generate(Investment $investment): Invoice
    {
        return Invoice::create([
            'investment_id' => $investment->id,
            'nomor_invoice' => $this->nextInvoiceNumber($investment),
            'tanggal_terbit' => now()->toDateString(),
        ]);
    }

    private function nextInvoiceNumber(Investment $investment): string
    {
        return sprintf('INV/%s/%06d', now()->format('Ym'), $investment->id);
    }
}
