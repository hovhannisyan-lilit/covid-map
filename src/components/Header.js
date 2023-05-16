import React, {useCallback, useEffect} from 'react';
import logo from "../assets/images/logo.png";
import Select from 'react-select';
import qs from "query-string";
import {useLocation, useNavigate} from "react-router-dom";

function Header(props) {
    const location = useLocation();
    const query = qs.parse(location.search);
    const navigate = useNavigate();
    const selectOptions = [
        {value: "positive", label: "Positive"},
        {value: "negative", label: "Negative"},
        {value: "totalTestResults", label: "Total test results"},
        {value: "hospitalized", label: "Hospitalized"},
        {value: "death", label: 'Death'}];


    const handleChange = useCallback((value) => {
        query.search = value.value
        navigate(`?${qs.stringify(query)}`, { replace: true });
    }, []);

    useEffect(() => {
        if(!query.search){
            query.search = "positive";
            navigate(`?${qs.stringify(query)}`, { replace: true });
        }
    }, [query.search]);

    return (
        <header className="header-section home-7">
            <div className="header-area">
                <div className="container">
                    <div className="primary-menu">
                        <div className="logo">
                            <img src={logo} alt="logo"/>
                        </div>
                        <div className="main-area">
                               <Select
                                   className="basic-single"
                                   classNamePrefix="select"
                                   value={selectOptions.find(s => s.value === query.search)}
                                   options={selectOptions}
                                   onChange={handleChange}
                               />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
