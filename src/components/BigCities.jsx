import React, { useState, useEffect } from "react";
import axios from "axios";

function BigCities() {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const cities = [
            "Tokyo",
            "New York",
            "Shanghai",
            "London",
            "Paris",
            "Moscow",
            "Jakarta"
        ];
        const unit = "metric"; // or "imperial" for Fahrenheit
        const urls = cities.map(
            (city) =>
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=281b1bf64dd901bf03d0cb8dbb2f18dd&units=${unit}`
        );

        Promise.all(urls.map((url) => axios.get(url)))
            .then((responses) => {
                const data = responses.map((response) => response.data);
                setWeatherData(data);
            })
            .catch((err) => {
                if (err.response.status === 404) {
                }
            });
    }, []);

    return (
        <div className="d-flex flex-row justify-content-around px-4">
            {weatherData.map((data, index) => (
                <div className="text-start" key={index}>
                    <h1>{Math.round(data.main.temp)}&deg;C</h1>
                    <button>{data.name}</button>
                </div>
            ))}
        </div>
    );
}

export default BigCities;
