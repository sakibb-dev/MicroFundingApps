// Shared shape for every backend list endpoint that now uses
// Laravel's paginate() instead of get() -- see docs/API.md.
export async function unwrapPaginated(promise) {
  const { data } = await promise;
  const paginator = data.data;
  return {
    items: paginator.data,
    meta: {
      currentPage: paginator.current_page,
      lastPage: paginator.last_page,
      perPage: paginator.per_page,
      total: paginator.total,
      from: paginator.from,
      to: paginator.to,
    },
  };
}
