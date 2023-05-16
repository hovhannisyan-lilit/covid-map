import React, {useEffect, useState, memo} from 'react'
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
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBklqJJDwpUSjs3kLh95GO3itI7DRV4DyE"
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
                        const count = mapData.map(m => m.count)
                        const maxNumber = Math.max(...count);
                        const minNumber = Math.min(...count);
                        const percent = (map.count * 100) / maxNumber
                        const minSize = minNumber !== 0 ? 20 : 0
                        let size;
                        if(maxNumber === map.count){
                            size = maxSize
                        }else if(minNumber === map.count){
                            size = minSize
                        }else{
                            size = percent * (maxSize - minSize) / 100
                        }
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

                    })}
                </GoogleMap>
            ) : null}
        </div>
    )
}

export default memo(Map)
