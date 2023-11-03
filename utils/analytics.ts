import { Model, Document } from "mongoose";

interface monthData {
  month: string;
  count: number;
}

// getnate last 12 month data

export async function getnateLast12Month<T extends Document>(
  model: Model<T>
): Promise<{ last12Month: monthData[] }> {
  const last12Month: monthData[] = [];

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );

    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthYear = endDate.toLocaleString("defult", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    last12Month.push({ month: monthYear, count });
  }

  return { last12Month };
}
