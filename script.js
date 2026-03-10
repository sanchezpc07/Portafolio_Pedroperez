/* 
  JavaScript for Pedro Pérez | Consultor Empresarial
  Functionality: Form Validation, Navigation, Simple Animations
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Menu Toggle (Mobile)
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = 'var(--header-height)';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = 'var(--shadow-lg)';
                navLinks.style.zIndex = '1000';
            }
        });
    }

    // 2. Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            let isValid = true;
            
            // Validate Name
            if (!nombre) {
                showError('nombreError', 'Por favor ingrese su nombre completo');
                isValid = false;
            }
            
            // Validate Email
            if (!correo) {
                showError('correoError', 'Por favor ingrese su correo electrónico');
                isValid = false;
            } else if (!isValidEmail(correo)) {
                showError('correoError', 'Correo electrónico no válido');
                isValid = false;
            }
            
            // Validate Message
            if (!mensaje) {
                showError('mensajeError', 'Por favor escriba su mensaje');
                isValid = false;
            }
            
            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                
                submitBtn.disabled = true;
                submitBtn.innerText = 'Enviando...';
                
                const formData = new FormData(contactForm);
                
                fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        formStatus.innerText = '¡Gracias por su mensaje! Nos pondremos en contacto pronto.';
                        formStatus.className = 'form-status success';
                        contactForm.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                formStatus.innerText = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                formStatus.innerText = "¡Vaya! Hubo un problema al enviar el formulario.";
                            }
                            formStatus.className = 'form-status error';
                        })
                    }
                })
                .catch(error => {
                    formStatus.innerText = "¡Vaya! Hubo un problema al enviar el formulario.";
                    formStatus.className = 'form-status error';
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                });
            }
        });
    }

    // Helper: Show error messages
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.innerText = message;
        }
    }

    // Helper: Clear error messages
    function clearErrors() {
        const errors = document.querySelectorAll('.error-msg');
        errors.forEach(err => err.innerText = '');
        formStatus.className = 'form-status';
        formStatus.innerText = '';
    }

    // Helper: Email validation regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 4. Reveal on Scroll (Basic Animation)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to sections/cards
    document.querySelectorAll('.service-card, .about-container, .contact-wrapper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Handle Reveal Logic (Actually defining the class behavior in JS or CSS)
    // Adding class styles dynamically or rely on CSS
});

// Adding revealed styles to the head tag (CSS equivalent)
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
