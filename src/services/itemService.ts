import { StudyItem, ItemFormData } from "@/schemas/item";

// Simulating database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = "studypilot_items_mock_db";

const getDb = (): StudyItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
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

  async deleteItem(id: string): Promise<void> {
    await delay(400);
    const db = getDb();
    const updated = db.filter(item => item.id !== id);
    if (updated.length === db.length) throw new Error("Item not found");
    saveDb(updated);
  }
};
