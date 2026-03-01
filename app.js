const video1 = document.getElementById('projectVideo1');
const video2 = document.getElementById('projectVideo2');
const video3 = document.getElementById('projectVideo3');

// Sidebar elements //
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon')


const hoverSign = document.querySelector('.hover-sign');
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.querySelector('.contact-status');

const videoList =[video1, video2, video3];

videoList.forEach (function(video){
    video.addEventListener("mouseover", function(){
        video.play()
        hoverSign.classList.add("active")
    })
    video.addEventListener("mouseout", function(){
    video.pause();
    hoverSign.classList.remove("active")
})
})

// Sidebar elements //
menu.addEventListener("click", function(){
    sideBar.classList.remove("close-sidebar")
    sideBar.classList.add("open-sidebar")
});

closeIcon.addEventListener("click", function(){
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
    
})

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
