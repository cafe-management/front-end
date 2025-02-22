const cloudName = "drszapjl6";
const uploadPreset = "test_cloundinary";

export const getCloudinaryImageUrl = (publicId, options = {}) => {
    let transformation = "";
    if (options.width) {
        transformation += `w_${options.width},`;
    }
    if (options.height) {
        transformation += `h_${options.height},`;
    }
    if (options.crop) {
        transformation += `c_${options.crop},`;
    }
    if (transformation.endsWith(",")) {
        transformation = transformation.slice(0, -1);
    }
    const transformationPart = transformation ? transformation + "/" : "";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationPart}${publicId}`;
};


export const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Image upload failed");
        }

        const data = await response.json();
        return data.public_id; // Return the publicId of the uploaded image
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};

export const uploadImageAndGetUrl = async (imageFile, options = {}) => {
    // Upload ảnh và nhận về public_id
    const publicId = await uploadImageToCloudinary(imageFile);
    // Sử dụng hàm getCloudinaryImageUrl để chuyển đổi public_id thành URL (có thể áp dụng các tùy chọn chuyển đổi nếu cần)
    return getCloudinaryImageUrl(publicId, options);
};