import styles from './TimeDisplay.module.css'
import { useState, useEffect, useRef } from "react";

export function TimeDisplay() {
    // TODO: Fix all of this. Button has no eventlistener
    const [ time, setTime ] = useState<Date>(new Date());
    const intervalRef = useRef(null);

    const handleClick = async () => {
        try {
            const currentTime = time.getTime();
            await navigator.clipboard.writeText(currentTime.toString());
            console.log("Time copied to clipboard:", currentTime);
        } catch (err) {
            console.error("Clipboard write failed:", err);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [] );

    return (
        <>
            <button
                className={styles.timer}
                ref={intervalRef}
            >{time.getHours()}:{time.getMinutes()}:{time.getSeconds()}</button>
        </>
    )
}