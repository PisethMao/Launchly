"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useTransition } from "react";
import { z } from "zod";

// Schema validation
const userSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["USER", "ADMIN"]),
    plan: z.enum(["Free", "Pro"]),
});

type UserForm = z.infer<typeof userSchema>;

interface FieldError {
    [key: string]: string;
}

// Custom hook for API calls with proper error handling
function useUserData(id: string | string[] | undefined) {
    const [data, setData] = useState<UserForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id || Array.isArray(id)) {
            setError("Invalid user ID");
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function loadUser() {
            try {
                const res = await fetch(`/api/admin/users/${id}`, {
                    credentials: "include",
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error(
                        res.status === 404
                            ? "User not found"
                            : res.status === 403
                            ? "Access denied"
                            : `Failed to load user (${res.status})`
                    );
                }

                const userData = await res.json();
                const validated = userSchema.parse(userData);
                setData(validated);
                setError("");
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadUser();

        return () => controller.abort();
    }, [id]);

    return { data, loading, error };
}

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const { data: initialData, loading, error: loadError } = useUserData(id);

    const [form, setForm] = useState<UserForm>({
        name: "",
        email: "",
        role: "USER",
        plan: "Free",
    });

    const [fieldErrors, setFieldErrors] = useState<FieldError>({});
    const [submitError, setSubmitError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Initialize form when data loads
    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    // Check if form has unsaved changes
    useEffect(() => {
        if (initialData) {
            const hasChanges = Object.keys(form).some(
                (key) =>
                    form[key as keyof UserForm] !==
                    initialData[key as keyof UserForm]
            );
            setIsDirty(hasChanges);
        }
    }, [form, initialData]);

    const validateField = useCallback((name: keyof UserForm, value: string) => {
        try {
            userSchema.pick({ [name]: true }).parse({ [name]: value });
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                setFieldErrors((prev) => ({
                    ...prev,
                    [name]: err.issues[0]?.message || "Invalid value",
                }));
            }
            return false;
        }
    }, []);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
            validateField(name as keyof UserForm, value);
            if (submitError) setSubmitError("");
        },
        [validateField, submitError]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            // Validate entire form
            try {
                userSchema.parse(form);
                setFieldErrors({});
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errors: FieldError = {};
                    err.issues.forEach((issue) => {
                        const key = issue.path && issue.path[0];
                        if (key) {
                            errors[key as string] = issue.message;
                        }
                    });
                    setFieldErrors(errors);
                    return;
                }
            }

            setIsSubmitting(true);
            setSubmitError("");

            try {
                const res = await fetch(`/api/admin/users/${id}`, {
                    credentials: "include",
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || res.status === 409
                            ? "Email already in use"
                            : res.status === 403
                            ? "Insufficient permissions"
                            : `Update failed (${res.status})`
                    );
                }

                startTransition(() => {
                    router.push("/admin");
                    router.refresh();
                });
            } catch (err) {
                setSubmitError(
                    err instanceof Error ? err.message : "Failed to update user"
                );
                setIsSubmitting(false);
            }
        },
        [form, id, router]
    );

    const handleCancel = useCallback(() => {
        if (isDirty) {
            if (
                !confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                )
            ) {
                return;
            }
        }
        router.push("/admin");
    }, [isDirty, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-500 border-r-transparent mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Loading user data...
                    </p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Error Loading User
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{loadError}</p>
                    <button
                        onClick={() => router.push("/admin/users")}
                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-md"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-6 sm:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Edit User
                                </h1>
                                <p className="text-blue-100 dark:text-blue-200 mt-1">
                                    Update user information and permissions
                                </p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-white hover:bg-blue-500 dark:hover:bg-blue-600 rounded-lg p-2 transition-colors"
                                aria-label="Close"
                                disabled={isSubmitting}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-8 sm:px-8">
                        {submitError && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-red-800 dark:text-red-300">
                                            Update Failed
                                        </p>
                                        <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                                            {submitError}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                                >
                                    Name <span className="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                        fieldErrors.name
                                            ? "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                    }`}
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="Enter full name"
                                />
                                {fieldErrors.name && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                                >
                                    Email Address{" "}
                                    <span className="text-red-500 dark:text-red-400">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                                        fieldErrors.email
                                            ? "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                    }`}
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="user@example.com"
                                />
                                {fieldErrors.email && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {fieldErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Role and Plan Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Role Field */}
                                <div>
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                                    >
                                        Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="role"
                                            name="role"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            value={form.role}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        User permissions level
                                    </p>
                                </div>

                                {/* Plan Field */}
                                <div>
                                    <label
                                        htmlFor="plan"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                                    >
                                        Subscription Plan
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="plan"
                                            name="plan"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            value={form.plan}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="Free">Free</option>
                                            <option value="Pro">Pro</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        Current subscription tier
                                    </p>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {isDirty && !isSubmitting && (
                                <div className="flex items-center text-amber-700 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        You have unsaved changes
                                    </span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-700 dark:hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                                    disabled={
                                        isSubmitting ||
                                        !isDirty ||
                                        Object.keys(fieldErrors).length > 0
                                    }
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Saving Changes...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Save Changes
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
