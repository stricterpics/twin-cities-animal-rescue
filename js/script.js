// ===== Help Selector Data =====
// Each object describes one way to get involved.
// The "id" matches the data-option value on each button in services.html.
const helpOptions = [
    {
        id: "adopt",
        title: "Adopt a Pet",
        commitment: "Lifelong",
        description: "Give a rescued animal a permanent, loving home.",
        requirements: [
            "Be 21 or older",
            "Complete an adoption application",
            "Meet your new pet at our adoption center"
        ],
        nextStep: "Submit an interest form and we'll match you with available pets."
    },
    {
        id: "foster",
        title: "Become a Foster",
        commitment: "2 to 8 weeks per animal",
        description: "Provide a temporary home while an animal waits for adoption.",
        requirements: [
            "A safe, quiet space in your home",
            "Ability to bring your foster to vet visits",
            "Completion of a short foster orientation"
        ],
        nextStep: "Submit an interest form to be added to our foster list."
    },
    {
        id: "volunteer",
        title: "Volunteer With Us",
        commitment: "As little as 2 hours per week",
        description: "Help with animal care, events, and daily shelter operations.",
        requirements: [
            "Be 16 or older (under 18 needs guardian consent)",
            "Attend one volunteer orientation",
            "Commit to a regular weekly shift"
        ],
        nextStep: "Submit an interest form and we'll contact you about orientation dates."
    }
];

// ===== Help Selector Functions =====

// Find the option object that matches a given id
function findOption(id) {
    return helpOptions.find(function (option) {
        return option.id === id;
    });
}

// Build the HTML for one option and display it in the result box
function renderOption(option) {
    const resultBox = document.getElementById("selector-result");

    const requirementsList = option.requirements.map(function (item) {
        return "<li>" + item + "</li>";
    }).join("");

    resultBox.innerHTML =
        "<h3>" + option.title + "</h3>" +
        "<p>" + option.description + "</p>" +
        "<p><strong>Time commitment:</strong> " + option.commitment + "</p>" +
        "<h4>What you'll need</h4>" +
        "<ul>" + requirementsList + "</ul>" +
        "<p>" + option.nextStep + "</p>" +
        '<a href="contact.html" class="selector-cta">Get Started</a>';
}

// Highlight the clicked button and un-highlight the others
function setActiveButton(id) {
    const buttons = document.querySelectorAll(".selector-btn");

    buttons.forEach(function (button) {
        if (button.dataset.option === id) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// ===== Browser Storage =====
const STORAGE_KEY = "helpInterest";

// Save the chosen option id to localStorage
function saveChoice(id) {
    localStorage.setItem(STORAGE_KEY, id);
}

// Get the saved option id (returns null if nothing is saved)
function loadChoice() {
    return localStorage.getItem(STORAGE_KEY);
}

// Run everything that happens when an option is chosen
function selectOption(id) {
    const option = findOption(id);

    if (option) {
        renderOption(option);
        setActiveButton(id);
        saveChoice(id);
    }
}

// Attach click listeners to the buttons and restore any saved choice
function initSelector() {
    const buttons = document.querySelectorAll(".selector-btn");

    // Stop here if this page has no selector (e.g., contact.html)
    if (buttons.length === 0) {
        return;
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectOption(button.dataset.option);
        });
    });

    // Load the user's previous choice, if there is one
    const savedChoice = loadChoice();
    if (savedChoice) {
        selectOption(savedChoice);
    }
}

// Start the selector
initSelector();

// ===== Form Validation Data =====
// Each object describes the rules for one field in contact.html.
// The "id" matches the id of the input, select, or textarea.
const validationRules = [
    {
        id: "full-name",
        requiredMessage: "Please enter your name.",
        minLength: 2,
        minLengthMessage: "Your name must be at least 2 characters."
    },
    {
        id: "email",
        requiredMessage: "Please enter your email address.",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: "Please enter a valid email address, like name@example.com."
    },
    {
        id: "interest-type",
        requiredMessage: "Please choose how you'd like to help."
    },
    {
        id: "availability",
        requiredMessage: "Please tell us when you are available.",
        minLength: 3,
        minLengthMessage: "Please enter at least 3 characters."
    },
    {
        id: "message",
        requiredMessage: "Please write a short message.",
        minLength: 10,
        minLengthMessage: "Your message must be at least 10 characters."
    }
];

