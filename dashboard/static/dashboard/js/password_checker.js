"use strict";

// PHASE 5 - SECUREME PASSWORD STRENGTH CHECKER

// GET HTML ELEMENTS
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const clearPassword = document.getElementById("clearPassword");

const strengthLabel = document.getElementById("strengthLabel");
const strengthBar = document.getElementById("strengthBar");
const strengthProgress = document.getElementById("strengthProgress");

const passwordFeedback = document.getElementById("passwordFeedback");

// SECURITY CHECK ELEMENTS
const checks = {
    length12: document.getElementById("length12"),
    length16: document.getElementById("length16"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    numbers: document.getElementById("numbers"),
    special: document.getElementById("special"),
    patterns: document.getElementById("patterns")
};


// CHECK FOR SOME OBVIOUS PASSWORD PATTERNS
function hasObviousPattern(password) {

    const lowerPassword = password.toLowerCase();

    const commonPatterns = [
        "password",
        "123456",
        "qwerty",
        "abcdef",
        "letmein",
        "admin",
        "welcome",
        "iloveyou"
    ];

    return commonPatterns.some(pattern =>
        lowerPassword.includes(pattern)
    );
}


// UPDATE INDIVIDUAL SECURITY CHECK
function updateCheck(element, passed) {

    element.textContent = passed ? "✓" : "✗";

    element.className = passed
        ? "text-success fw-bold"
        : "text-danger fw-bold";
}


// UPDATE THE STRENGTH DISPLAY
function updateStrengthDisplay(score, label, color) {

    strengthLabel.textContent = label;
    strengthLabel.className = `badge bg-${color}`;

    strengthBar.style.width = `${score}%`;
    strengthBar.className = `progress-bar bg-${color}`;

    strengthProgress.setAttribute(
        "aria-valuenow",
        String(score)
    );
}


// RESET THE CHECKER
function resetChecker() {

    strengthLabel.textContent = "Not Evaluated";
    strengthLabel.className = "badge bg-secondary";

    strengthBar.style.width = "0%";
    strengthBar.className = "progress-bar bg-secondary";

    strengthProgress.setAttribute("aria-valuenow", "0");

    passwordFeedback.textContent =
        "Enter a proposed password to receive security feedback.";

    passwordFeedback.className = "alert alert-secondary";

    Object.values(checks).forEach(element => {
        element.textContent = "—";
        element.className = "text-muted";
    });
}


// EVALUATE PASSWORD
function evaluatePassword() {

    const password = passwordInput.value;

    // HANDLE EMPTY PASSWORD
    if (password.length === 0) {
        resetChecker();
        return;
    }

    // SECURITY CHECKS
    const results = {

        length12: password.length >= 12,

        length16: password.length >= 16,

        uppercase: /[A-Z]/.test(password),

        lowercase: /[a-z]/.test(password),

        numbers: /[0-9]/.test(password),

        special: /[^A-Za-z0-9]/.test(password),

        patterns: !hasObviousPattern(password)
    };

    // DISPLAY INDIVIDUAL RESULTS
    Object.keys(results).forEach(key => {
        updateCheck(checks[key], results[key]);
    });

    // CALCULATE EDUCATIONAL STRENGTH SCORE
    let score = 0;

    if (results.length12) {
        score += 25;
    } else {
        score += Math.min(password.length * 2, 20);
    }

    if (results.length16) {
        score += 15;
    }

    if (results.uppercase) {
        score += 10;
    }

    if (results.lowercase) {
        score += 10;
    }

    if (results.numbers) {
        score += 10;
    }

    if (results.special) {
        score += 10;
    }

    if (results.patterns) {
        score += 20;
    }

    // PENALIZE OBVIOUS PATTERNS
    if (!results.patterns) {
        score = Math.min(score, 30);
    }

    // CAP SHORT PASSWORDS
    if (password.length < 8) {
        score = Math.min(score, 25);
    } else if (password.length < 12) {
        score = Math.min(score, 49);
    }

    score = Math.min(score, 100);

    // DETERMINE STRENGTH LEVEL
    let label;
    let color;
    let feedback;

    if (score >= 80) {

        label = "Strong";
        color = "success";

        feedback =
            "This proposed password meets several recommended " +
            "characteristics. Use a unique password for every account.";

    } else if (score >= 50) {

        label = "Moderate";
        color = "warning";

        feedback =
            "Consider increasing the length and avoiding " +
            "predictable words or patterns.";

    } else {

        label = "Weak";
        color = "danger";

        feedback =
            "This proposed password needs improvement. " +
            "Try a longer, randomly generated password.";
    }

    updateStrengthDisplay(score, label, color);

    passwordFeedback.textContent = feedback;

    passwordFeedback.className =
        `alert alert-${color === "warning" ? "warning" : color === "success" ? "success" : "danger"}`;
}


// EVALUATE WHILE USER TYPES
passwordInput.addEventListener("input", evaluatePassword);


// SHOW OR HIDE PASSWORD
togglePassword.addEventListener("click", function () {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePassword.textContent = isHidden ? "Hide" : "Show";

    togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
    );

    togglePassword.setAttribute(
        "aria-pressed",
        String(isHidden)
    );
});


