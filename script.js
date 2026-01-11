document.addEventListener("DOMContentLoaded", () => {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const loader = document.querySelector(".loader");

    // 1. Cursor Engine
    window.addEventListener("mousemove", (e) => {
        const { clientX: x, clientY: y } = e;
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        cursorOutline.animate({ left: `${x}px`, top: `${y}px` }, { duration: 400, fill: "forwards" });
        document.body.style.setProperty('--x', `${x}px`);
        document.body.style.setProperty('--y', `${y}px`);
    });

    // 2. Preloader
    window.addEventListener("load", () => {
        setTimeout(() => { loader.style.transform = "translateY(-100%)"; }, 1000);
    });

    // 3. Scroll Controller (Progress Bar & Sticky About)
    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        document.querySelector(".scroll-progress").style.width = `${(scrollPos / totalHeight) * 100}%`;

        // Sticky "About" Math Logic
        const stickySection = document.querySelector('.about-sticky');
        if (stickySection) {
            const stickyTop = stickySection.offsetTop;
            const stickyHeight = stickySection.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            const relativeScroll = scrollPos - stickyTop;
            const scrollRange = stickyHeight - viewportHeight;
            const progress = Math.max(0, Math.min(1, relativeScroll / scrollRange));

            const contents = document.querySelectorAll('.sticky-content');
            const stepSize = 1 / contents.length;

            contents.forEach((content, index) => {
                const start = index * stepSize;
                const end = (index + 1) * stepSize;
                if (progress >= start && progress < end) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
    });

    // 4. Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".section-reveal").forEach(el => revealObserver.observe(el));

    // 5. Magnetic Hover Effects
    document.querySelectorAll(".magnetic").forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = "translate(0, 0)"; });
    });

    // 6. Back To Top
    document.querySelector('.back-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Global Video Modal Functions
function openVideo(videoId, isShort) {
    const modal = document.getElementById("videoModal");
    const player = document.getElementById("videoPlayer");
    const content = document.getElementById("modalContent");
    if (isShort) content.classList.add("is-short");
    else content.classList.remove("is-short");
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeVideo() {
    const modal = document.getElementById("videoModal");
    const player = document.getElementById("videoPlayer");
    player.src = "";
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    const modal = document.getElementById("videoModal");
    if (event.target == modal) { closeVideo(); }
}