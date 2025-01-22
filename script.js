document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery img');
    const modal = document.createElement('div');
    modal.classList.add('modal');
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
            modalImg.src = img.src;

            let currentIndex = index;

            const showNext = () => {
                currentIndex = (currentIndex + 1) % images.length;
                modalImg.src = images[currentIndex].src;
            };

            const showPrev = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                modalImg.src = images[currentIndex].src;
            };

            modal.onclick = (e) => {
                if (e.target.tagName === 'IMG') {
                    showNext();
                } else {
                    closeModal();
                }
            };

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    showNext();
                } else if (e.key === 'ArrowLeft') {
                    showPrev();
                } else if (e.key === 'Escape') {
                    closeModal();
                }
            });

            modalImg.focus();
        });
    });

    modal.querySelector('.close').addEventListener('click', closeModal);
});
