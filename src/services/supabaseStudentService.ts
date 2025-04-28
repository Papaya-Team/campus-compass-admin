
import { supabase } from "@/integrations/supabase/client";
import { Student, Campus, Grade, Language } from "@/types";
import { useState } from "react";

// Service hooks for student data using Supabase
export function useSupabaseStudents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudents = async (): Promise<Student[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .select(`
          id,
          name,
          campus_id,
          grade_id,
          language_id,
          campus:campus_id (name),
          grade:grade_id (name),
          language:language_id (name)
        `);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the Supabase response to our Student type
      return data.map((item: any) => ({
        student_id: item.id.toString(),
        name: item.name,
        campus_id: item.campus_id,
        grade_id: item.grade_id,
        language_id: item.language_id,
        campus: item.campus?.name,
        gender: "", // Supabase schema doesn't have this field yet
        email: "", // Supabase schema doesn't have this field yet
        meet_link: "", // Supabase schema doesn't have this field yet
        local_id: "", // Supabase schema doesn't have this field yet
        student_code: "" // Supabase schema doesn't have this field yet
      }));
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching students:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentById = async (id: string): Promise<Student | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .select(`
          id,
          name,
          campus_id,
          grade_id,
          language_id,
          campus:campus_id (name),
          grade:grade_id (name),
          language:language_id (name)
        `)
        .eq('id', parseInt(id))
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: data.campus?.name,
        gender: "", // Not in current schema
        email: "", // Not in current schema
        meet_link: "", // Not in current schema
        local_id: "", // Not in current schema
        student_code: "" // Not in current schema
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching student by ID:", err);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, "student_id">): Promise<Student> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .insert({
          name: student.name,
          campus_id: student.campus_id,
          grade_id: student.grade_id,
          language_id: student.language_id
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: student.campus,
        gender: student.gender || "",
        email: student.email || "",
        meet_link: student.meet_link || "",
        local_id: student.local_id || "",
        student_code: student.student_code || ""
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (updatedStudent: Student): Promise<Student> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('student')
        .update({
          name: updatedStudent.name,
          campus_id: updatedStudent.campus_id,
          grade_id: updatedStudent.grade_id,
          language_id: updatedStudent.language_id
        })
        .eq('id', parseInt(updatedStudent.student_id))
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        student_id: data.id.toString(),
        name: data.name,
        campus_id: data.campus_id,
        grade_id: data.grade_id,
        language_id: data.language_id,
        campus: updatedStudent.campus,
        gender: updatedStudent.gender || "",
        email: updatedStudent.email || "",
        meet_link: updatedStudent.meet_link || "",
        local_id: updatedStudent.local_id || "",
        student_code: updatedStudent.student_code || ""
      };
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('student')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting student:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMultipleStudents = async (newStudents: Omit<Student, "student_id">[]): Promise<Student[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const studentsToInsert = newStudents.map(student => ({
        name: student.name,
        campus_id: student.campus_id,
        grade_id: student.grade_id,
        language_id: student.language_id
      }));
      
      const { data, error } = await supabase
        .from('student')
        .insert(studentsToInsert)
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Map the returned data to our Student type
      return data.map((item: any, index: number) => ({
        student_id: item.id.toString(),
        name: item.name,
        campus_id: item.campus_id,
        grade_id: item.grade_id,
        language_id: item.language_id,
        campus: newStudents[index].campus,
        gender: newStudents[index].gender || "",
        email: newStudents[index].email || "",
        meet_link: newStudents[index].meet_link || "",
        local_id: newStudents[index].local_id || "",
        student_code: newStudents[index].student_code || ""
      }));
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding multiple students:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    addMultipleStudents
  };
}

// Get reference data from Supabase
export async function getCampuses(): Promise<Campus[]> {
  try {
    const { data, error } = await supabase
      .from('campus')
      .select('campus_id, name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return [];
  }
}

export async function getGrades(): Promise<Grade[]> {
  try {
    const { data, error } = await supabase
      .from('grade')
      .select('grade_id, name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching grades:", error);
    return [];
  }
}

export async function getLanguages(): Promise<Language[]> {
  try {
    const { data, error } = await supabase
      .from('language')
      .select('language_id, name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}
