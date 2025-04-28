
import { Student } from "@/types";

export function parseCSV(csvText: string): Student[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(header => header.trim());
  
  // Map CSV headers to our Student interface properties
  const headerMap: Record<string, keyof Student> = {
    "student_id": "student_id",
    "campus_id": "campus_id",
    "grade_id": "grade_id",
    "language_id": "language_id",
    "Name": "name",
    "gender": "gender",
    "email": "email",
    "meet link": "meet_link",
    "local id": "local_id",
    "Student": "name", // Assuming this is a duplicate of Name
    "Student Code": "student_code",
    "Campus": "campus"
  };

  return lines.slice(1).map(line => {
    const values = line.split(",").map(value => value.trim());
    const student: Partial<Student> = {};
    
    headers.forEach((header, index) => {
      const propertyName = headerMap[header];
      if (propertyName && values[index]) {
        student[propertyName] = values[index];
      }
    });

    return student as Student;
  });
}

export function validateStudentData(students: Student[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  students.forEach((student, index) => {
    if (!student.name) {
      errors.push(`Row ${index + 1}: Missing student name`);
    }
    if (!student.email) {
      errors.push(`Row ${index + 1}: Missing email`);
    } else if (!isValidEmail(student.email)) {
      errors.push(`Row ${index + 1}: Invalid email format - ${student.email}`);
    }
    if (!student.campus_id) {
      errors.push(`Row ${index + 1}: Missing campus ID`);
    }
    if (!student.grade_id) {
      errors.push(`Row ${index + 1}: Missing grade ID`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