// CLEAR PASSWORD
clearPassword.addEventListener("click", function () {

    passwordInput.value = "";
    passwordInput.type = "password";

    togglePassword.textContent = "Show";
    togglePassword.setAttribute(
        "aria-label",
        "Show password"
    );
    togglePassword.setAttribute(
        "aria-pressed",
        "false"
    );

    resetChecker();

    passwordInput.focus();
});


// INITIALIZE
resetChecker();

// GET PASSWORD GENERATOR ELEMENTS

const passwordLength = document.getElementById(
    "passwordLength"
);

const passwordLengthValue = document.getElementById(
    "passwordLengthValue"
);

const includeUppercase = document.getElementById(
    "includeUppercase"
);

const includeLowercase = document.getElementById(
    "includeLowercase"
);

const includeNumbers = document.getElementById(
    "includeNumbers"
);

const includeSymbols = document.getElementById(
    "includeSymbols"
);

const generatedPassword = document.getElementById(
    "generatedPassword"
);

const generatePasswordButton = document.getElementById(
    "generatePassword"
);

const copyPasswordButton = document.getElementById(
    "copyGeneratedPassword"
);

const toggleGeneratedPassword = document.getElementById(
    "toggleGeneratedPassword"
);

const checkGeneratedPasswordButton = document.getElementById(
    "checkGeneratedPassword"
);

const generatorFeedback = document.getElementById(
    "generatorFeedback"
);


// =============================================
// CHARACTER SETS
// =============================================

const uppercaseCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const lowercaseCharacters =
    "abcdefghijklmnopqrstuvwxyz";

const numberCharacters =
    "0123456789";

const symbolCharacters =
    "!@#$%^&*()-_=+[]{}?";


// =============================================
// CRYPTOGRAPHICALLY SECURE RANDOM INTEGER
// =============================================

function secureRandomNumber(max) {

    if (!Number.isSafeInteger(max) || max <= 0) {
        throw new RangeError(
            "Maximum must be a positive safe integer."
        );
    }

    // This generator uses small character sets.
    // Reject values outside the supported range.
    if (max > 0x100000000) {
        throw new RangeError(
            "Maximum exceeds the supported range."
        );
    }

    const range = 0x100000000;

    // Reject values that would introduce modulo bias.
    const limit = Math.floor(range / max) * max;

    const randomArray = new Uint32Array(1);

    let randomValue;

    do {

        crypto.getRandomValues(randomArray);

        randomValue = randomArray[0];

    } while (randomValue >= limit);

    return randomValue % max;
}


// =============================================
// SELECT ONE SECURE RANDOM CHARACTER
// =============================================

function secureRandomCharacter(characterSet) {

    const randomIndex = secureRandomNumber(
        characterSet.length
    );

    return characterSet[randomIndex];
}


// =============================================
// SECURELY SHUFFLE PASSWORD CHARACTERS
// =============================================

function secureShuffle(characters) {

    // Fisher-Yates shuffle
    for (let i = characters.length - 1; i > 0; i--) {

        const randomIndex = secureRandomNumber(i + 1);

        // Swap characters
        [
            characters[i],
            characters[randomIndex]
        ] = [
            characters[randomIndex],
            characters[i]
        ];
    }

    return characters;
}


// =============================================
// GENERATE SECURE PASSWORD
// =============================================

