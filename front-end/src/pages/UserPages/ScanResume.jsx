import React, { useState } from 'react';
import ResumePreviewComponent from '@/components/User/ResumeScanner/ResumePreviewComponent';
import ResumeUploadComponent from '@/components/User/ResumeScanner/ResumeUploadComponent';
import { toast } from 'sonner';
const ScanResume = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (uploadedFile, jd) => {
    if (jd !== undefined) {
      scanResume(uploadedFile, jd);
    } else {
      setFile(uploadedFile);
    }
  };

  const handleJdChange = (jd) => {
    setJobDescription(jd);
  };

  const scanResume = async (resumeFile, jd) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("job_description", jd);

      const response = await fetch(
        `${import.meta.env.VITE_RESUME_MICROSERVICE}/scan-resume/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success("Resume scanned successfully!");
      } else {
        toast.error(`Failed to scan resume: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`⚠️ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-4 sm:mb-6 lg:mb-8">
          Resume ATS Scanner
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left side - Upload components */}
          <div className="space-y-4 sm:space-y-6">
            <ResumeUploadComponent 
              onFileUpload={handleFileUpload}
              onJdChange={handleJdChange}
              isLoading={isLoading}
            />
          </div>

          {/* Right side - Preview and results */}
          <div className="space-y-4 sm:space-y-6">
            <ResumePreviewComponent 
              file={file}
              isLoading={isLoading}
              results={results}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResume;