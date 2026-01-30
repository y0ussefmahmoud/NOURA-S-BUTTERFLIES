import React, { useState, useRef } from 'react';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUpload,
  onRemove,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const displayImage = preview || currentAvatar;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative w-32 h-32 mx-auto cursor-pointer group
          ${isDragging ? 'ring-4 ring-pink-300' : ''}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar Image */}
        {displayImage ? (
          <img
            src={displayImage}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
            <span className="material-symbols-rounded text-4xl text-gray-400">account_circle</span>
          </div>
        )}

        {/* Edit Overlay */}
        {(isHovered || isDragging) && (
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200">
            <div className="text-center">
              <span className="material-symbols-rounded text-white text-2xl mb-1">
                {isDragging ? 'cloud_upload' : 'photo_camera'}
              </span>
              <p className="text-white text-xs font-medium">
                {isDragging ? 'Drop image here' : 'Change photo'}
              </p>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {displayImage && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-sm">close</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 mb-1">Click or drag image to upload</p>
        <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
      </div>

      {/* Upload Progress (for future implementation) */}
      {false && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: '60%' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">Uploading... 60%</p>
        </div>
      )}
    </div>
  );
};
