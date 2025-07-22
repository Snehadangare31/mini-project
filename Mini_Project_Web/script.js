console.log("This code is written by Sakshi Biranje");
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    let isEnglish = true;

    function updateLanguage(isEnglish) {
        const elements = document.querySelectorAll('[data-en][data-mr]');
        
        elements.forEach(element => {
            element.textContent = isEnglish ? 
                element.getAttribute('data-en') : 
                element.getAttribute('data-mr');
        });

        const fromInput = document.getElementById('from');
        const toInput = document.getElementById('to');
        
        if (fromInput && toInput) {
            fromInput.placeholder = isEnglish ? 'From' : 'पासून';
            toInput.placeholder = isEnglish ? 'To' : 'पर्यंत';
        }

        languageToggle.textContent = isEnglish ? 'मराठी' : 'English';
    }

    languageToggle.addEventListener('click', () => {
        isEnglish = !isEnglish;
        updateLanguage(isEnglish);
    });

    // Route Search Functionality
    const journeyForm = document.getElementById('journeyForm');
    if (journeyForm) {
        journeyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;

            try {
                const response = await fetch('/api/routes/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ from, to })
                });

                if (!response.ok) throw new Error('Route search failed');

                const routes = await response.json();
                displayRoutes(routes);
            } catch (error) {
                showError('Failed to search routes. Please try again.');
            }
        });
    }

    // News Ticker Functionality
    function initNewsTicker() {
        const newsTicker = document.querySelector('.news-ticker');
        if (!newsTicker) return;

        let newsItems = [
            { en: 'New bus service started from Main Stand to MIDC', 
              mr: 'मुख्य स्थानकापासून एमआयडीसी पर्यंत नवीन बस सेवा सुरू' },
            { en: 'Special passes available for students', 
              mr: 'विद्यार्थ्यांसाठी विशेष पास उपलब्ध' },
            { en: 'Bus tracking system now live', 
              mr: 'बस ट्रॅकिंग सिस्टम आता लाईव्ह' }
        ];

        let currentIndex = 0;
        
        function updateNews() {
            if (newsTicker) {
                newsTicker.textContent = isEnglish ? 
                    newsItems[currentIndex].en : 
                    newsItems[currentIndex].mr;
                currentIndex = (currentIndex + 1) % newsItems.length;
            }
        }

        updateNews();
        setInterval(updateNews, 5000);
    }

    // Bus Tracking Functionality
    function initBusTracking() {
        const trackBusBtn = document.querySelector('.track-bus-btn');
        if (trackBusBtn) {
            trackBusBtn.addEventListener('click', async () => {
                const busNumber = document.getElementById('busNumber').value;
                try {
                    const response = await fetch(`/api/track/${busNumber}`);
                    if (!response.ok) throw new Error('Bus tracking failed');
                    
                    const location = await response.json();
                    updateBusLocation(location);
                } catch (error) {
                    showError('Failed to track bus. Please try again.');
                }
            });
        }
    }

    // Error Display Function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Display Routes Function
    function displayRoutes(routes) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';
        routes.forEach(route => {
            const routeElement = document.createElement('div');
            routeElement.className = 'route-result';
            routeElement.innerHTML = `
                <h3>Route ${route.number}</h3>
                <p>From: ${route.from}</p>
                <p>To: ${route.to}</p>
                <p>Duration: ${route.duration}</p>
                <p>Fare: ₹${route.fare}</p>
                <button onclick="bookTicket(${route.id})">Book Ticket</button>
            `;
            resultsContainer.appendChild(routeElement);
        });
    }

    // Initialize Bus Location Update
    function updateBusLocation(location) {
        const map = document.getElementById('busMap');
        if (map) {
            // Update map marker with new location
            // This would integrate with your chosen map service (Google Maps, Leaflet, etc.)
            console.log('Bus location updated:', location);
        }
    }

    // Ticket Booking Function
    window.bookTicket = function(routeId) {
        // Redirect to booking page or open booking modal
        window.location.href = `/booking.html?route=${routeId}`;
    }

    initNewsTicker();
    initBusTracking();

    function initializeWebSocket() {
        const ws = new WebSocket('ws://your-websocket-server/bus-updates');
        
        ws.onmessage = (event) => {
            const update = JSON.parse(event.data);
            if (update.type === 'location') {
                updateBusLocation(update.data);
            } else if (update.type === 'delay') {
                showBusDelay(update.data);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    function showBusDelay(delayInfo) {
        const notification = document.createElement('div');
        notification.className = 'delay-notification';
        notification.textContent = isEnglish ?
            `Bus ${delayInfo.busNumber} is delayed by ${delayInfo.minutes} minutes` :
            `बस क्रमांक ${delayInfo.busNumber} ${delayInfo.minutes} मिनिटे उशिरा आहे`;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    if (window.location.pathname.includes('track.html')) {
        initializeWebSocket();
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

const languageToggle = document.getElementById('languageToggle');
let isEnglish = true;

function updateLanguage(isEnglish) {
    const elements = document.querySelectorAll('[data-en][data-mr]');
    elements.forEach(element => {
        element.textContent = isEnglish ? 
            element.getAttribute('data-en') : 
            element.getAttribute('data-mr');
    });
    languageToggle.textContent = isEnglish ? 'मराठी' : 'English';
}

languageToggle.addEventListener('click', () => {
    isEnglish = !isEnglish;
    updateLanguage(isEnglish);
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'font-bold');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('text-blue-600', 'font-bold');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); 
});

async function handleSubmit(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const formMessage = document.getElementById("formMessage");

    if (!email || !password) {
        formMessage.textContent = "All fields are required.";
        return false;
    }

    const endpoint = isLogin ? "login/login.php" : "login/register.php";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    formMessage.style.color = result.status === "success" ? "green" : "red";
    formMessage.textContent = result.message;

    if (result.status === "success" && isLogin) {
        setTimeout(() => {
            document.getElementById("loginModal").style.display = "none";
        }, 1500);
    }

    return false;
}
function initNewsTicker() {
    const newsTicker = document.querySelector('.news-ticker');
    if (!newsTicker) return;

    const newsItems = [
        {
            en: 'New bus service started from Main Stand to MIDC',
            mr: 'मुख्य स्थानकापासून एमआयडीसी पर्यंत नवीन बस सेवा सुरू'
        },
        {
            en: 'Special passes available for students',
            mr: 'विद्यार्थ्यांसाठी विशेष पास उपलब्ध'
        },
        {
            en: 'Bus tracking system now live',
            mr: 'बस ट्रॅकिंग सिस्टम आता लाईव्ह'
        }
    ];

    function updateTickerText() {
        const text = newsItems.map(item => isEnglish ? item.en : item.mr).join(' ✦ ');
        newsTicker.textContent = text;
    }

    updateTickerText();

    // Update ticker language when toggled
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            updateTickerText();
        });
    }
}
