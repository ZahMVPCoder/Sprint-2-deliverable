"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Student {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  lessonsCompleted: number;
  averageQuizScore: number;
}

interface AuthContextType {
  student: Student | null;
  setStudent: (student: Student | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  student: null,
  setStudent: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudentState] = useState<Student | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("brightpath_student");
      if (stored) setStudentState(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const setStudent = (s: Student | null) => {
    setStudentState(s);
    if (s) {
      localStorage.setItem("brightpath_student", JSON.stringify(s));
    } else {
      localStorage.removeItem("brightpath_student");
    }
  };

  const logout = () => setStudent(null);

  return (
    <AuthContext.Provider value={{ student, setStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
