import { Model } from "mongoose";

export async function paginate(
    model: Model<any, any>,
    page: number = 1,
    perPage: number = 8,
    filter: Record<string, any> = {},
    sort: Record<string, any> = { createdAt: -1 }
) {
    const p = Number.isNaN(Number(page)) ? 1 : Math.max(1, Math.floor(page));
    const limit = perPage;
    const skip = (p - 1) * limit;

    const [docs, total] = await Promise.all([
        model.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
        model.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        docs,
        total,
        page: p,
        perPage: limit,
        totalPages,
    };
}