document.addEventListener('DOMContentLoaded', () => {
    // تحميل المعرض ديناميكيًا
    fetch('get_media.php')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('media-gallery');
            data.forEach(item => {
                if (item.type === 'image') {
                    gallery.innerHTML += `<a href="${item.url}" class="gallery-item"><img src="${item.url}" alt="${item.name}" data-aos="fade-up"></a>`;
                } else {
                    gallery.innerHTML += `
                        <a href="${item.url}" class="gallery-item" data-video='{"source": [{"src": "${item.url}", "type": "video/mp4"}], "attributes": {"preload": false, "controls": true}}'>
                            <video src="${item.url}" muted preload="metadata" data-aos="fade-up"></video>
                        </a>`;
                }
            });

            // تفعيل LightGallery مع دعم الفيديوهات
            const lg = lightGallery(document.getElementById('media-gallery'), {
                speed: 500,
                download: true,
                counter: true,
                zoom: true,
                scale: 1,
                video: true,
                autoplay: true, // تشغيل الفيديو تلقائيًا عند فتحه
                plugins: [lgVideo]
            });

            // تشغيل الفيديو عند التمرير فوقه
            document.querySelectorAll('.gallery video').forEach(video => {
                video.addEventListener('mouseenter', () => video.play());
                video.addEventListener('mouseleave', () => video.pause());
            });

            // إضافة تأثيرات AOS (اختياري)
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 1000 });
            }
        });

    // تحسين السرعة باستخدام Intersection Observer
    const lazyLoad = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                media.src = media.dataset.src;
                observer.unobserve(media);
            }
        });
    });

    document.querySelectorAll('img, video').forEach(media => {
        media.dataset.src = media.src;
        media.src = '';
        lazyLoad.observe(media);
    });
});
