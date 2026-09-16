let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;
let videoPlayed = false;

const video = document.getElementById('intro-video');
const playButton = document.getElementById('play-button');
const videoOverlay = document.getElementById('video-overlay');
const videoContainer = document.getElementById('video-container');
const videoControls = document.getElementById('video-controls');
const videoProgress = document.getElementById('video-progress');
const videoTime = document.getElementById('video-time');
const pauseIcon = document.getElementById('pause-icon');

function init() {
    updateSlideCounter();
    updateProgressFill();
    createSlideDots();
    updateNavButtons();
    updateSlideDots();

    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('timeupdate', onVideoTimeUpdate);
    video.addEventListener('play', onVideoPlay);
    video.addEventListener('pause', onVideoPause);

    document.addEventListener('keydown', handleKeydown);
}

function handleKeydown(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentSlide === 1 && !videoPlayed && video.paused) {
            playVideo();
        } else {
            nextSlide();
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Escape') {
        const modal1 = document.getElementById('image-modal');
        const modal2 = document.getElementById('image-modal-2');
        if (modal1 && modal1.classList.contains('active')) {
            closeImageModal();
        } else if (modal2 && modal2.classList.contains('active')) {
            closeImageModal2();
        } else if (document.getElementById('image-modal-3') && document.getElementById('image-modal-3').classList.contains('active')) {
            closeUnderstandModal();
        } else if (document.fullscreenElement) {
            exitFullscreen();
        }
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
}

function playVideo() {
    playButton.style.display = 'none';
    videoOverlay.style.opacity = '0';
    videoControls.style.display = 'flex';

    video.play().then(() => {
        videoPlayed = true;
    }).catch(err => {
        console.log('Video play error:', err);
        playButton.style.display = 'flex';
        videoOverlay.style.opacity = '1';
        videoControls.style.display = 'none';
    });
}

function toggleVideoPause() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function onVideoPlay() {
    pauseIcon.innerHTML = '<path fill="#ffffff" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
}

function onVideoPause() {
    pauseIcon.innerHTML = '<path fill="#ffffff" d="M8 5v14l11-7z"/>';
}

function skipVideo() {
    video.pause();
    onVideoEnded();
}

function onVideoEnded() {
    videoPlayed = true;
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        exitFullscreen();
    }
    pauseVideoControls();
    setTimeout(() => {
        nextSlide();
    }, 600);
}

function pauseVideoControls() {
    videoControls.style.opacity = '0.3';
    setTimeout(() => {
        videoControls.style.display = 'none';
    }, 500);
}

function onVideoTimeUpdate() {
    if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        videoProgress.style.width = progress + '%';

        const mins = Math.floor(video.currentTime / 60);
        const secs = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
        videoTime.textContent = mins + ':' + secs;
    }
}

function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > totalSlides) return;

    if (slideNum === currentSlide) return;

    const oldSlide = document.querySelector('.slide[data-slide="' + currentSlide + '"]');
    const newSlide = document.querySelector('.slide[data-slide="' + slideNum + '"]');

    oldSlide.classList.remove('active');
    if (slideNum > currentSlide) {
        oldSlide.classList.add('slide-left');
    } else {
        oldSlide.classList.add('slide-right');
    }

    newSlide.classList.add('active');
    newSlide.classList.remove('slide-left', 'slide-right');

    currentSlide = slideNum;

    if (currentSlide !== 1) {
        video.pause();
    }

    updateSlideCounter();
    updateProgressFill();
    updateSlideDots();
    updateNavButtons();

    setTimeout(() => {
        oldSlide.classList.remove('slide-left', 'slide-right');
    }, 500);
}

function nextSlide() {
    if (currentSlide === 1 && !videoPlayed) {
        if (video.paused) {
            playVideo();
            return;
        }
    }
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('total-slides').textContent = totalSlides;
}

function updateProgressFill() {
    const pct = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
}

