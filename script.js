document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById('dropArea');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);

    document.getElementById('fileInput').addEventListener('change', handleFiles, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    document.getElementById('dropArea').classList.add('highlight');
}

function unhighlight() {
    document.getElementById('dropArea').classList.remove('highlight');
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFiles(files) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    resultDiv.innerHTML += `<p>Original Size: ${file.size / 1024} KB</p>`;
                    resultDiv.innerHTML += `<p>Original Dimensions: ${img.width} x ${img.height}</p>`;

                    const quality = document.getElementById('quality').value;
                    const compressedImage = compressImage(img, quality);

                    resultDiv.innerHTML += `<p>Compressed Size: ${compressedImage.size / 1024} KB</p>`;
                    resultDiv.innerHTML += `<p>Compressed Dimensions: ${compressedImage.width} x ${compressedImage.height}</p>`;
                    resultDiv.innerHTML += `<img src="${compressedImage.src}" alt="Compressed Image">`;
                };
            };

            reader.readAsDataURL(file);
        } else {
            resultDiv.innerHTML += `<p>${file.name} is not a valid image file.</p>`;
        }
    }
}

function compressImage(img, quality) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
    const compressedImage = new Image();
    compressedImage.src = dataUrl;

    return {
        src: dataUrl,
        size: dataUrl.length,
        width: compressedImage.width,
        height: compressedImage.height
    };
}

function compressImages() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    handleFiles(files);
}
