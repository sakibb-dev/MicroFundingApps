<?php

namespace App\Http\Controllers\Api\Investor;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->notifications()->latest()->get();

        return ApiResponse::success('OK', $notifications);
    }

    public function markRead(Request $request, AppNotification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return ApiResponse::error('Kamu tidak punya akses untuk melakukan ini.', null, null, 403);
        }

        $notification->update(['is_read' => true]);

        return ApiResponse::success('Perubahan tersimpan.', $notification);
    }
}
