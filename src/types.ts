
export interface Student {
  student_id: string;
  campus_id: string;
  grade_id: string;
  language_id: string;
  name: string;
  gender: string;
  email: string;
  meet_link?: string;
  local_id?: string;
  student_code?: string;
  campus?: string;
}

export interface Campus {
  campus_id: string;
  name: string;
}

export interface Grade {
  grade_id: string;
  name: string;
}

export interface Language {
  language_id: string;
  name: string;
}
