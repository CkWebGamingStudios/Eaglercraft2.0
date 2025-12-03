(function () {
    const token = localStorage.getItem("token");

    // No token → redirect to login
    if (!token) {
        window.location.href = "/src/pages/login.html";
        return;
    }

    // OPTIONAL: verify token with backend
    fetch("/api/verify", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => {
        if (!res.ok) {
            // Invalid / expired token → logout user
            localStorage.removeItem("token");
            window.location.href = "/src/pages/login.html";
        }
    })
    .catch(() => {
        // If network error → still protect the page
        localStorage.removeItem("token");
        window.location.href = "/src/pages/login.html";
    });
})();