function createSlideDots() {
    const dotsContainer = document.getElementById('slide-dots');
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slide-dot';
        dot.setAttribute('data-slide', i);
        dot.setAttribute('aria-label', 'Go to slide ' + i);
        dot.onclick = function() {
            goToSlide(parseInt(this.getAttribute('data-slide')));
        };
        dotsContainer.appendChild(dot);
    }
}

function updateSlideDots() {
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, i) => {
        if (i + 1 === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
}

function goHome() {
    window.location.href = '../index.html';
}

function toggleFullscreen() {
    const container = document.querySelector('.presentation-container');
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    try {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } catch (e) {
        console.log('Exit fullscreen error:', e);
    }
}

let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slides-wrapper').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.querySelector('.slides-wrapper').addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

function openImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal(event) {
    if (event && event.target && event.target.closest('.image-modal-content') && !event.target.closest('.image-modal-close')) {
        return;
    }
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openImageModal2() {
    const modal = document.getElementById('image-modal-2');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal2(event) {
    if (event && event.target && event.target.closest('.image-modal-content') && !event.target.closest('.image-modal-close')) {
        return;
    }
    const modal = document.getElementById('image-modal-2');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Slide 4: Interview Video =====
const interviewVideo = document.getElementById('interview-video');
const interviewPlayBtn = document.getElementById('interview-play-button');
const interviewOverlay = document.getElementById('interview-video-overlay');
const interviewControls = document.getElementById('interview-video-controls');
const interviewProgress = document.getElementById('interview-video-progress');
const interviewTime = document.getElementById('interview-video-time');
const interviewPauseIcon = document.getElementById('interview-pause-icon');
const interviewContainer = document.getElementById('interview-video-container');

function playInterviewVideo() {
    if (!interviewVideo) return;
    interviewPlayBtn.style.display = 'none';
    interviewOverlay.style.opacity = '0';
    interviewControls.style.display = 'flex';
    interviewVideo.play().catch(function(err) {
        console.log('Interview video play error:', err);
        interviewPlayBtn.style.display = 'flex';
        interviewOverlay.style.opacity = '1';
        interviewControls.style.display = 'none';
    });
}

function toggleInterviewPause() {
    if (!interviewVideo) return;
    if (interviewVideo.paused) {
        interviewVideo.play();
    } else {
        interviewVideo.pause();
    }
}

function toggleInterviewFullscreen() {
    if (!interviewContainer) return;
    if (!document.fullscreenElement) {
        if (interviewContainer.requestFullscreen) {
            interviewContainer.requestFullscreen();
        } else if (interviewContainer.webkitRequestFullscreen) {
            interviewContainer.webkitRequestFullscreen();
        } else if (interviewContainer.msRequestFullscreen) {
            interviewContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

if (interviewVideo) {
    interviewVideo.addEventListener('play', function() {
        if (interviewPauseIcon) {
            interviewPauseIcon.innerHTML = '<path fill="#ffffff" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        }
    });
    interviewVideo.addEventListener('pause', function() {
        if (interviewPauseIcon) {
            interviewPauseIcon.innerHTML = '<path fill="#ffffff" d="M8 5v14l11-7z"/>';
        }
    });
    interviewVideo.addEventListener('timeupdate', function() {
        if (interviewVideo.duration && interviewProgress && interviewTime) {
            var pct = (interviewVideo.currentTime / interviewVideo.duration) * 100;
            interviewProgress.style.width = pct + '%';
            var mins = Math.floor(interviewVideo.currentTime / 60);
            var secs = Math.floor(interviewVideo.currentTime % 60).toString().padStart(2, '0');
            interviewTime.textContent = mins + ':' + secs;
        }
    });
    interviewVideo.addEventListener('ended', function() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            exitFullscreen();
        }
        interviewControls.style.opacity = '0.3';
        setTimeout(function() {
            interviewControls.style.display = 'none';
            interviewOverlay.style.opacity = '1';
            interviewPlayBtn.style.display = 'flex';
            interviewVideo.currentTime = 0;
            // Auto-advance to next slide after interview video ends
            _origGoToSlide(5);
        }, 600);
    });
}

// Pause interview video when leaving slide 4
const _origGoToSlide = goToSlide;
goToSlide = function(slideNum) {
    if (currentSlide === 4 && slideNum !== 4 && interviewVideo) {
        interviewVideo.pause();
    }
    if (currentSlide === 8 && slideNum !== 8 && thankVideo) {
        thankVideo.pause();
    }
    _origGoToSlide(slideNum);
};

init();

function openUnderstandModal() {
    var modal = document.getElementById('image-modal-3');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeUnderstandModal(event) {
    if (event && event.target && event.target.closest('.image-modal-content') && !event.target.closest('.image-modal-close')) {
        return;
    }
    var modal = document.getElementById('image-modal-3');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Slide 8: Thank You Video =====
const thankVideo = document.getElementById('thank-video');
const thankPlayBtn = document.getElementById('thank-play-button');
const thankOverlay = document.getElementById('thank-video-overlay');
const thankControls = document.getElementById('thank-video-controls');
const thankProgress = document.getElementById('thank-video-progress');
const thankTime = document.getElementById('thank-video-time');
const thankPauseIcon = document.getElementById('thank-pause-icon');
const thankContainer = document.getElementById('thank-video-container');

function playThankVideo() {
    if (!thankVideo) return;
    if (thankPlayBtn) thankPlayBtn.style.display = 'none';
    if (thankOverlay) thankOverlay.style.opacity = '0';
    if (thankControls) thankControls.style.display = 'flex';
    thankVideo.play().catch(function(err) {
        console.log('Thank video play error:', err);
        if (thankPlayBtn) thankPlayBtn.style.display = 'flex';
        if (thankOverlay) thankOverlay.style.opacity = '1';
        if (thankControls) thankControls.style.display = 'none';
    });
}

function toggleThankPause() {
    if (!thankVideo) return;
    if (thankVideo.paused) {
        thankVideo.play();
    } else {
        thankVideo.pause();
    }
}

function toggleThankFullscreen() {
    if (!thankContainer) return;
    if (!document.fullscreenElement) {
        if (thankContainer.requestFullscreen) {
            thankContainer.requestFullscreen();
        } else if (thankContainer.webkitRequestFullscreen) {
            thankContainer.webkitRequestFullscreen();
        } else if (thankContainer.msRequestFullscreen) {
            thankContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

if (thankVideo) {
    thankVideo.addEventListener('play', function() {
        if (thankPauseIcon) {
            thankPauseIcon.innerHTML = '<path fill="#ffffff" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        }
    });
    thankVideo.addEventListener('pause', function() {
        if (thankPauseIcon) {
            thankPauseIcon.innerHTML = '<path fill="#ffffff" d="M8 5v14l11-7z"/>';
        }
    });
    thankVideo.addEventListener('timeupdate', function() {
        if (thankVideo.duration && thankProgress && thankTime) {
            var pct = (thankVideo.currentTime / thankVideo.duration) * 100;
            thankProgress.style.width = pct + '%';
            var mins = Math.floor(thankVideo.currentTime / 60);
            var secs = Math.floor(thankVideo.currentTime % 60).toString().padStart(2, '0');
            thankTime.textContent = mins + ':' + secs;
        }
    });
    thankVideo.addEventListener('ended', function() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            exitFullscreen();
        }
        if (thankControls) thankControls.style.opacity = '0.3';
        setTimeout(function() {
            if (thankControls) thankControls.style.display = 'none';
            if (thankOverlay) thankOverlay.style.opacity = '1';
            if (thankPlayBtn) thankPlayBtn.style.display = 'flex';
            thankVideo.currentTime = 0;
        }, 500);
    });
}
