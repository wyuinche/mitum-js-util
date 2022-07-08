class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "ValidationError";
    }
}


class NotImplementedError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "NowImplementedError";
    }
}

module.exports = {
    ValidationError,
    NotImplementedError,
}