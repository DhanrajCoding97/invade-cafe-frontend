// Helper to flatten nested error messages into a string array
export const getErrorMessages = (errors: Record<string, any>): string[] => {
  const messages: string[] = [];

  const extract = (obj: Record<string, any>) => {
    Object.values(obj).forEach((value) => {
      if (value?.message) {
        messages.push(value.message);
      }
      if (typeof value === 'object' && !value?.message) {
        extract(value);
      }
    });
  };

  extract(errors);
  return messages;
};
