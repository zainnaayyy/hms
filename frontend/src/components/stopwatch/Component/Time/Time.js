import { Box } from '@material-ui/core';
import React, { useState, useRef } from 'react';

let time;

const Time = (props) => {


    const getValidDisplayTime = (hours, minutes, seconds) => {
        let tmp = '';
        if (props.displayHours !== false) {
            tmp = tmp + (hours / 100).toFixed(2).slice(2);
            if (props.displayMinutes !== false) {
                tmp = tmp + ":";
            }
        }
        if (props.displayMinutes !== false) {
            tmp = tmp + (minutes / 100).toFixed(2).slice(2);
            if (props.displaySeconds !== false) {
                tmp = tmp + ":";
            }
        }
        if (props.displaySeconds !== false) {
            tmp = tmp + (seconds / 100).toFixed(2).slice(2);
        }
        return tmp;
    };

    let defaultTime;

    if (props.fromTime !== undefined) {
        defaultTime = new Date(props.fromTime);
    }
    else {
        defaultTime = new Date(Date.now());
    }

    const [text, setText] = useState(getValidDisplayTime(defaultTime.getHours(), defaultTime.getMinutes(), defaultTime.getSeconds()));
    const idInterval = useRef(null);
    const [isCount, setIsCount] = useState(false);

    const startStopwatch = () => {

        if (time === undefined) {
            if (props.fromTime !== undefined) {
                time = new Date(props.fromTime);
            }
            else {
                time = new Date(2000, 0, 0, 0, 0, 0, 0);
            }
        }
        let start = Date.now();
        idInterval.current = setInterval(function () {

            const delta = Date.now() - start;
            time.setMinutes(defaultTime.getMinutes());
            time.setHours(defaultTime.getHours());
            time.setSeconds(Math.floor(delta / 1000) + defaultTime.getMinutes());
            props.hint(time.getSeconds());
            setText(getValidDisplayTime(time.getHours(), time.getMinutes(), time.getSeconds()));
        }, 1000);
    };

    if (props.isOn === true && isCount === false) {
        startStopwatch();
        setIsCount(true);
    }
    else if (props.isOn === false && isCount === true) {
        clearInterval(idInterval.current - 1);
        clearInterval(idInterval.current);
        props.setReservationFinished(true);
    }

    return (
        <React.Fragment>
            <Box fontSize={20} color="greenyellow">{text}</Box>
        </React.Fragment>
    );
};

export default Time;