import { StudyItem, ItemFormData } from "@/schemas/item";

// Simulating database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = "studypilot_items_mock_db";

const getDb = (): StudyItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const items: StudyItem[] = JSON.parse(data);
    const cleaned = items.filter(item => {
      const isGarbage = 
        item.description?.includes("bnmmbnvm") || 
        (item.title?.toLowerCase() === "math" && item.description && item.description.length > 15 && !item.description.includes(" "));
      return !isGarbage;
    });
    if (cleaned.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
};

const saveDb = (data: StudyItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const itemService = {
  async getItems(): Promise<StudyItem[]> {
    await delay(500);
    return getDb();
  },

  async getItem(id: string): Promise<StudyItem> {
    await delay(300);
    const db = getDb();
    const item = db.find(item => item.id === id);
    if (!item) throw new Error("Item not found");
    return item;
  },

  async createItem(data: ItemFormData): Promise<StudyItem> {
    await delay(600);
    const db = getDb();
    
    const newItem: StudyItem = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      userId: "mock-user-id", // To be replaced with real auth session later
    };

    db.unshift(newItem);
    saveDb(db);
    return newItem;
  },

  async updateItem(id: string, data: ItemFormData): Promise<StudyItem> {
    await delay(500);
    const db = getDb();
    const index = db.findIndex(item => item.id === id);
    if (index === -1) throw new Error("Item not found");
    
    const updatedItem: StudyItem = {
      ...db[index],
      ...data,
      id,
    };
    
    db[index] = updatedItem;
    saveDb(db);
    return updatedItem;
  },

  async deleteItem(id: string): Promise<void> {
    await delay(400);
    const db = getDb();
    const updated = db.filter(item => item.id !== id);
    if (updated.length === db.length) throw new Error("Item not found");
    saveDb(updated);
  }
};
