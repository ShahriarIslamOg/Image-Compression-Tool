function compressImage() {
    const input = document.getElementById('imageInput');
    const originalImage = document.getElementById('originalImage');
    const downloadLink = document.getElementById('downloadLink');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, img.width, img.height);

                canvas.toBlob((blob) => {
                    const compressedUrl = URL.createObjectURL(blob);
                    originalImage.src = compressedUrl;
                    downloadLink.href = compressedUrl;
                    downloadLink.style.display = 'inline';
                }, 'image/jpeg', 0.8);
            };
        };

        reader.readAsDataURL(file);
    }
}
