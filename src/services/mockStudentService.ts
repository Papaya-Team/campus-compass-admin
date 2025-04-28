
import { Student } from "@/types";
import { useState } from "react";

// Initial mock data
const initialStudents: Student[] = [
  {
    student_id: "1",
    campus_id: "101",
    grade_id: "9",
    language_id: "1",
    name: "John Smith",
    gender: "Male",
    email: "john.smith@example.com",
    meet_link: "https://meet.google.com/abc-defg-hij",
    local_id: "JS001",
    student_code: "ST001",
    campus: "Main Campus"
  },
  {
    student_id: "2",
    campus_id: "102",
    grade_id: "10",
    language_id: "1",
    name: "Emily Johnson",
    gender: "Female",
    email: "emily.johnson@example.com",
    meet_link: "https://meet.google.com/jkl-mnop-qrs",
    local_id: "EJ002",
    student_code: "ST002",
    campus: "North Campus"
  },
  {
    student_id: "3",
    campus_id: "101",
    grade_id: "11",
    language_id: "2",
    name: "Michael Brown",
    gender: "Male",
    email: "michael.brown@example.com",
    meet_link: "https://meet.google.com/tuv-wxyz-123",
    local_id: "MB003",
    student_code: "ST003",
    campus: "Main Campus"
  }
];

// Mock campuses, grades, and languages for dropdowns
export const campuses = [
  { campus_id: "101", name: "Main Campus" },
  { campus_id: "102", name: "North Campus" },
  { campus_id: "103", name: "South Campus" }
];

export const grades = [
  { grade_id: "9", name: "9th Grade" },
  { grade_id: "10", name: "10th Grade" },
  { grade_id: "11", name: "11th Grade" },
  { grade_id: "12", name: "12th Grade" }
];

export const languages = [
  { language_id: "1", name: "English" },
  { language_id: "2", name: "Spanish" },
  { language_id: "3", name: "French" }
];

// Mock service hooks for student data
export function useStudents() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  
  const getStudents = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return students;
  };

  const getStudentById = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return students.find(student => student.student_id === id);
  };

  const addStudent = async (student: Omit<Student, "student_id">) => {
    // Generate a new ID
    const newId = (Math.max(...students.map(s => parseInt(s.student_id))) + 1).toString();
    
    const newStudent: Student = {
      ...student,
      student_id: newId
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = async (updatedStudent: Student) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStudents(prev => 
      prev.map(student => 
        student.student_id === updatedStudent.student_id ? updatedStudent : student
      )
    );
    
    return updatedStudent;
  };

  const deleteStudent = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setStudents(prev => prev.filter(student => student.student_id !== id));
    return true;
  };

  const addMultipleStudents = async (newStudents: Omit<Student, "student_id">[]) => {
    // Start ID after the current highest
    let nextId = Math.max(...students.map(s => parseInt(s.student_id))) + 1;
    
    const studentsWithIds = newStudents.map(student => ({
      ...student,
      student_id: (nextId++).toString()
    }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStudents(prev => [...prev, ...studentsWithIds]);
    return studentsWithIds;
  };

  return {
    students,
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    addMultipleStudents
  };
}
