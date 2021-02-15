import axios from "axios";

export default class DayServices {
  static instanceAxios = axios.create({
    baseUrl: "api.openweathermap.org/data/2.5"
  });

  static getWeatherByCity = () => {
    return DayServices.instanceAxios.get(
      "/weather?q=London,uk&APPID=895c2e915fe7657931bbaf9b4fe69e96"
    );
  };
}

// const weatherApiKey = "895c2e915fe7657931bbaf9b4fe69e96";

// export const weatherByCity = cityName => {
//   return axios
//     .get(
//       "api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=895c2e915fe7657931bbaf9b4fe69e96"
//     )
//     .then(res => {
//       console.log(res);
//       return res.data;
//     });
// };
