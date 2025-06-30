export function renderTemplate(template: any, data: any) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (match: any, path: any) => {
    const keys = path.split('.');
    let value = data;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return match;
    }
    return value;
  });
}
