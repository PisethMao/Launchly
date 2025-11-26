"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Schema validation with custom rules
const createUserSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long")
        .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z.string(),
    role: z.enum(["USER", "ADMIN"]),
    plan: z.enum(["Free", "Pro"]),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

interface FieldError {
    [key: string]: string;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

export default function CreateUserPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [form, setForm] = useState<CreateUserForm>({
        name: "",
        email: "",
        password: "",
        role: "USER",
        plan: "Free",
    });

    const [fieldErrors, setFieldErrors] = useState<FieldError>({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    const validateField = useCallback(
        (name: keyof CreateUserForm, value: string) => {
            try {
                createUserSchema
                    .pick({ [name]: true })
                    .parse({ [name]: value });
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
        },
        []
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));

            if (touchedFields.has(name)) {
                validateField(name as keyof CreateUserForm, value);
            }

            if (submitError) setSubmitError("");
        },
        [validateField, touchedFields, submitError]
    );

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setTouchedFields((prev) => new Set(prev).add(name));
            validateField(name as keyof CreateUserForm, value);
        },
        [validateField]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setTouchedFields(new Set(Object.keys(form)));

            try {
                createUserSchema.parse(form);
                setFieldErrors({});
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errors: FieldError = {};
                    err.issues.forEach((error) => {
                        if (error.path[0]) {
                            errors[error.path[0] as string] = error.message;
                        }
                    });
                    setFieldErrors(errors);
                    const firstErrorField = Object.keys(errors)[0];
                    document.getElementById(firstErrorField)?.focus();
                    return;
                }
            }

            setIsSubmitting(true);
            setSubmitError("");

            try {
                const res = await fetch("/api/admin/users/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || res.status === 409
                            ? "Email already exists"
                            : res.status === 403
                            ? "Insufficient permissions"
                            : `Failed to create user (${res.status})`
                    );
                }

                startTransition(() => {
                    router.push("/admin");
                    router.refresh();
                });
            } catch (err) {
                setSubmitError(
                    err instanceof Error ? err.message : "Failed to create user"
                );
                setIsSubmitting(false);
            }
        },
        [form, router]
    );

    const handleCancel = useCallback(() => {
        const hasData = Object.values(form).some(
            (value) => value !== "" && value !== "USER" && value !== "Free"
        );

        if (hasData) {
            if (!confirm("Are you sure you want to discard this new user?")) {
                return;
            }
        }
        router.push("/admin");
    }, [form, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-30 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-600 dark:to-purple-600 px-6 py-6 sm:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    Create New User
                                </h1>
                                <p className="text-blue-100 dark:text-purple-200 mt-1">
                                    Add a new user to the system
                                </p>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-white hover:bg-red-400 dark:hover:bg-red-400 rounded-lg p-2 transition-colors"
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
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border-l-4 border-red-500 dark:border-red-400 rounded-r-lg animate-shake">
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
                                        <p className="font-medium text-red-800 dark:text-red-200">
                                            Creation Failed
                                        </p>
                                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">
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
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Full Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                        fieldErrors.name
                                            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950"
                                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                    }`}
                                    value={form.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                                {fieldErrors.name && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1 flex-shrink-0"
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
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Email Address{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                            fieldErrors.email
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950"
                                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                        }`}
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        placeholder="john@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1 flex-shrink-0"
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

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                                            fieldErrors.password
                                                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950"
                                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                        }`}
                                        value={form.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Role and Plan Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Role Field */}
                                <div>
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        User Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="role"
                                            name="role"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                            value={form.role}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                        Permission level for this user
                                    </p>
                                </div>

                                {/* Plan Field */}
                                <div>
                                    <label
                                        htmlFor="plan"
                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Subscription Plan
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="plan"
                                            name="plan"
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all hover:border-gray-400 dark:hover:border-gray-500 appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                            value={form.plan}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
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
                                        Initial subscription tier
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                                    disabled={
                                        isSubmitting ||
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
                                            Creating User...
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
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Create User
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-semibold mb-1">
                                Creating a new user
                            </p>
                            <p className="dark:text-blue-300">
                                The user will receive an email with their
                                credentials. Make sure to use a valid email
                                address.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
