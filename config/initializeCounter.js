import { Counter } from "../models/counter.js";


async function initializeCounter() {
  try {
    const userPositionCounter = await Counter.findById("id");
    if (!userPositionCounter) {
      await Counter.create({ _id: "id", seq: 0 });
      console.log("Counter initialized.");
    } else {
      console.log("Counter already initialized.");
    }
  } catch (error) {
    console.error("Error initializing counter:", error);
  }
}

export { initializeCounter };
