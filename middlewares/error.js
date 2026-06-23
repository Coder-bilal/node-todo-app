class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Invalid MongoDB ID (e.g. /tasks/123abc)
    if (err.name === "CastError") {
        err.message = "Invalid ID format";
        err.statusCode = 404;
    }

    // Mongoose Validation Error (e.g. required field missing)
    if (err.name === "ValidationError") {
        err.message = Object.values(err.errors).map((e) => e.message).join(", ");
        err.statusCode = 400;
    }

    // JWT Token Invalid
    if (err.name === "JsonWebTokenError") {
        err.message = "Invalid token. Please login again.";
        err.statusCode = 401;
    }

    // JWT Token Expired
    if (err.name === "TokenExpiredError") {
        err.message = "Token expired. Please login again.";
        err.statusCode = 401;
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;