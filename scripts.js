// تعريف المعلومات الأساسية للمستودع
const GITHUB_REPO = 'mahmoudelsheikh7/gweb';
const BRANCH = 'main';
const MEDIA_FOLDER = '';

async function fetchMedia() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${MEDIA_FOLDER}?ref=${BRANCH}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': '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'
            }
        });
        if (!response.ok) {
            throw new Error('خطأ في جلب الملفات: ' + response.status + ' - ' + response.statusText);
        }
        const files = await response.json();
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = '';

        files.forEach(file => {
            if (file.type === 'file' && (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.jpeg') || file.name.endsWith('.gif') || file.name.endsWith('.mp4'))) {
                // إنشاء عنصر الحاوية بدلاً من رابط مباشر
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');

                if (file.name.endsWith('.mp4')) {
                    const video = document.createElement('video');
                    video.src = file.download_url;
                    video.controls = true;
                    video.muted = true;
                    video.preload = 'metadata';
                    // إضافة البيانات لـ LightGallery
                    galleryItem.dataset.video = JSON.stringify({
                        source: [{ src: file.download_url, type: 'video/mp4' }],
                        attributes: { controls: true, preload: false }
                    });
                    galleryItem.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = file.download_url;
                    img.alt = file.name;
                    // إضافة خاصية src لتشغيل LightGallery
                    galleryItem.dataset.src = file.download_url;
                    galleryItem.appendChild(img);
                }

                gallery.appendChild(galleryItem);
            }
        });

        // تفعيل LightGallery مع إلغاء التنزيل
        if (typeof lightGallery !== 'undefined') {
            lightGallery(document.getElementById('media-gallery'), {
                speed: 500,
                download: false, // تعطيل التنزيل
                counter: true,
                zoom: true,
                scale: 1,
                video: true,
                autoplay: false, // تغيير إلى false لتجنب المشاكل
                plugins: [lgVideo],
                selector: '.gallery-item' // تحديد العناصر المستهدفة
            });
        } else {
            console.error('LightGallery لم يتم تحميله بشكل صحيح.');
        }
    } catch (error) {
        console.error('خطأ:', error);
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = '<p>تعذر تحميل الملفات. الخطأ: ' + error.message + '</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchMedia();
});