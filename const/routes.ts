const routes = {
  insertDomain: {
    url: "/domains",
    method: "POST",
  },
  getDomains: {
    url: "/domains",
    method: "GET",
  },
  deleteDomain: (id: string) => ({
    url: `/domains/${id}`,
    method: "DELETE",
  }),
  editDomain: (id: string) => ({
    url: `/domains/${id}`,
    method: "PUT",
  }),
}

export default routes
