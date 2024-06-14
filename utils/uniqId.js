import { Counter } from "../models/counter.js";

const uniqId = async () => {
  let counter = await Counter.findOne({ _id: "id" });

  if (!counter) {
    counter = new Counter({
      _id: "id",
      seq: 0,
      lastReset: new Date(),
    });
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
  const yearLastDigit = currentYear.toString().slice(-1);

  const lastResetDate = new Date(counter.lastReset);
  const lastResetMonth = lastResetDate.getMonth() + 1;
  const lastResetYear = lastResetDate.getFullYear();

  if (
    now.getFullYear() !== lastResetYear ||
    now.getMonth() + 1 !== lastResetMonth
  ) {
    counter.seq = 1;
    counter.lastReset = now;
  } else {
    counter.seq++;
  }
  const counterString = counter.seq.toString().padStart(3, "0");

  const activationToken = yearLastDigit + currentMonth + counterString;

  await counter.save();
  return activationToken;
};

export { uniqId };
