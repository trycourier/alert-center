/**
 * A helper function to paginate over a list of results from an API
 * endpoint that supports pagination.
 *
 * @param callback The callback to execute for each page of results
 *                 with the current cursor as the param.
 * @returns A promise that resolves with all results when all pages
 *          have been processed.
 */
const paginateResults = async <Item>(
  callback: (
    cursor?: string
  ) => Promise<{ paging: { cursor?: string }; items: Item[] }>
) => {
  const paginate = async (cursor?: string): Promise<Item[]> => {
    const response = await callback(cursor);

    if (response.paging.cursor) {
      const nextItems = await paginate(response.paging.cursor);

      return [...response.items, ...nextItems];
    }

    return response.items;
  };

  return paginate();
};

export default paginateResults;
