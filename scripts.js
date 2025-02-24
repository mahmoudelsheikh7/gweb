// تأكد من أن الدالة async
async function fetchMedia() {
    const GITHUB_REPO = 'mahmoudelsheikh7/gweb';
    const BRANCH = 'media';

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/media?ref=${BRANCH}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN_HERE' // استبدل YOUR_TOKEN_HERE برمزك إذا لزم الأمر
            }
        });
        if (!response.ok) {
            throw new Error('خطأ في جلب الملفات: ' + response.status + ' - ' + response.statusText);
        }
        const files = await response.json();
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = ''; // تفريغ المعرض قبل التحميل

        files.forEach(file => {
            if (file.type === 'file' && (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.mp4'))) {
                const link = document.createElement('a');
                link.href = file.download_url;
                link.classList.add('gallery-item');

                if (file.name.endsWith('.mp4')) {
                    const video = document.createElement('video');
                    video.src = file.download_url;
                    video.controls = true;
                    video.muted = true;
                    video.preload = 'metadata';
                    link.dataset.video = JSON.stringify({
                        source: [{ src: file.download_url, type: 'video/mp4' }],
                        attributes: { controls: true, preload: false }
                    });
                    link.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = file.download_url;
                    img.alt = file.name;
                    link.appendChild(img);
                }

                gallery.appendChild(link);
            }
        });

        // تفعيل LightGallery بعد تحميل العناصر
        lightGallery(document.getElementById('media-gallery'), {
            speed: 500,
            download: true,
            counter: true,
            zoom: true,
            scale: 1,
            video: true,
            autoplay: true,
            plugins: [lgVideo]
        });
    } catch (error) {
        console.error('خطأ:', error);
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = '<p>تعذر تحميل الملفات. الخطأ: ' + error.message + '</p>';
    }
}

// استدعاء الدالة باستخدام async/await
document.addEventListener('DOMContentLoaded', async () => {
    await fetchMedia();
});
