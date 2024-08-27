export const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting local storage:', error);
  }
};

export const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const removeFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const updateStorage = (step: string, data: Record<string, any>) => {
  try {
    const storageData = {
      expires: Math.floor(Date.now() / 1000) + 86400, // 24 hours expiration
      data: {
        step,
        ...data,
      }
    };

    console.log(storageData);
    saveToLocalStorage('poolCreation', storageData);
    console.log('Storage updated:', storageData);
  } catch (error) {
    console.error('Error updating storage:', error);
  }
};
