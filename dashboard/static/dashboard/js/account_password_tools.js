"use strict";

// ==========================================
// ACCOUNT PASSWORD TOOLS
// ==========================================
document.addEventListener("DOMContentLoaded", function () {

    const passwordInput = document.getElementById(
        "accountPasswordInput"
    );

    const generateButton = document.getElementById(
        "generateAccountPassword"
    );

    const copyButton = document.getElementById(
        "copyAccountPassword"
    );

    const showButton = document.getElementById(
        "showAccountPassword"
    );

    const evaluateButton = document.getElementById(
        "evaluateAccountPassword"
    );

    const strengthDisplay = document.getElementById(
        "accountPasswordStrength"
    );

    const strengthField = document.getElementById(
        "id_evaluated_password_strength"
    );

    const confirmation = document.getElementById(
        "id_confirm_password_applied"
    );

    const feedback = document.getElementById(
        "accountPasswordFeedback"
    );

    // Stop if this is not an account form.
    if (
        !passwordInput ||
        !generateButton ||
        !copyButton ||
        !showButton ||
        !evaluateButton ||
        !strengthDisplay ||
        !strengthField ||
        !confirmation ||
        !feedback
    ) {
        return;
    }

    // --------------------------------------
    // SECURE RANDOM NUMBER
    // --------------------------------------

    function secureRandomNumber(max) {

        if (!Number.isSafeInteger(max) ||
            max <= 0 ||
            max > 0x100000000) {

            throw new RangeError(
                "Invalid random number range."
            );
        }

        const range = 0x100000000;

        const limit =
            Math.floor(range / max) * max;

        const values = new Uint32Array(1);

        let value;

        do {

            crypto.getRandomValues(values);

            value = values[0];

        } while (value >= limit);

        return value % max;
    }

    // --------------------------------------
    // GENERATE PASSWORD
    // --------------------------------------

    function generateSecurePassword(length = 20) {

        const categories = [
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "abcdefghijklmnopqrstuvwxyz",
            "0123456789",
            "!@#$%^&*()-_=+[]{}?"
        ];

        const allCharacters = categories.join("");

        const characters = [];

        // Include at least one from each category.
        categories.forEach(category => {

            characters.push(
                category[
                    secureRandomNumber(category.length)
                ]
            );

        });

        // Fill remaining positions.
        while (characters.length < length) {

            characters.push(
                allCharacters[
                    secureRandomNumber(allCharacters.length)
                ]
            );

        }

        // Secure Fisher-Yates shuffle.
        for (let i = characters.length - 1; i > 0; i--) {

            const j = secureRandomNumber(i + 1);

            [
                characters[i],
                characters[j]
            ] = [
                characters[j],
                characters[i]
            ];
        }

        return characters.join("");
    }

    // --------------------------------------
    // RESET EVALUATION
    // --------------------------------------

    function resetEvaluation() {

        strengthField.value = "";

        confirmation.checked = false;

        strengthDisplay.textContent = "Not Evaluated";

        strengthDisplay.className =
            "badge bg-secondary";
    }

    // --------------------------------------
    // EVALUATE PASSWORD
    // --------------------------------------

    function evaluateStrength(password) {

        if (!password) {
            return null;
        }

        const length12 = password.length >= 12;
        const length16 = password.length >= 16;

        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        const numbers = /[0-9]/.test(password);

        const symbols = /[^A-Za-z0-9]/.test(
            password
        );

        const lowerPassword = password.toLowerCase();

        const patterns = [
            "password",
            "123456",
            "qwerty",
            "abcdef",
            "letmein",
            "admin",
            "welcome",
            "iloveyou"
        ];

        const hasPattern = patterns.some(pattern =>
            lowerPassword.includes(pattern)
        );

        let score = 0;

        if (length12) {
            score += 25;
        } else {
            score += Math.min(password.length * 2, 20);
        }

        if (length16) score += 15;
        if (uppercase) score += 10;
        if (lowercase) score += 10;
        if (numbers) score += 10;
        if (symbols) score += 10;
        if (!hasPattern) score += 20;

        if (hasPattern) {
            score = Math.min(score, 30);
        }

        if (password.length < 8) {
            score = Math.min(score, 25);
        } else if (password.length < 12) {
            score = Math.min(score, 49);
        }

        score = Math.min(score, 100);

        if (score >= 80) {
            return "Strong";
        }

        if (score >= 50) {
            return "Medium";
        }

        return "Weak";
    }

    // --------------------------------------
    // GENERATE BUTTON
    // --------------------------------------

    generateButton.addEventListener(
        "click",
        function () {

            try {

                passwordInput.value =
                    generateSecurePassword();

                passwordInput.type = "password";

                showButton.textContent = "Show";

                resetEvaluation();

                feedback.textContent =
                    "Password generated. Apply it " +
                    "to your external account before " +
                    "confirming it in SecureMe.";

                feedback.className =
                    "alert alert-info small";

            } catch (error) {

                feedback.textContent =
                    "Password generation failed. " +
                    "Please try again.";

                feedback.className =
                    "alert alert-danger small";
            }
        }
    );

    // --------------------------------------
    // COPY BUTTON
    // --------------------------------------

    copyButton.addEventListener(
        "click",
        async function () {

            if (!passwordInput.value) {

                feedback.textContent =
                    "Generate or enter a password first.";

                return;
            }

            try {

                await navigator.clipboard.writeText(
                    passwordInput.value
                );

                feedback.textContent =
                    "Password copied to clipboard.";

                feedback.className =
                    "alert alert-success small";

            } catch (error) {

                feedback.textContent =
                    "Unable to copy password. " +
                    "Check clipboard permissions.";

                feedback.className =
                    "alert alert-danger small";
            }
        }
    );

    // --------------------------------------
    // SHOW / HIDE BUTTON
    // --------------------------------------

    showButton.addEventListener(
        "click",
        function () {

            const hidden =
                passwordInput.type === "password";

            passwordInput.type =
                hidden ? "text" : "password";

            showButton.textContent =
                hidden ? "Hide" : "Show";
        }
    );

    // --------------------------------------
    // EVALUATE BUTTON
    // --------------------------------------

    evaluateButton.addEventListener(
        "click",
        function () {

            const strength = evaluateStrength(
                passwordInput.value
            );

            if (!strength) {

                feedback.textContent =
                    "Enter or generate a password first.";

                feedback.className =
                    "alert alert-warning small";

                return;
            }

            strengthField.value = strength;

            confirmation.checked = false;

            strengthDisplay.textContent = strength;

            if (strength === "Strong") {

                strengthDisplay.className =
                    "badge bg-success";

            } else if (strength === "Medium") {

                strengthDisplay.className =
                    "badge bg-warning text-dark";

            } else {

                strengthDisplay.className =
                    "badge bg-danger";
            }

            feedback.textContent =
                "Estimated strength: " + strength +
                ". Apply this password to your " +
                "external account before confirming.";

            feedback.className =
                "alert alert-info small";
        }
    );

    // --------------------------------------
    // RESET WHEN PASSWORD CHANGES
    // --------------------------------------

    passwordInput.addEventListener(
        "input",
        resetEvaluation
    );

});