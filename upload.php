<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['media'])) {
    $file = $_FILES['media'];
    $fileName = uniqid() . '_' . $file['name'];
    $targetDir = 'uploads/';
    $targetFile = $targetDir . $fileName;

    // إنشاء المجلد إذا لم يكن موجودًا
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // التحقق من نوع الملف
    $fileType = mime_content_type($file['tmp_name']);
    if (strpos($fileType, 'image') === 0) {
        // معالجة الصورة
        $image = imagecreatefromstring(file_get_contents($file['tmp_name']));
        $watermark = "Mahmoud El Sheikh";
        $fontSize = 20;
        $color = imagecolorallocate($image, 255, 255, 255);
        $shadow = imagecolorallocate($image, 0, 0, 0);
        
        // وضع العلامة المائية في المنتصف
        $textBox = imagettfbbox($fontSize, 0, __DIR__ . '/arial.ttf', $watermark);
        $x = (imagesx($image) - ($textBox[2] - $textBox[0])) / 2;
        $y = (imagesy($image) - ($textBox[1] - $textBox[7])) / 2;
        
        imagettftext($image, $fontSize, 0, $x + 2, $y + 2, $shadow, __DIR__ . '/arial.ttf', $watermark);
        imagettftext($image, $fontSize, 0, $x, $y, $color, __DIR__ . '/arial.ttf', $watermark);
        
        imagejpeg($image, $targetFile, 85); // ضغط الصورة لتقليل الحجم
        imagedestroy($image);
    } elseif (strpos($fileType, 'video') === 0) {
        // للفيديو: نقل الملف أولاً ثم إضافة علامة مائية باستخدام FFmpeg (إذا كان مثبتًا)
        move_uploaded_file($file['tmp_name'], $targetFile);
        $outputFile = $targetDir . 'wm_' . $fileName;
        $command = "ffmpeg -i $targetFile -vf \"drawtext=text='Mahmoud El Sheikh':fontcolor=white:fontsize=24:x=(w-text_w)/2:y=(h-text_h)/2\" -c:a copy $outputFile";
        exec($command);
        unlink($targetFile); // حذف الملف الأصلي
        rename($outputFile, $targetFile); // إعادة تسمية الملف المعالج
    }

    header('Location: index.html');
    exit;
}
?>
