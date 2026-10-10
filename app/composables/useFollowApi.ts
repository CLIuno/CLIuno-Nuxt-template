export function useFollowApi() {
  const http = useHttp()
  return {
    follow: (userId: string) => http.post(`/follows/${userId}/follow`),
    unfollow: (userId: string) => http.delete(`/follows/${userId}/follow`),
    getFollowers: (userId: string) => http.get(`/follows/${userId}/followers`),
    getFollowing: (userId: string) => http.get(`/follows/${userId}/following`),
    isFollowing: (userId: string) => http.get(`/follows/${userId}/is-following`),
  }
}
