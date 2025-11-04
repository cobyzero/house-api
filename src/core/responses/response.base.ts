export class ResponseBase {
    constructor(
        public readonly data: any,
        public readonly message: string,
        public readonly code: number,
    ) { }

    static success(data: any, message: string, code: number = 200) {
        return new ResponseBase(data, message, code);
    }

    static error(message: string, code: number = 400) {
        return new ResponseBase(null, message, code);
    }
}