const EXTENSION_CONTEXT_INVALIDATED_SUBSTRING = "Extension context invalidated";

/*
 * Extracts the error from an unknwon error type.
 */
export function error_get_message(error: unknown): string | null {
    if (error instanceof Error) {
        return error.message;
    }

    if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: unknown }).message;
        return typeof message === "string" ? message : null;
    }

    return null;
}

/**
 * Checkes whether an error represents an invalid extension context.
 */
export function error_is_invalidated_extension_context(error: unknown): boolean {
    const message = error_get_message(error);
    return !!message && message.includes(EXTENSION_CONTEXT_INVALIDATED_SUBSTRING);
}

/**
 * Rethrows the error if it does not represent an invalid extension context.
 */
export function error_invalid_context_ignore(error: unknown): void {
    if (!error_is_invalidated_extension_context(error)) {
        throw error;
    }
}
