/**
 * Utility functions for handling image URLs
 */

/**
 * Get the proper image URL for thumbnails and other images
 * @param imagePath - The image path from the database
 * @param fallback - Fallback image path (default: "/class5.avif")
 * @returns Properly formatted image URL
 */
export const getImageUrl = (imagePath: string | null | undefined, fallback: string = "/class5.avif"): string => {
  // If no image path, return fallback
  if (!imagePath) {
    return fallback;
  }

  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path starting with /, return as is (public folder)
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // If it's just a filename, prepend /uploads/
  return `/uploads/${imagePath}`;
};

/**
 * Get thumbnail URL specifically for courses
 * @param thumbnail - Course thumbnail path
 * @returns Properly formatted thumbnail URL
 */
export const getCourseThumbnail = (thumbnail: string | null | undefined): string => {
  return getImageUrl(thumbnail, "/class5.avif");
};

/**
 * Get profile picture URL for users
 * @param profilePicture - User profile picture path
 * @returns Properly formatted profile picture URL
 */
export const getProfilePicture = (profilePicture: string | null | undefined): string => {
  return getImageUrl(profilePicture, "/default-avatar.png");
};
