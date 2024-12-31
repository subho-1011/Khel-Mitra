class ErrorResponse {
    success: boolean;
    error: string;

    constructor(error: string) {
        this.success = false;
        this.error = error;
    }
}

class Response {
    success: boolean;
    data: any;
    message: string;

    constructor(data: any = null, message: string = "") {
        this.success = true;
        this.data = data;
        this.message = message;
    }
}

export { ErrorResponse as Error, Response };
