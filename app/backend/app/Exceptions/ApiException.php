<?php

namespace App\Exceptions;

use Exception;

abstract class ApiException extends Exception
{
    protected string $errorCode = 'ERROR';

    protected int $status = 422;

    public function __construct(string $message)
    {
        parent::__construct($message);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    public function status(): int
    {
        return $this->status;
    }
}
