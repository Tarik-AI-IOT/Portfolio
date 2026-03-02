const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon')
const sidebarLinks = document.querySelectorAll('.sidebar ul a');


const hoverSign = document.querySelector('.hover-sign');
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-status');

const projectVideos = [video1, video2, video3].filter(Boolean);
const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

function prepareInlineVideo(video) {
    video.muted = true;
    video.controls = false;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
}

function safePlay(video) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
    }
}

projectVideos.forEach(prepareInlineVideo);

if (isTouchDevice) {
    if (hoverSign) {
        hoverSign.classList.add("active");
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                    safePlay(entry.target);
                } else {
                    entry.target.pause();
                }
            });
        }, { rootMargin: "160px 0px", threshold: [0.05, 0.2, 0.5] });

        projectVideos.forEach(function (video) {
            observer.observe(video);
        });
    } else {
        projectVideos.forEach(safePlay);
    }

    projectVideos.forEach(function (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                safePlay(video);
            } else {
                video.pause();
            }
        });
    });
} else {
    projectVideos.forEach(function (video) {
        video.addEventListener("mouseover", function () {
            safePlay(video);
            if (hoverSign) {
                hoverSign.classList.add("active");
            }
        });
        video.addEventListener("mouseout", function () {
            video.pause();
            if (hoverSign) {
                hoverSign.classList.remove("active");
            }
        });
    });
}

const autoPlayVideos = Array.from(document.querySelectorAll("video[autoplay]"));
autoPlayVideos.forEach(prepareInlineVideo);

function kickstartAutoPlayVideos() {
    autoPlayVideos.forEach(function (video) {
        if (video.paused) {
            safePlay(video);
        }
    });
}

kickstartAutoPlayVideos();
setTimeout(kickstartAutoPlayVideos, 300);
setTimeout(kickstartAutoPlayVideos, 1200);
setTimeout(kickstartAutoPlayVideos, 2500);
window.addEventListener("pointerdown", kickstartAutoPlayVideos, { once: true, passive: true });
window.addEventListener("touchstart", kickstartAutoPlayVideos, { once: true, passive: true });
window.addEventListener("pageshow", kickstartAutoPlayVideos);

document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        kickstartAutoPlayVideos();
    }
});

function closeSidebar() {
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
}

// Sidebar elements //
menu.addEventListener("click", function(){
    sideBar.classList.remove("close-sidebar")
    sideBar.classList.add("open-sidebar")
});

closeIcon.addEventListener("click", function(){
    closeSidebar();
})

sidebarLinks.forEach(function(link){
    link.addEventListener("click", function(){
        closeSidebar();
    });
});

if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", async function(event){
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonContent = submitButton ? submitButton.innerHTML : "";

        contactStatus.textContent = "";
        contactStatus.classList.remove("show", "success", "error");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "Sending...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method || "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                contactStatus.textContent = "Message sent successfully.";
                contactStatus.classList.add("show", "success");
                contactForm.reset();
            } else {
                contactStatus.textContent = "Something went wrong. Please try again.";
                contactStatus.classList.add("show", "error");
            }
        } catch (error) {
            contactStatus.textContent = "Something went wrong. Please try again.";
            contactStatus.classList.add("show", "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            }
        }
    });
}
