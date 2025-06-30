import type { Template } from "../types";

const defaultTemplate = {
  id: Date.now().toString(),
  sections: {
    title: "Default Title",
    "main-content": "Dear {{customer.name}},\n\nThank you for your purchase of {{order.product}}. Your order number is {{order.number}}.\n\nBest regards,\nThe Team",
    code: "// Default code snippet"
  },
  exampleData: JSON.stringify({
    customer: { name: "John Doe" },
    order: { number: 12345, product: "Widget" }
  }, null, 2)
};

export const StorageService = {
  save: (templates: Template[]): void => localStorage.setItem("templates", JSON.stringify(templates)),
  load: (): Template[] => JSON.parse(localStorage.getItem("templates") as string) || [defaultTemplate]
};
