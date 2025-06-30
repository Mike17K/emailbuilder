export interface Template {
  id: string;
  sections: { [key: string]: string };
  exampleData?: string;
  title: string;
}
