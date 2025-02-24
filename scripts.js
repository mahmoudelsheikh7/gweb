const GITHUB_REPO = 'mahmoudelsheikh7';
const BRANCH = 'uploads';

async function fetchMedia() {
    try {
        const url = `https://api.github.com/repos/${GITHUB_REPO}/gweb/contents/upload?ref=${BRANCH}`;
        const response = await fetch(url);
        
        // تحقق من نجاح الاستجابة
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const files = await response.json();
        const gallery = document.getElementById('media-gallery');

        files.forEach(file => {
            if (file.type === 'file') {
                const mediaElement = document.createElement(file.name.endsWith('.mp4') ? 'video' : 'img');
                mediaElement.classList.add('gallery-item');
                mediaElement.src = file.download_url;
                
                if (file.name.endsWith('.mp4')) {
                    mediaElement.controls = true; // أضف عناصر التحكم للفيديو
                }

                gallery.appendChild(mediaElement);
            }
        });
    } catch (error) {
        console.error('Error fetching media:', error); // معالجة الأخطاء
    }
}

// استدعاء الدالة عند تحميل الصفحة
window.onload = fetchMedia;
