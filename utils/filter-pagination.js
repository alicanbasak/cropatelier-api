export async function applyFiltersAndPagination(baseQuery, req) {
  //  Apply filters
  if (req.query.name) {
    baseQuery = baseQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  if (req.query.color) {
    baseQuery = baseQuery.find({
      color: { $regex: req.query.color, $options: "i" },
    });
  }

  if (req.query.size) {
    baseQuery = baseQuery.find({
      size: { $regex: req.query.size, $options: "i" },
    });
  }

  if (req.query.category) {
    baseQuery = baseQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  if (req.query.price) {
    const price = req.query.price.split("-");
    baseQuery = baseQuery.find({ price: { $gte: price[0], $lte: price[1] } });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  baseQuery = baseQuery.skip(startIndex).limit(limit);

  // Count total documents
  const total = await baseQuery.model.countDocuments();

  // Pagination object
  const pagination = {};

  // Next and prev
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Return query, pagination and total
  return { query: baseQuery, pagination, total };
}
