import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ProductImagePicker extends StatefulWidget {
  final List<String> initialImages;
  final ValueChanged<List<String>> onImagesChanged;
  final int maxImages;

  const ProductImagePicker({
    Key? key,
    this.initialImages = const [],
    required this.onImagesChanged,
    this.maxImages = 10,
  }) : super(key: key);

  @override
  State<ProductImagePicker> createState() => _ProductImagePickerState();
}

class _ProductImagePickerState extends State<ProductImagePicker> {
  List<String> _images = [];
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _images = List.from(widget.initialImages);
  }

  Future<void> _pickImages() async {
    if (_images.length >= widget.maxImages) {
      _showSnackBar('Maximum ${widget.maxImages} images allowed');
      return;
    }

    try {
      final List<XFile> pickedFiles = await _imagePicker.pickMultiImage(
        limit: widget.maxImages - _images.length,
      );

      if (pickedFiles.isNotEmpty) {
        setState(() {
          _images.addAll(pickedFiles.map((file) => file.path));
        });
        widget.onImagesChanged(_images);
      }
    } catch (e) {
      _showSnackBar('Failed to pick images: $e');
    }
  }

  Future<void> _pickCameraImage() async {
    if (_images.length >= widget.maxImages) {
      _showSnackBar('Maximum ${widget.maxImages} images allowed');
      return;
    }

    try {
      final XFile? pickedFile = await _imagePicker.pickImage(
        source: ImageSource.camera,
      );

      if (pickedFile != null) {
        setState(() {
          _images.add(pickedFile.path);
        });
        widget.onImagesChanged(_images);
      }
    } catch (e) {
      _showSnackBar('Failed to capture image: $e');
    }
  }

  void _removeImage(int index) {
    setState(() {
      _images.removeAt(index);
    });
    widget.onImagesChanged(_images);
  }

  void _showImagePreview(String imagePath) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Stack(
          children: [
            Image.file(
              File(imagePath),
              fit: BoxFit.contain,
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close, color: Colors.white),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black54,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Product Images',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            Text(
              '${_images.length}/${widget.maxImages}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (_images.isEmpty)
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[50],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.image_outlined,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 8),
                Text(
                  'No images added',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton.icon(
                      onPressed: _pickImages,
                      icon: const Icon(Icons.photo_library),
                      label: const Text('Gallery'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: _pickCameraImage,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Camera'),
                    ),
                  ],
                ),
              ],
            ),
          )
        else ...[
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              childAspectRatio: 1,
            ),
            itemCount: _images.length < widget.maxImages ? _images.length + 1 : _images.length,
            itemBuilder: (context, index) {
              if (index == _images.length && _images.length < widget.maxImages) {
                // Add image button
                return Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                    color: Colors.grey[50],
                  ),
                  child: InkWell(
                    onTap: () {
                      showModalBottomSheet(
                        context: context,
                        builder: (context) => Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            ListTile(
                              leading: const Icon(Icons.photo_library),
                              title: const Text('Choose from Gallery'),
                              onTap: () {
                                Navigator.of(context).pop();
                                _pickImages();
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.camera_alt),
                              title: const Text('Take Photo'),
                              onTap: () {
                                Navigator.of(context).pop();
                                _pickCameraImage();
                              },
                            ),
                          ],
                        ),
                      );
                    },
                    child: const Icon(
                      Icons.add,
                      size: 32,
                      color: Colors.grey,
                    ),
                  ),
                );
              }

              final imagePath = _images[index];
              return Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: imagePath.startsWith('http')
                          ? Image.network(
                              imagePath,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[200],
                                  child: const Icon(Icons.broken_image),
                                );
                              },
                            )
                          : Image.file(
                              File(imagePath),
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[200],
                                  child: const Icon(Icons.broken_image),
                                );
                              },
                            ),
                    ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: GestureDetector(
                        onTap: () => _removeImage(index),
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ),
                    ),
                    Positioned.fill(
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(8),
                          onTap: () => _showImagePreview(imagePath),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 8),
          if (_images.length < widget.maxImages)
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickImages,
                    icon: const Icon(Icons.photo_library),
                    label: const Text('Add More Images'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickCameraImage,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Take Photo'),
                  ),
                ),
              ],
            ),
        ],
      ],
    );
  }
}
