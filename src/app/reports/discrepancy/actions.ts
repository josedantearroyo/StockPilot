'use server';

import {
  detectInventoryDiscrepancy,
  type InventoryDiscrepancyInput,
  type InventoryDiscrepancyOutput,
} from '@/ai/flows/inventory-discrepancy-detection';

export async function runDiscrepancyCheck(
  input: InventoryDiscrepancyInput
): Promise<InventoryDiscrepancyOutput> {
  // Basic validation to ensure JSON is not empty
  if (!input.inventoryData || input.inventoryData.trim() === '{}') {
    throw new Error('Inventory data cannot be empty.');
  }
  if (!input.assignmentData || input.assignmentData.trim() === '{}') {
    throw new Error('Assignment data cannot be empty.');
  }

  try {
    const result = await detectInventoryDiscrepancy(input);
    return result;
  } catch (error: any) {
    console.error('Error running discrepancy check:', error);
    // Return a more user-friendly error message
    throw new Error(
      `An error occurred during AI processing: ${error.message}`
    );
  }
}
