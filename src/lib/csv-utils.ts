
import { Student } from "@/types";

export const parseCSV = (csvContent: string): Student[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const students: Student[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    
    if (values.length !== headers.length) continue;
    
    const student: any = {
      student_id: '',  // This will be assigned by the database
    };
    
    headers.forEach((header, index) => {
      const value = values[index];
      if (header.toLowerCase() === 'name') student.name = value;
      else if (header.toLowerCase() === 'email') student.email = value;
      else if (header.toLowerCase() === 'gender') student.gender = value;
      else if (header.toLowerCase() === 'campus_id') student.campus_id = value;
      else if (header.toLowerCase() === 'grade_id') student.grade_id = value;
      else if (header.toLowerCase() === 'language_id') student.language_id = value;
      else if (header.toLowerCase() === 'campus') student.campus = value;
      else if (header.toLowerCase() === 'meet_link') student.meet_link = value;
      else if (header.toLowerCase() === 'local_id') student.local_id = value;
      else if (header.toLowerCase() === 'student_code') student.student_code = value;
    });
    
    students.push(student as Student);
  }
  
  return students;
};

export const validateStudentData = (students: Student[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  students.forEach((student, index) => {
    if (!student.name) {
      errors.push(`Row ${index + 1}: Name is required`);
    }
    
    if (!student.campus_id) {
      errors.push(`Row ${index + 1}: Campus ID is required`);
    }
    
    if (!student.grade_id) {
      errors.push(`Row ${index + 1}: Grade ID is required`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
