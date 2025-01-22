document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery img');
    const modal = document.createElement('div');
    modal.classList.add('lightbox-modal');
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img src="" alt="Gallery Image">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const closeModal = () => (modal.style.display = 'none');

    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;  // Set image source in modal

            let currentIndex = index;

            // Show next image in modal
            const showNext = () => {
                currentIndex = (currentIndex + 1) % images.length;
                modalImg.src = images[currentIndex].src;
            };

            // Show previous image in modal
            const showPrev = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                modalImg.src = images[currentIndex].src;
            };

            // Navigate between images when clicking on the modal image
            modal.onclick = (e) => {
                if (e.target.tagName === 'IMG') {
                    showNext();
                } else {
                    closeModal();
                }
            };

            // Handle keyboard navigation: ArrowRight, ArrowLeft, and Escape
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    showNext();
                } else if (e.key === 'ArrowLeft') {
                    showPrev();
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            });

            modalImg.focus();  // Focus on the image for keyboard navigation
        });
    });

    // Close the modal when the close button is clicked
    modal.querySelector('.close').addEventListener('click', closeModal);
});