// Maps the saved selector choice to the matching Interest Type option value
const interestValues = {
    adopt: "adoption-info",
    foster: "foster",
    volunteer: "volunteer"
};

// ===== Form Validation Functions =====

// Return an error message for one field, or "" if the value is valid
function getFieldError(rule, value) {
    const text = value.trim();

    if (text === "") {
        return rule.requiredMessage;
    }
    if (rule.minLength && text.length < rule.minLength) {
        return rule.minLengthMessage;
    }
    if (rule.pattern && !rule.pattern.test(text)) {
        return rule.patternMessage;
    }
    return "";
}

// Show an error message directly below a field
function showError(field, message) {
    let errorBox = document.getElementById(field.id + "-error");

    if (!errorBox) {
        errorBox = document.createElement("span");
        errorBox.id = field.id + "-error";
        errorBox.className = "error-message";
        field.insertAdjacentElement("afterend", errorBox);
    }

    errorBox.textContent = message;
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorBox.id);
}

// Remove a field's error message and invalid styling
function clearError(field) {
    const errorBox = document.getElementById(field.id + "-error");

    if (errorBox) {
        errorBox.remove();
    }
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
}

// Check one field and show or clear its error. Returns true if valid.
function validateField(rule) {
    const field = document.getElementById(rule.id);
    const message = getFieldError(rule, field.value);

    if (message) {
        showError(field, message);
        return false;
    }
    clearError(field);
    return true;
}

// Check every field. Returns the first invalid field, or null if all are valid.
function validateForm() {
    let firstInvalid = null;

    validationRules.forEach(function (rule) {
        if (!validateField(rule) && !firstInvalid) {
            firstInvalid = document.getElementById(rule.id);
        }
    });

    return firstInvalid;
}

// Handle the form being submitted
function handleSubmit(event) {
    event.preventDefault();

    const success = document.getElementById("form-success");
    const firstInvalid = validateForm();

    if (firstInvalid) {
        success.textContent = "";
        firstInvalid.focus();
        return;
    }

    success.textContent = "Thank you! Your interest form has been received.";
    event.target.reset();
}

// Pre-select the Interest Type using the choice saved on the services page
function prefillInterest() {
    const savedChoice = loadChoice();
    const dropdown = document.getElementById("interest-type");

    if (savedChoice !== null && interestValues[savedChoice]) {
        dropdown.value = interestValues[savedChoice];
    }
}

// Attach validation to the contact form
function initForm() {
    const form = document.getElementById("interest-form");

    // Stop here if this page has no form (e.g., services.html)
    if (!form) {
        return;
    }

    form.addEventListener("submit", handleSubmit);

    // Re-check a field as the user fixes it, and clear the thank-you message
    validationRules.forEach(function (rule) {
        const field = document.getElementById(rule.id);
        const eventName = field.tagName === "SELECT" ? "change" : "input";

        field.addEventListener(eventName, function () {
            document.getElementById("form-success").textContent = "";
            if (field.classList.contains("invalid")) {
                validateField(rule);
            }
        });
    });

    prefillInterest();
}

// Start the form validation
initForm();

// ===== Impact Number Counters =====

// Count an element's number up from 0 to its target over a short time
function animateCount(element, target) {
    const duration = 1500;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        // Ease out so the count slows down as it nears the target
        const eased = 1 - Math.pow(1 - progress, 3);

        element.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Start each .number at 0 and count up the first time it scrolls into view
function initCounters() {
    const counters = document.querySelectorAll(".number");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Stop here if this page has no counters, or the browser can't watch scrolling
    // or the user prefers no motion (the final numbers stay as written in the HTML)
    if (counters.length === 0 || reduceMotion || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target, entry.target.dataset.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) {
        counter.dataset.target = parseInt(counter.textContent, 10);
        counter.textContent = "0";
        observer.observe(counter);
    });
}

// Start the counters
initCounters();
