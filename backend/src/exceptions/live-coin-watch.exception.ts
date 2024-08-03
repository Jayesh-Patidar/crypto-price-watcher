import { HttpException, HttpExceptionOptions } from "@nestjs/common";

export class LiveCoinWatchException extends HttpException {
    constructor (response: string | Record<string, any>, status: number, options?: HttpExceptionOptions) {
        super(response, status, options);
    }
}