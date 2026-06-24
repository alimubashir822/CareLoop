"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Clinic {
  id: string;
  name: string;
  primaryColor: string;
  brandName: string;
}

interface ClinicContextType {
  currentClinic: Clinic;
  setCurrentClinic: (clinic: Clinic) => void;
  clinics: Clinic[];
  isDarkMode: boolean;
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const defaultClinics: Clinic[] = [
  { 
    id: "dental-clinic-id", 
    name: "CareLoop Dental Center", 
    primaryColor: "#0d9488", // Teal-600
    brandName: "CareLoop AI"
  },
  { 
    id: "surgical-clinic-id", 
    name: "CareLoop Surgical Clinic", 
    primaryColor: "#6366f1", // Indigo-600
    brandName: "Summit Surgical"
  },
  { 
    id: "primary-clinic-id", 
    name: "CareLoop Primary Care", 
    primaryColor: "#0284c7", // Sky-600
    brandName: "HealthFlow Primary"
  },
];

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [currentClinic, setCurrentClinicState] = useState<Clinic>(defaultClinics[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to Dark mode for premium look
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Apply dark/light theme classes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Apply dynamic color branding theme properties
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", currentClinic.primaryColor);
      
      // Compute helper variations for ring glow focus rings if necessary
      document.documentElement.style.setProperty("--ring", currentClinic.primaryColor);
    }
  }, [currentClinic]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setCurrentClinic = (clinic: Clinic) => {
    setCurrentClinicState(clinic);
    localStorage.setItem("selectedClinicId", clinic.id);
  };

  useEffect(() => {
    const savedId = localStorage.getItem("selectedClinicId");
    if (savedId) {
      const matched = defaultClinics.find((c) => c.id === savedId);
      if (matched) setCurrentClinicState(matched);
    }
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        currentClinic,
        setCurrentClinic,
        clinics: defaultClinics,
        isDarkMode,
        toggleTheme,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
}
