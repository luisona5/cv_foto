export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImage?:string; // URI de la imagen
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export type SkillLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';


export interface Skill {
  id: string; // Para identificar de forma única cada habilidad
  name: string;
  level: SkillLevel;
}


//---------------------------------------------------

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}
