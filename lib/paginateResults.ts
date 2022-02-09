const paginateResults = async <Item>(
  cb: (
    cursor?: string
  ) => Promise<{ paging: { cursor?: string }; items: Item[] }>
) => {
  const paginate = async (cursor?: string): Promise<Item[]> => {
    const response = await cb(cursor);

    if (response.paging.cursor) {
      const nextItems = await paginate(response.paging.cursor);

      return [...response.items, ...nextItems];
    }

    return response.items;
  };

  return paginate();
};

export default paginateResults;