function createSecurePassword() {

    const length = Number(passwordLength.value);

    // VALIDATE LENGTH
    if (!Number.isInteger(length) ||
        length < 12 ||
        length > 64) {

        throw new Error(
            "Password length must be between 12 and 64."
        );
    }

    // COLLECT SELECTED CHARACTER SETS
    const selectedSets = [];

    if (includeUppercase.checked) {
        selectedSets.push(uppercaseCharacters);
    }

    if (includeLowercase.checked) {
        selectedSets.push(lowercaseCharacters);
    }

    if (includeNumbers.checked) {
        selectedSets.push(numberCharacters);
    }

    if (includeSymbols.checked) {
        selectedSets.push(symbolCharacters);
    }

    // REQUIRE AT LEAST ONE CHARACTER CATEGORY
    if (selectedSets.length === 0) {

        throw new Error(
            "Select at least one character category."
        );
    }

    // COMBINE ALL SELECTED CHARACTERS
    const allCharacters = selectedSets.join("");

    // PASSWORD ARRAY
    const passwordCharacters = [];

    // GUARANTEE ONE CHARACTER FROM EACH SELECTED SET
    selectedSets.forEach(characterSet => {

        passwordCharacters.push(
            secureRandomCharacter(characterSet)
        );

    });

    // FILL REMAINING PASSWORD LENGTH
    while (passwordCharacters.length < length) {

        passwordCharacters.push(
            secureRandomCharacter(allCharacters)
        );

    }

    // SHUFFLE TO AVOID PREDICTABLE CHARACTER POSITIONS
    secureShuffle(passwordCharacters);

    // RETURN PASSWORD
    return passwordCharacters.join("");
}


// =============================================
// DISPLAY GENERATOR FEEDBACK
// =============================================

function updateGeneratorFeedback(message, type) {

    generatorFeedback.textContent = message;

    generatorFeedback.className =
        `alert alert-${type} small`;
}


// =============================================
// GENERATE PASSWORD BUTTON
// =============================================

generatePasswordButton.addEventListener(
    "click",
    function () {

        try {

            const newPassword = createSecurePassword();

            generatedPassword.value = newPassword;

            // HIDE PASSWORD BY DEFAULT
            generatedPassword.type = "password";

            toggleGeneratedPassword.textContent = "Show";

            toggleGeneratedPassword.setAttribute(
                "aria-label",
                "Show generated password"
            );

            toggleGeneratedPassword.setAttribute(
                "aria-pressed",
                "false"
            );

            updateGeneratorFeedback(
                "Secure password generated successfully.",
                "success"
            );

        } catch (error) {

            generatedPassword.value = "";

            updateGeneratorFeedback(
                error.message,
                "danger"
            );
        }

    }
);


// =============================================
// UPDATE PASSWORD LENGTH DISPLAY
// =============================================

passwordLength.addEventListener(
    "input",
    function () {

        passwordLengthValue.textContent =
            passwordLength.value;

    }
);


// =============================================
// SHOW / HIDE GENERATED PASSWORD
// =============================================

toggleGeneratedPassword.addEventListener(
    "click",
    function () {

        const isHidden =
            generatedPassword.type === "password";

        generatedPassword.type =
            isHidden ? "text" : "password";

        toggleGeneratedPassword.textContent =
            isHidden ? "Hide" : "Show";

        toggleGeneratedPassword.setAttribute(
            "aria-label",
            isHidden
                ? "Hide generated password"
                : "Show generated password"
        );

        toggleGeneratedPassword.setAttribute(
            "aria-pressed",
            String(isHidden)
        );

    }
);


// =============================================
// COPY GENERATED PASSWORD
// =============================================

copyPasswordButton.addEventListener(
    "click",
    async function () {

        const password = generatedPassword.value;

        if (!password) {

            updateGeneratorFeedback(
                "Generate a password before copying.",
                "warning"
            );

            return;
        }

        try {

            await navigator.clipboard.writeText(password);

            updateGeneratorFeedback(
                "Password copied to clipboard. " +
                "Remember to protect your clipboard.",
                "success"
            );

        } catch (error) {

            updateGeneratorFeedback(
                "Unable to copy automatically. " +
                "Check browser clipboard permissions.",
                "danger"
            );
        }

    }
);


// =============================================
// CHECK GENERATED PASSWORD STRENGTH
// =============================================

checkGeneratedPasswordButton.addEventListener(
    "click",
    function () {

        const password = generatedPassword.value;

        if (!password) {

            updateGeneratorFeedback(
                "Generate a password first.",
                "warning"
            );

            return;
        }

        // COPY PASSWORD INTO THE EXISTING CHECKER
        passwordInput.value = password;

        // EVALUATE USING LESSON 1 FUNCTION
        evaluatePassword();

        // SCROLL TO PASSWORD CHECKER
        passwordInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        updateGeneratorFeedback(
            "Generated password sent to the " +
            "local strength checker.",
            "success"
        );

    }
);