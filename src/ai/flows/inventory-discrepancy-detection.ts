// src/ai/flows/inventory-discrepancy-detection.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting inventory discrepancies.
 *
 * It compares expected inventory based on assignments against current stock levels
 * to identify potential losses or misplacements. It exports:
 *
 * - `detectInventoryDiscrepancy`: Function to trigger the discrepancy detection flow.
 * - `InventoryDiscrepancyInput`:  The input schema for the discrepancy detection.
 * - `InventoryDiscrepancyOutput`: The output schema for the discrepancy detection.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InventoryDiscrepancyInputSchema = z.object({
  inventoryData: z.string().describe('JSON string of current inventory levels for each item.'),
  assignmentData: z.string().describe('JSON string of items assigned to each employee.'),
});
export type InventoryDiscrepancyInput = z.infer<typeof InventoryDiscrepancyInputSchema>;

const InventoryDiscrepancyOutputSchema = z.object({
  discrepancies: z.array(
    z.object({
      item: z.string().describe('The name of the item with a discrepancy.'),
      expected: z.number().describe('The expected quantity of the item based on assignments.'),
      actual: z.number().describe('The actual quantity of the item in inventory.'),
      difference: z.number().describe('The difference between expected and actual quantities.'),
      employees: z.array(z.string()).optional().describe('List of employees who have the item assigned, if applicable.'),
    })
  ).describe('A list of inventory discrepancies detected.'),
  summary: z.string().describe('A summary of the identified discrepancies.'),
});
export type InventoryDiscrepancyOutput = z.infer<typeof InventoryDiscrepancyOutputSchema>;

export async function detectInventoryDiscrepancy(input: InventoryDiscrepancyInput): Promise<InventoryDiscrepancyOutput> {
  return inventoryDiscrepancyFlow(input);
}

const inventoryDiscrepancyPrompt = ai.definePrompt({
  name: 'inventoryDiscrepancyPrompt',
  input: {schema: InventoryDiscrepancyInputSchema},
  output: {schema: InventoryDiscrepancyOutputSchema},
  prompt: `You are an inventory management expert. Your task is to analyze inventory data and assignment records to identify discrepancies.

  Instructions:
  1.  Parse the inventory data and assignment records, which are provided as JSON strings.  The inventory data contains the current stock level of each item. The assignment records detail which items are assigned to each employee.
  2.  For each item, calculate the expected quantity based on the assignment records. This is done by counting the number of times each item appears in the assignments.
  3.  Compare the expected quantity with the actual quantity in the inventory data.
  4.  If there's a discrepancy (expected quantity != actual quantity), list the item, the expected quantity, the actual quantity, and the difference.
      Also include a list of employees who have the item assigned, if applicable.
  5.  Provide a summary of all identified discrepancies.

  Inventory Data (JSON):
  {{{inventoryData}}}

  Assignment Records (JSON):
  {{{assignmentData}}}

  Output Format:
  Your output should be a JSON object with a "discrepancies" array and a "summary" field. The "discrepancies" array should contain objects with the following fields: "item", "expected", "actual", "difference", and optionally, "employees". The "summary" should provide a brief overview of the discrepancies found.
  Ensure the output is valid JSON and conforms to the schema. Be concise.
  `,
});

const inventoryDiscrepancyFlow = ai.defineFlow(
  {
    name: 'inventoryDiscrepancyFlow',
    inputSchema: InventoryDiscrepancyInputSchema,
    outputSchema: InventoryDiscrepancyOutputSchema,
  },
  async input => {
    try {
      JSON.parse(input.inventoryData);
    } catch (e: any) {
      throw new Error("Invalid JSON for inventoryData: " + e.message);
    }

    try {
      JSON.parse(input.assignmentData);
    } catch (e: any) {
      throw new Error("Invalid JSON for assignmentData: " + e.message);
    }

    const {output} = await inventoryDiscrepancyPrompt(input);
    return output!;
  }
);
