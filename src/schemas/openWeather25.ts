import { z } from "zod"

export const Weather25Schema = z.object({
    coord: z.object({
        lon: z.number(),
        lat: z.number(),
    }),
    weather: z.array(
        z.object({
            id: z.number(),
            main: z.string(),
            description: z.string(),
            icon: z.string(),
        })
    ),
    base: z.string(),
    main: z.object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        pressure: z.number(),
        humidity: z.number(),
        sea_level: z.number().optional(),
        grnd_level: z.number().optional(),
    }),
    visibility: z.number(),
    wind: z.object({
        speed: z.number(),
        deg: z.number(),
        gust: z.number().optional(),
    }),
    clouds: z.object({
        all: z.number(),
    }),
    dt: z.number(),
    sys: z.object({
        type: z.number().optional(),
        id: z.number().optional(),
        country: z.string(),
        sunrise: z.number(),
        sunset: z.number(),
    }),
    timezone: z.number(),
    id: z.number(),
    name: z.string(),
    cod: z.union([z.number(), z.string()]),
})

export const Forecast25Schema = z.object({
    cod: z.string(),
    message: z.union([z.number(), z.string()]),
    cnt: z.number(),
    list: z.array(
        z.object({
            dt: z.number(),
            main: z.object({
                temp: z.number(),
                feels_like: z.number(),
                temp_min: z.number(),
                temp_max: z.number(),
                pressure: z.number(),
                sea_level: z.number().optional(),
                grnd_level: z.number().optional(),
                humidity: z.number(),
                temp_kf: z.number().optional(),
            }),
            weather: z.array(
                z.object({
                    id: z.number(),
                    main: z.string(),
                    description: z.string(),
                    icon: z.string(),
                })
            ),
            clouds: z.object({
                all: z.number(),
            }),
            wind: z.object({
                speed: z.number(),
                deg: z.number(),
                gust: z.number().optional(),
            }),
            visibility: z.number(),
            pop: z.number(),
            rain: z.object({ "3h": z.number() }).optional(),
            sys: z.object({
                pod: z.string(),
            }),
            dt_txt: z.string(),
        })
    ),
    city: z.object({
        id: z.number(),
        name: z.string(),
        coord: z.object({
            lat: z.number(),
            lon: z.number(),
        }).optional(),
        country: z.string(),
        population: z.number(),
        timezone: z.number(),
        sunrise: z.number(),
        sunset: z.number(),
    }),
})

export type Weather25 = z.infer<typeof Weather25Schema>
export type Forecast25 = z.infer<typeof Forecast25Schema>
