import React, { useState } from 'react';
import axios from 'axios';

function Compiler() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [testResult, setTestResult] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/compiler/run', {
                code,
                language,
                input,
                expectedOutput,
            });

            setOutput(res.data.output);

            // Verify output against expected output
            if (res.data.result.passed) {
                setTestResult('Test case passed!');
            } else {
                setTestResult('Test case failed!');
            }
        } catch (error) {
            console.error(error);
            setOutput('Error running the code.');
            setTestResult('Error in test case verification.');
        }
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.title}>Online Compiler</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputContainer}>
                    <label>Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={styles.select}
                    >
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                <div style={styles.inputContainer}>
                    <label>Code:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="10"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div style={styles.inputContainer}>
                    <label>Input:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <div style={styles.inputContainer}>
                    <label>Expected Output:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="3"
                        value={expectedOutput}
                        onChange={(e) => setExpectedOutput(e.target.value)}
                    />
                </div>

                <button type="submit" style={styles.runButton}>
                    Run Code
                </button>
            </form>

            <div style={styles.results}>
                <h3>Output:</h3>
                <pre>{output}</pre>
                <h3>Test Result:</h3>
                <pre>{testResult}</pre>
            </div>
        </div>
    );
}

export default Compiler;

const styles = {
    app: {
        width: '80%',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2.5em',
        textAlign: 'center',
        marginBottom: '20px',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    select: {
        padding: '10px',
        fontSize: '1.1em',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    codeEditor: {
        width: '100%',
        padding: '10px',
        fontSize: '1.1em',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '300px',
    },
    runButton: {
        display: 'block',
        margin: '20px 0',
        padding: '10px 20px',
        fontSize: '1.2em',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    results: {
        marginTop: '20px',
    },
};
