const cloudName = "drszapjl6";
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

