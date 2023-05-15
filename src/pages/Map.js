import React, {useEffect, useState} from 'react'
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import Icon from "../assets/images/coronavirus.svg";
import Api from "../Api";
import states from "../data/states.json";
import Header from "../components/Header";
import {useLocation} from "react-router-dom";
import qs from "query-string";

const containerStyle = {
    width: '100wh',
    height: '830px'
};

const center = {
    lat: 37.142635,
    lng: -96.7265
};

function Map() {
    const location = useLocation();
    const query = qs.parse(location.search);
    const maxSize = 200;
    const [data, setData] = useState([]);
    const [mapData, setMapData] = useState([])
    const [minNumber, setMinNumber] = useState(0);
    const [maxNumber, setMaxNumber] = useState();
    const [minSize, setMinSize] = useState();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBxUOCJq3gmitl1Pe6rRfjiWqzr_Wlj7ps"
    })


    useEffect(() => {
        (async () => {
            const {data} = await Api.getAllData();
            setData([...data]);
        })()
    },[]);


    useEffect(() => {
        setMapData(data.map(c => {
            return {
                ...states[c.state],
                count: c[query.search],
                state_code: c.state
            }
        }))
    }, [data, query.search])

    useEffect(() => {
        const count = mapData.map(m => m.count)
        setMaxNumber(Math.max(...count));
        setMinNumber(Math.min(...count));
    }, [mapData, query.search]);

    useEffect(() => {
        setMinSize(minNumber !== 0 ? 20 : 0);
    }, [minNumber]);
    return (
        <div>
            <Header />
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={5}
                >
                    {mapData.map(map => {
                        const percent = (map.count * 100) / maxNumber
                        let size;
                        if(maxNumber === map.count){
                            size = maxSize
                        }else if(minNumber === map.count){
                            size = minSize
                        }else{
                            size = percent * (maxSize - minSize) / 100
                        }
                        if(size <= maxSize && size >= minSize){
                            return (
                                <Marker
                                    key={map.state_code}
                                    position={{
                                        lat: +map.latitude,
                                        lng: +map.longitude
                                    }}
                                    title={`${map.name} -  ${map.count}`}
                                    icon={{
                                        url: Icon,
                                        scaledSize: new window.google.maps.Size(size, size),
                                        origin: new window.google.maps.Point(0, 0),
                                        anchor: new window.google.maps.Point(16, 32),
                                    }}
                                />
                            )
                        }

                    })}
                </GoogleMap>
            ) : null}
        </div>
    )
}

export default React.memo(Map)
