export type ItemType = 'Herramienta' | 'Material' | 'EPP';
export type ItemStatus = 'Disponible' | 'Asignado' | 'En Mantenimiento';

export interface ChangeRecord {
  date: string; // ISO date string
}

export interface ReviewRecord {
    date: string; // ISO date string
    status: 'Operativa' | 'Defectuosa';
    actionTaken?: 'ninguna' | 'cambiada' | 'quitada';
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  status: ItemStatus;
  assignedTo?: string; // Employee ID
  assignmentDate?: string; // ISO date string
  changeHistory?: ChangeRecord[];
  lastReviewDate?: string; // ISO date string for tools
  reviewHistory?: ReviewRecord[];
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
}
