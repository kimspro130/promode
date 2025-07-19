"use client";

import { useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, File } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUpload?: (url: string, path: string) => void;
  onError?: (error: string) => void;
  className?: string;
  multiple?: boolean;
  preview?: boolean;
}

interface UploadedFile {
  file: File;
  url: string;
  path: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

export default function FileUpload({
  bucket,
  path = "",
  accept = "image/*",
  maxSize = 5, // 5MB default
  onUpload,
  onError,
  className = "",
  multiple = false,
  preview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  const generateFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  };

  const uploadFile = async (file: File) => {
    const fileName = generateFileName(file.name);
    const filePath = path ? `${path}/${fileName}` : fileName;

    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: publicUrl, path: filePath };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validate files
    for (const file of fileArray) {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }
    }

    // Create file objects with preview URLs
    const newFiles: UploadedFile[] = fileArray.map(file => ({
      file,
      url: URL.createObjectURL(file),
      path: '',
      uploading: true,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    for (let i = 0; i < newFiles.length; i++) {
      const fileObj = newFiles[i];
      
      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map((f, index) => 
            f === fileObj ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ));
        }, 200);

        const { url, path: uploadPath } = await uploadFile(fileObj.file);
        
        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f === fileObj 
            ? { ...f, url, path: uploadPath, uploading: false, progress: 100 }
            : f
        ));

        onUpload?.(url, uploadPath);
        toast.success(`${fileObj.file.name} uploaded successfully!`);
        
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f === fileObj 
            ? { ...f, uploading: false, error: 'Upload failed' }
            : f
        ));
        
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        onError?.(errorMessage);
        toast.error(`Failed to upload ${fileObj.file.name}: ${errorMessage}`);
      }
    }
  };

  const removeFile = async (fileToRemove: UploadedFile) => {
    // If file was uploaded to storage, delete it
    if (fileToRemove.path && !fileToRemove.uploading) {
      try {
        await supabase.storage
          .from(bucket)
          .remove([fileToRemove.path]);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Revoke object URL to prevent memory leaks
    if (fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    setFiles(prev => prev.filter(f => f !== fileToRemove));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {maxSize}MB
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                {/* File Preview */}
                {preview && file.file.type.startsWith('image/') ? (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={file.url}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    {file.file.type.startsWith('image/') ? (
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <File className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Progress Bar */}
                  {file.uploading && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}
                  
                  {/* Error Message */}
                  {file.error && (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                  disabled={file.uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
