import type { Item, Employee } from './types';

export const inventory: Item[] = [
  {
    id: 'T001',
    name: 'Taladro Percutor',
    type: 'Herramienta',
    quantity: 5,
    status: 'Disponible',
  },
  {
    id: 'T002',
    name: 'Multímetro Digital',
    type: 'Herramienta',
    quantity: 3,
    status: 'Asignado',
    assignedTo: 'E001',
    assignmentDate: '2023-10-15',
  },
  {
    id: 'M001',
    name: 'Cable THHN #12 (Rollo 100m)',
    type: 'Material',
    quantity: 20,
    status: 'Disponible',
  },
  {
    id: 'M002',
    name: 'Caja de Breakers (12 circuitos)',
    type: 'Material',
    quantity: 10,
    status: 'Asignado',
    assignedTo: 'E002',
    assignmentDate: '2023-10-20',
  },
  {
    id: 'E001_EPP',
    name: 'Casco de Seguridad',
    type: 'EPP',
    quantity: 15,
    status: 'Disponible',
  },
  {
    id: 'E002_EPP',
    name: 'Guantes Dieléctricos',
    type: 'EPP',
    quantity: 10,
    status: 'Asignado',
    assignedTo: 'E003',
    assignmentDate: '2023-10-22',
    changeHistory: [
      { date: '2023-10-22T10:00:00.000Z' },
      { date: '2023-11-22T11:30:00.000Z' },
    ],
  },
  {
    id: 'T003',
    name: 'Pinza Amperimétrica',
    type: 'Herramienta',
    quantity: 4,
    status: 'Disponible',
  },
  {
    id: 'M003',
    name: 'Conectores Wago (Caja 100u)',
    type: 'Material',
    quantity: 50,
    status: 'Asignado',
    assignedTo: 'E001',
    assignmentDate: '2023-10-18',
  },
  {
    id: 'E003_EPP',
    name: 'Gafas de Seguridad',
    type: 'EPP',
    quantity: 20,
    status: 'Disponible',
  },
  {
    id: 'T004',
    name: 'Escalera de Fibra de Vidrio 6m',
    type: 'Herramienta',
    quantity: 2,
    status: 'En Mantenimiento',
  },
];

export const employees: Employee[] = [
  {
    id: 'E001',
    firstName: 'Juan',
    lastName: 'Pérez',
    position: 'Electricista Senior',
  },
  {
    id: 'E002',
    firstName: 'Maria',
    lastName: 'Garcia',
    position: 'Jefe de Proyectos',
  },
  {
    id: 'E003',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    position: 'Técnico Electricista',
  },
  {
    id: 'E004',
    firstName: 'Ana',
    lastName: 'Martinez',
    position: 'Ayudante General',
  },
];
