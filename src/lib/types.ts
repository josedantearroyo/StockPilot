export type ItemType = 'Herramienta' | 'Material' | 'EPP';
export type ItemStatus = 'Disponible' | 'Asignado' | 'En Mantenimiento';

export interface ChangeRecord {
  date: string; // ISO date string
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
}

export interface Employee {
  id: string;
  name: string;
  position: string;
}
