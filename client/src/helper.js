import fetchIntercept from 'fetch-intercept'

export const registerFetchIntercept = (token) => {
	const unregister = fetchIntercept.register({
		request: function (url, config) {
			// Modify the url or config here
			let newConfig
			if (config && config.headers) {
				newConfig = config
				newConfig.headers = {
					...newConfig.headers,
					Authorization: `Bearer ${token}`
				}
			} else {
				 newConfig = {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			}
			return [url, newConfig];
		},

		requestError: function (error) {
			// Called when an error occured during another 'request' interceptor call
			return Promise.reject(error);
		},

		response: function (response) {
			// Modify the reponse object
			return response;
		},

		responseError: function (error) {
			// Handle an fetch error
			return Promise.reject(error);
		}
	})

	return unregister
}

// const useFetch = () => {
// 	const { isAuthenticated, getTokenSilently } = useAuth0()
// 	let headers
//
// 	const fetchData = async (url) => {
// 		if (isAuthenticated) {
// 			const token = await getTokenSilently()
// 			headers = {
// 				headers: {Authorization: `Bearer ${token}`}
// 			}
// 		}
// 		return await fetch(url, headers)
// 	}
// 	return fetchData
// }
//
// export default useFetch