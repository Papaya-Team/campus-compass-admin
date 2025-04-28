
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseCSV, validateStudentData } from "@/lib/csv-utils";
import { Student } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

interface StudentCSVUploadProps {
  onUpload: (students: Student[]) => void;
}

const StudentCSVUpload = ({ onUpload }: StudentCSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCsvPreview(content.slice(0, 500) + (content.length > 500 ? "..." : ""));
        
        try {
          const students = parseCSV(content);
          setParsedStudents(students);
          
          const validation = validateStudentData(students);
          if (!validation.valid) {
            toast({
              title: "Validation errors",
              description: (
                <div className="max-h-40 overflow-y-auto">
                  <ul className="list-disc pl-4">
                    {validation.errors.slice(0, 5).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {validation.errors.length > 5 && (
                      <li>...and {validation.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              ),
              variant: "destructive",
            });
          } else {
            toast({
              title: "CSV parsed successfully",
              description: `Found ${students.length} valid student records.`,
            });
          }
        } catch (error) {
          toast({
            title: "Error parsing CSV",
            description: "The file format is not valid. Please check your CSV file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setCsvPreview(null);
      setParsedStudents([]);
    }
  };

  const handleUpload = async () => {
    if (!file || parsedStudents.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    const validation = validateStudentData(parsedStudents);
    if (!validation.valid) {
      toast({
        title: "Validation errors",
        description: "Please fix the validation errors before uploading.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      onUpload(parsedStudents);
      toast({
        title: "Upload successful",
        description: `${parsedStudents.length} students have been uploaded.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="csv-file">Select CSV File</Label>
        <Input 
          id="csv-file" 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
        />
      </div>

      {csvPreview && (
        <>
          <div className="space-y-2">
            <Label>CSV Preview</Label>
            <pre className="bg-secondary/10 p-2 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
              {csvPreview}
            </pre>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">
              Found {parsedStudents.length} student records in the CSV file.
            </p>
          </div>
        </>
      )}

      <DialogFooter>
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || parsedStudents.length === 0}
          className="w-full md:w-auto"
        >
          {isUploading ? (
            <>Processing...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Students
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default StudentCSVUpload;
