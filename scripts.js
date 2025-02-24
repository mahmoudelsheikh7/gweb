const GITHUB_REPO = 'username/repo'; // استبدل 'username/repo' باسم المستخدم واسم المستودع الخاص بك
const BRANCH = 'main'; // استبدل 'main' باسم الفرع الذي تريد استدعاء الملفات منه

async function fetchMedia() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/media?ref=${BRANCH}`; // تأكد من أن لديك مجلد باسم 'media' في المستودع
    const response = await fetch(url);
    const files = await response.json();
    const gallery = document.getElementById('media-gallery');
    
    files.forEach(file => {
        if (file.type === 'file') {
            const mediaElement = document.createElement(file.name.endsWith('.mp4') ? 'video' : 'img');
            mediaElement.classList.add('gallery-item');

            mediaElement.src = file.download_url;
            if (file.name.endsWith('.mp4')) {
                mediaElement.controls = true;
            }

            gallery.appendChild(mediaElement);
        }
    });
}

// استدعاء الدالة لجلب الملفات عند تحميل الصفحة
window.onload = fetchMedia;
