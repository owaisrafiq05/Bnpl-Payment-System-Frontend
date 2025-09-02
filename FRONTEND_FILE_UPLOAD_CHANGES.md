# Frontend File Upload Integration

## Overview
The CheckoutForm component has been updated to support file uploads for verification documents (Photo ID and Digital Signature) during payment plan creation.

## Changes Made

### CheckoutForm.tsx Updates

#### 1. **New State Variables**
- `uploadProgress`: Tracks upload status messages
- Enhanced file validation for `photoIdFile`

#### 2. **Enhanced File Upload Handler**
```typescript
const handlePhotoIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  // File size validation (10MB limit)
  // File type validation (JPEG, PNG, GIF, PDF)
  // Success/error toast notifications
}
```

#### 3. **Updated Form Submission**
- **FormData Creation**: Converts form data to `FormData` format for file uploads
- **File Processing**: 
  - Photo ID: Direct file attachment
  - Digital Signature: Canvas to blob conversion
- **Progress Tracking**: Real-time upload status updates
- **Error Handling**: Graceful handling of file processing errors

#### 4. **UI Enhancements**
- **File Upload Visual Feedback**: 
  - Green border and background when file is selected
  - File size display in MB
  - Clear success/error indicators
- **Progress Indicator**: 
  - Loading spinner during upload
  - Status messages (e.g., "Processing photo ID...", "Submitting payment plan...")
- **Optional Labels**: Both file uploads marked as optional

### PaymentPlanService.ts Updates

#### New Method: `createPaymentPlanWithFiles()`
```typescript
static async createPaymentPlanWithFiles(formData: FormData) {
  // Direct fetch API call with FormData
  // Proper Content-Type handling (multipart/form-data)
  // Error handling and response parsing
}
```

## Key Features

### **File Validation**
- **Size Limit**: 10MB per file
- **Type Validation**: JPEG, PNG, GIF, PDF files only
- **Count Limit**: Maximum 2 files (photoId + digitalSignature)

### **User Experience**
- **Real-time Feedback**: Immediate validation and success messages
- **Progress Tracking**: Step-by-step upload status
- **Error Recovery**: Continues submission even if file processing fails
- **Visual Indicators**: Clear UI states for file selection

### **Digital Signature Processing**
- **Canvas to Blob**: Converts signature canvas to PNG file
- **Quality Optimization**: 80% quality for optimal file size
- **Error Handling**: Graceful fallback if signature processing fails

### **Backward Compatibility**
- **Optional Files**: Form works with or without file uploads
- **Existing Flow**: All existing functionality preserved
- **Fallback Support**: Legacy `createPaymentPlan()` method still available

## API Integration

### Request Format
- **Content-Type**: `multipart/form-data`
- **Form Fields**: All existing customer/plan data as string fields
- **Files**: 
  - `photoId`: Image/PDF file (optional)
  - `digitalSignature`: PNG blob from canvas (optional)

### Error Handling
- **File Validation Errors**: Shown as toast notifications
- **Upload Failures**: Logged but don't prevent form submission
- **Network Errors**: Standard error handling with user feedback

## Security & Performance

### **Client-side Validation**
- File type checking before upload
- File size limits enforced
- Malicious file prevention

### **Optimized Uploads**
- Signature compression (80% quality)
- Parallel file processing
- Progress feedback for long uploads

### **Error Resilience**
- Upload failures don't break payment flow
- Graceful degradation for unsupported features
- Clear error messages for user guidance

## Usage Examples

### With Files
```typescript
// FormData automatically created with:
// - All form fields as strings
// - photoId file (if selected)
// - digitalSignature blob (if drawn)
```

### Without Files
```typescript
// Works exactly as before
// Files are simply omitted from FormData
```

The integration maintains full backward compatibility while adding powerful file upload capabilities for enhanced verification and user experience.
