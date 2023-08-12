import styles from '../styles/main.module.css';
import React, { useState, createRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [FormValues, SetFormValues] = useState({ name: '', email: '', latitude: '', longitude: '' });
    const [EmailError, SetEmailError] = useState(false);
    const [EmailErrorMessage, SetEmailErrorMessage] = useState('');
    const [loading, SetLoading] = useState(false);
    const EmailInput = createRef();
    const navigate = useNavigate();

    const SetLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {

            SetFormValues({ ...FormValues, latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
    }

    const HandleFormChange = (e) => {
        SetFormValues({ ...FormValues, [e.target.name]: e.target.value });
    }

    const FormSubmit = (e) => {
        let EmailRegex = /\S+@\S+\.\S+/;
        const Emailinput = EmailInput.current;
        e.preventDefault();

        if (!EmailRegex.test(FormValues.email)) {
            console.log('invalid email');
            Emailinput.focus();
            SetEmailError(true);
            SetEmailErrorMessage('Invalid email!');
            e.preventDefault();
            return;
        } else {
            e.preventDefault();
            SetLoading(true);

            fetch('dailyweatherbackend.meeeees.repl.co/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: FormValues.name,
                    email: FormValues.email,
                    latitude: FormValues.latitude,
                    longitude: FormValues.longitude,
                }),
            })
                .then((response) => {
                    console.log(EmailInput);
                    if (response.status === 409) {
                        Emailinput.focus();
                        SetEmailError(true);
                        SetLoading(false);
                        SetEmailErrorMessage('Email already exists!');
                    } else if (!response.ok) {
                        SetLoading(false);
                        throw new Error('Network response was not ok');
                    } else {
                        SetFormValues({ name: '', email: '', latitude: '', longitude: '' });
                        navigate('/success');
                    }
                    SetLoading(false);
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error:', error);
                }
                );
        }
    }


    return (
        <>
            <h1>Wheater email app</h1>
            <p>Register and receive an daily email about the wheater in your area!</p>

            <form className={styles.main__form} onSubmit={FormSubmit}>
                <input onChange={HandleFormChange} type="text" value={FormValues.name} name="name" placeholder="name"></input>
                <input onChange={HandleFormChange} type="text" value={FormValues.email} ref={EmailInput} name="email" className={`${EmailError ? styles.error : ''}`} placeholder="email"></input>
                {EmailError ? <p className={styles.errorHelper}>{EmailErrorMessage}</p> : null}
                <div>
                    <input onChange={HandleFormChange} type="text" value={FormValues.latitude} size={1} name="latitude" placeholder="lat"></input>
                    <input onChange={HandleFormChange} type="text" value={FormValues.longitude} size={1} name="longitude" placeholder="long"></input>
                    <button type='button' onClick={SetLocation}><FontAwesomeIcon icon={faLocationDot} /></button>
                </div>
                <button type="submit">Signup!</button>
            </form>
            {
                loading ? (
                    <div className={styles.main__spinner}>
                        <TailSpin color="#00BFFF" height={80} width={80} /> </div>
                ) : null
            }
        </>

    );
}

export default Main;