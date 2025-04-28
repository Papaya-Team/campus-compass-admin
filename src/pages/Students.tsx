
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Student, Campus, Grade, Language } from "@/types";
import { Edit, Trash2, UserPlus, Search, Upload } from "lucide-react";
import { parseCSV, validateStudentData } from "@/lib/csv-utils";
import StudentCSVUpload from "@/components/students/StudentCSVUpload";
import { useSupabaseStudents, getCampuses, getGrades, getLanguages } from "@/services/supabaseStudentService";

const Students = () => {
  const { 
    isLoading: studentsLoading, 
    error: studentsError,
    getStudents, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    addMultipleStudents
  } = useSupabaseStudents();
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCSVDialog, setShowCSVDialog] = useState(false);

  // Reference data
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    email: "",
    gender: "",
    campus_id: "",
    grade_id: "",
    language_id: "",
    meet_link: "",
    local_id: "",
    student_code: "",
  });

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [campusesData, gradesData, languagesData] = await Promise.all([
          getCampuses(),
          getGrades(),
          getLanguages()
        ]);
        
        setCampuses(campusesData);
        setGrades(gradesData);
        setLanguages(languagesData);
      } catch (error) {
        console.error("Error loading reference data:", error);
        toast({
          title: "Error",
          description: "Failed to load reference data. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    
    loadReferenceData();
  }, [toast]);

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load students. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudents();
  }, [getStudents, toast]);

  // Error handling for student service errors
  useEffect(() => {
    if (studentsError) {
      toast({
        title: "Error",
        description: studentsError,
        variant: "destructive",
      });
    }
  }, [studentsError, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      gender: "",
      campus_id: "",
      grade_id: "",
      language_id: "",
      meet_link: "",
      local_id: "",
      student_code: "",
    });
  };

  const handleAddStudent = async () => {
    try {
      if (!formData.name || !formData.campus_id || !formData.grade_id) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const newStudent = await addStudent(formData as Omit<Student, "student_id">);
      setStudents(prev => [...prev, newStudent]);
      
      toast({
        title: "Success",
        description: "Student added successfully.",
      });
      
      resetForm();
      setShowAddDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setShowEditDialog(true);
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      if (!formData.name || !formData.campus_id || !formData.grade_id) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const updatedStudent = await updateStudent({
        ...formData,
        student_id: selectedStudent.student_id,
      } as Student);
      
      setStudents(prev => 
        prev.map(student => 
          student.student_id === updatedStudent.student_id ? updatedStudent : student
        )
      );
      
      toast({
        title: "Success",
        description: "Student updated successfully.",
      });
      
      setShowEditDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      await deleteStudent(selectedStudent.student_id);
      
      setStudents(prev => prev.filter(student => student.student_id !== selectedStudent.student_id));
      
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });
      
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = async (csvData: Student[]) => {
    try {
      const newStudents = await addMultipleStudents(csvData);
      
      setStudents(prev => [...prev, ...newStudents]);
      
      toast({
        title: "Success",
        description: `${newStudents.length} students imported successfully.`,
      });
      
      setShowCSVDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import students. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.campus && student.campus.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCSVDialog(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {studentsError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading students: {studentsError}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {grades.find(g => g.grade_id === student.grade_id)?.name || student.grade_id}
                  </TableCell>
                  <TableCell>{student.campus || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEditClick(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleDeleteClick(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the student information. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ""} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus_id">Campus *</Label>
                <Select 
                  value={formData.campus_id || ""} 
                  onValueChange={(value) => handleSelectChange("campus_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus.campus_id} value={campus.campus_id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade_id">Grade *</Label>
                <Select 
                  value={formData.grade_id || ""} 
                  onValueChange={(value) => handleSelectChange("grade_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.grade_id} value={grade.grade_id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language_id">Language</Label>
                <Select 
                  value={formData.language_id || ""} 
                  onValueChange={(value) => handleSelectChange("language_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.language_id} value={language.language_id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meet_link">Meet Link</Label>
                <Input
                  id="meet_link"
                  name="meet_link"
                  value={formData.meet_link || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local_id">Local ID</Label>
                <Input
                  id="local_id"
                  name="local_id"
                  value={formData.local_id || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_code">Student Code</Label>
                <Input
                  id="student_code"
                  name="student_code"
                  value={formData.student_code || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student information. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ""} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus_id">Campus *</Label>
                <Select 
                  value={formData.campus_id || ""} 
                  onValueChange={(value) => handleSelectChange("campus_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.map((campus) => (
                      <SelectItem key={campus.campus_id} value={campus.campus_id}>
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade_id">Grade *</Label>
                <Select 
                  value={formData.grade_id || ""} 
                  onValueChange={(value) => handleSelectChange("grade_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.grade_id} value={grade.grade_id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language_id">Language</Label>
                <Select 
                  value={formData.language_id || ""} 
                  onValueChange={(value) => handleSelectChange("language_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.language_id} value={language.language_id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meet_link">Meet Link</Label>
                <Input
                  id="meet_link"
                  name="meet_link"
                  value={formData.meet_link || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local_id">Local ID</Label>
                <Input
                  id="local_id"
                  name="local_id"
                  value={formData.local_id || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_code">Student Code</Label>
                <Input
                  id="student_code"
                  name="student_code"
                  value={formData.student_code || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              {selectedStudent && ` ${selectedStudent.name}`} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CSV Upload Dialog */}
      <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Student CSV</DialogTitle>
            <DialogDescription>
              Import multiple students by uploading a CSV file.
            </DialogDescription>
          </DialogHeader>
          <StudentCSVUpload onUpload={handleCSVUpload} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;

