import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface ImageUploadProps {
  className?: string;
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
  preview?: boolean;
  maxSize?: number; // in bytes
}

const DEFAULT_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp';
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const ImageUpload: React.FC<ImageUploadProps> = ({
  className,
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = DEFAULT_ACCEPT,
  disabled = false,
  preview = true,
  maxSize = DEFAULT_MAX_SIZE,
  ...props
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (fileList: FileList): { valid: File[]; errors: string[] } => {
      const validFiles: File[] = [];
      const newErrors: string[] = [];

      Array.from(fileList).forEach((file) => {
        // Check file type
        if (!accept.split(',').some((type) => file.type.includes(type.replace('image/', '')))) {
          newErrors.push(`${file.name} is not a supported file type`);
          return;
        }

        // Check file size
        if (file.size > maxSize) {
          newErrors.push(`${file.name} is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`);
          return;
        }

        validFiles.push(file);
      });

      // Check max files limit
      if (!multiple && validFiles.length > 1) {
        newErrors.push('Only one file is allowed');
        return { valid: [validFiles[0]], errors: newErrors };
      }

      if (multiple && files.length + validFiles.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        return { valid: validFiles.slice(0, maxFiles - files.length), errors: newErrors };
      }

      return { valid: validFiles, errors: newErrors };
    },
    [accept, maxSize, multiple, maxFiles, files.length]
  );

  // Cleanup preview URLs when files change or component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const { valid, errors: newErrors } = validateFiles(fileList);

      setErrors(newErrors);

      if (valid.length > 0) {
        const newFiles = multiple ? [...files, ...valid] : valid;
        setFiles(newFiles);

        // Create preview URLs for new files
        const newPreviewUrls = valid.map((file) => URL.createObjectURL(file));
        const updatedPreviewUrls = multiple ? [...previewUrls, ...newPreviewUrls] : newPreviewUrls;
        setPreviewUrls(updatedPreviewUrls);

        onChange?.(newFiles);
      }
    },
    [validateFiles, multiple, files, previewUrls, onChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (disabled) return;

      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleButtonClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleRemoveFile = useCallback(
    (index: number) => {
      // Revoke the preview URL for the removed file
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
      }

      const newFiles = files.filter((_, i) => i !== index);
      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
      setFiles(newFiles);
      setPreviewUrls(newPreviewUrls);
      onChange?.(newFiles);
    },
    [files, previewUrls, onChange]
  );

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload images"
      />

      {/* Upload area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
          {
            'border-gray-300 dark:border-gray-600 hover:border-[#C8A962] dark:hover:border-[#C8A962]':
              !dragActive && !disabled,
            'border-[#C8A962] bg-[#C8A962]/5 dark:bg-[#C8A962]/10': dragActive && !disabled,
            'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50':
              disabled,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleButtonClick();
          }
        }}
        aria-label="Upload images by clicking or dragging and dropping"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Upload icon */}
          <div
            className={cn('p-4 rounded-full transition-colors duration-200', {
              'bg-gray-100 dark:bg-gray-800': !dragActive && !disabled,
              'bg-[#C8A962]/10': dragActive && !disabled,
              'bg-gray-50 dark:bg-gray-900': disabled,
            })}
          >
            <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
              add_a_photo
            </span>
          </div>

          {/* Upload text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {dragActive ? 'Drop images here' : 'Upload images'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click to browse or drag and drop
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              JPG, PNG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB each
              {multiple && ` (max ${maxFiles} files)`}
            </p>
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            className={cn('px-6 py-2 rounded-lg font-medium transition-colors duration-200', {
              'bg-[#C8A962] text-white hover:bg-[#c8a95f]': !disabled,
              'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed': disabled,
            })}
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File previews */}
      {preview && files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Uploaded Files ({files.length})
          </h4>
          <div
            className={cn('grid gap-4', {
              'grid-cols-1': files.length === 1,
              'grid-cols-2': files.length === 2,
              'grid-cols-3': files.length >= 3,
            })}
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative group border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
              >
                {/* Preview image */}
                <div className="aspect-square relative">
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay with remove button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      aria-label={`Remove ${file.name}`}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                {/* File info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ImageUpload.displayName = 'ImageUpload';
