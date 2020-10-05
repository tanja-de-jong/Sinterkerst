import fetchDefaults from 'fetch-defaults'

export const apiFetch = (token) => fetchDefaults(fetch, {
	headers: {Authorization: 'Bearer ' + token}
})