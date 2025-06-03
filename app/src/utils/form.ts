export const createFormData = (uri) => {
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileType = fileName.split('.').pop() || 'jpeg';

    const formData = new FormData();
    formData.append('image', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
    } as any);

    return formData;
};
