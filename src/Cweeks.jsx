import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cweeks= () => {
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/questions/weeks');
                setWeeks(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching weeks');
                setLoading(false);
            }
        };

        fetchWeeks();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Registered Weeks</h1>
            <ul>
                {weeks.map((week, index) => (
                    <li key={index}>
                        {/* Link to Compiler page with the selected week */}
                        <Link to={`/compiler/${week}`}>Week {week}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Cweeks;
