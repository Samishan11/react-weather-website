import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
const API_KEY = "1c5d8a607c8ec51b649bdd2ce052e5ff";

export const apiSlice = createApi({
    reducerPath: 'weather',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    tagTypes: ["Weather"],
    endpoints: (build) => ({
        getWeather: build.query({
            query: () => {
                return {
                    url: `https://api.openweathermap.org/data/2.5/box/city?bbox=-180,-90,180,90&units=metric&appid=${API_KEY}`
                };
            },
            providesTags: (result, error) => [{ type: "Weather" }, { type: "Weather" }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetWeatherQuery } = apiSlice;