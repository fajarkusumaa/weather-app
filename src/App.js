// import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import './App.css';
import { Button, Col, Container, Form, Row, InputGroup } from "react-bootstrap";
import { FiSearch } from 'react-icons/fi';
import BigCities from './components/BigCities.jsx'



const Title = styled.h1`
  font-size: 2em;
`;

const Flex = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
`;

const FlexRow = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 16px;
`;

function App() {

  const [unit, setUnit] = useState('metric');

  const [data, setData] = useState({
    temp: 10,
    city: '',
    humidity: 10,
    speed: 2,
    timezone: (7 * 60 * 60),
    icons: '',
    weatherView: 'Haze'
  });

  function handleCityChange(city) {
    setCity(city);
  }

  const getimgUrl = (e) => {
    const API_KEY = '35875573-23e5ea2fc004060a61c812d00';
    const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${e}&image_type=photo`;
    console.log(e);
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        // Get the URL of the first image in the data array
        const imageUrl = data.hits[0].webformatURL;
        setBg(imageUrl);
        console.log(imageUrl)
      })
      .catch(error => console.log(error));
  };




  const handleClick = () => {
    if (city !== "") {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=281b1bf64dd901bf03d0cb8dbb2f18dd&units=${unit}`;
      axios
        .get(url)
        .then(res => {
          setData({
            ...data,
            temp: res.data.main.temp,
            mintemp: res.data.main.temp_min,
            maxtemp: res.data.main.temp_max,
            humidity: res.data.main.humidity,
            timezone: res.data.timezone,
            feels_like: res.data.main.feels_like,
            wind: res.data.wind.speed,
            city: res.data.name,
            icons: res.data.weather[0].icon,
            weatherView: res.data.weather[0].description
          });

          console.log(res.data);
          setError('');
          getimgUrl(res.data.weather[0].description);
        })

        .catch(err => {
          if (err.response.status == 404) {
            setError("Invalid City Name!")
          }
          else {
            setError('')
          }
        });
    }
  }


  const [city, setCity] = useState('London');
  const [error, setError] = useState('');

  // Set Local Time
  const [localTime, setLocalTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const utcTimestamp = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
  const offsetTimestamp = utcTimestamp + (data.timezone * 1000);
  const localTimeWithOffset = new Date(offsetTimestamp).toLocaleTimeString();
  // End of Set Local Time


  // Set for iconUrl
  const iconUrl = `https://openweathermap.org/img/wn/${data.icons}@2x.png`;

  // Set and Call API for bgUrl
  const [bg, setBg] = useState('https://pixabay.com/get/gefadd2c771680af81ed30672ca9819f661f1f5a06b52e2d1e06c56609b01fc6b4eb16106c3e4fd9c6fc473a26cc33f906cfa656c58961d1aa14396423b15ed70_640.jpg')

  return (
    <Flex className="App"  >
      <div className="main-bg" style={{
        backgroundImage: `url(${bg})`
      }}></div>

      {/* <select id="unit-select" value={unit} onChange={handleUnitChange}>
        <option value="metric">Metric</option>
        <option value="imperial">Imperial</option>
      </select> */}

      <Container fluid style={{ zIndex: 1 }} >
        <Row className="vh-100 text-white">
          <Col className="px-4 left-side">
            <div className="d-flex align-items-center gap-2 justify-content-center mt-5 flex-column">

              <InputGroup className="my-3 radius-0">
                <Form.Control
                  className="border-0 border-bottom radius-0 search-bar "
                  type="text"
                  placeholder="Enter city name"
                  onChange={e => setCity(e.target.value)}
                />
                <Button onClick={handleClick} style={{ border: 'none' }} className="search-bar" variant="outline-secondary" id="button-addon1">
                  <FiSearch onClick={handleClick} />
                </Button>
              </InputGroup>


              <p>{error}</p>

              <p>{localTimeWithOffset}</p>
              <p>{bg.imageUrl}</p>


              <Flex>
                <Title style={{ fontSize: 48 }}>{data.city}</Title>
                <p className="opacity-50">{data.weatherView}</p>
              </Flex>

              {/* image */}
              <img src={iconUrl} alt="" />


              {/* list tempterature */}
              <FlexRow className="align-items-center">
                <Flex className="opacity-75">
                  <p className="m-0">LOW</p>
                  <h5 className="m-0">
                    {Math.round(data.mintemp)} °C
                  </h5>

                </Flex>

                <Flex >
                  <Title style={{ fontSize: 56 }} className="m-0 "> {Math.round(data.temp)} °C</Title>
                </Flex>

                <Flex className="opacity-75">
                  <p className="m-0">HIGH</p>
                  <h5 className="m-0">
                    {Math.round(data.maxtemp)} °C
                  </h5>

                </Flex>
              </FlexRow>
              <FlexRow className="mt-2 description">
                <p>HUMIDITY: {data.humidity} %</p>
                <p>FEELS LIKE: {data.feels_like} °C</p>
                <p>WIND: {data.wind} m/s</p>
              </FlexRow>
            </div>
          </Col>

          <Col xs={9} className="">
            <Flex className="d-flex flex-column justify-content-center vh-100">
              <BigCities updateCity={handleCityChange} />
            </Flex>

          </Col>
        </Row>
      </Container>
    </Flex >
  );
}

export default App;
