export const createFormData = (uri) => {
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    
    // Détecter le type de fichier plus intelligemment
    let fileType = 'jpeg'; // Par défaut
    if (fileName.includes('.heic') || fileName.includes('.HEIC')) {
        fileType = 'heic';
    } else if (fileName.includes('.png') || fileName.includes('.PNG')) {
        fileType = 'png';
    } else if (fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.JPG') || fileName.includes('.JPEG')) {
        fileType = 'jpeg';
    } else {
        // Essayer d'extraire l'extension
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension && ['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(extension)) {
            fileType = extension;
        }
    }

    console.log('📁 FormData - URI:', uri);
    console.log('📁 FormData - FileName:', fileName);
    console.log('📁 FormData - Detected type:', fileType);

    const formData = new FormData();
    formData.append('image', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
    } as any);

    return formData;
};
