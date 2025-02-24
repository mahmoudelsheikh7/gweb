<?php
header('Content-Type: application/json');
$dir = 'uploads/';
$files = scandir($dir);
$media = [];

foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        $type = mime_content_type($dir . $file) === 'image/jpeg' ? 'image' : 'video';
        $media[] = [
            'url' => $dir . $file,
            'name' => $file,
            'type' => $type
        ];
    }
}

echo json_encode($media);
?>
