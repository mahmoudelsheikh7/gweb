const GITHUB_REPO = 'mahmoudelsheikh7/gweb'; // استبدل بمعلوماتك إذا لزم الأمر
const BRANCH = 'main'; // تأكد من اسم الفرع الصحيح (قد يكون 'uploads' إذا كان الفرع مختلفًا)

async function fetchMedia() {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/media?ref=${BRANCH}`; // تحديث المسار إلى 'uploads'
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('خطأ في جلب الملفات: ' + response.status);
        }
        const files = await response.json();
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = ''; // تفريغ المعرض قبل التحميل

        files.forEach(file => {
            if (file.type === 'file' && (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.mp4'))) {
                const mediaElement = document.createElement(file.name.endsWith('.mp4') ? 'video' : 'img');
                mediaElement.classList.add('gallery-item');

                mediaElement.src = file.download_url;
                if (file.name.endsWith('.mp4')) {
                    mediaElement.controls = true;
                    mediaElement.muted = true; // لتجنب مشاكل التشغيل التلقائي
                    mediaElement.preload = 'metadata';
                }

                gallery.appendChild(mediaElement);
            }
        });
    } catch (error) {
        console.error('خطأ:', error);
        const gallery = document.getElementById('media-gallery');
        gallery.innerHTML = '<p>تعذر تحميل الملفات. تحقق من الاتصال أو المستودع.</p>';
    }
}

// استدعاء الدالة لجلب الملفات عند تحميل الصفحة
window.onload = fetchMedia;
