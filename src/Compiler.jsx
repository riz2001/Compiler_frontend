import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Compiler() {
    const { week } = useParams(); // Get week from the URL
    const [questions, setQuestions] = useState([]);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [testResult, setTestResult] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Fetch questions for the selected week
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/questions/week/${week}`);
                setQuestions(res.data);
            } catch (err) {
                console.error('Error fetching questions for the week', err);
            }
        };

        if (week) fetchQuestions();
    }, [week]);

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
        } catch (error) {
            console.error('Error running the code:', error);
            setOutput('Error running the code.');
        }
    };

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
  
        setInput('');
        setExpectedOutput('');
        setTestResult([]);
    };

    const runWithTestCase = async (testCase) => {
        setInput(testCase.input);
        setExpectedOutput(testCase.expectedOutput);

        try {
            const res = await axios.post('http://localhost:5000/api/compiler/run', {
                code,
                language,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
            });

            console.log('API Response:', res.data);
            const actualOutput = res.data.output;
            const passed = actualOutput.trim() === testCase.expectedOutput.trim();

            setOutput(actualOutput);
            setTestResult([{
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: actualOutput,
                passed: passed
            }]);
        } catch (error) {
            console.error('Error running the code with test case:', error);
            setOutput('Error running the code with test case.');
            setTestResult([]);
        }
    };
    
    return (
        <div style={styles.app}>
            <h1 style={styles.title}>Online Compiler</h1>

            {questions.length > 0 && (
                <div style={styles.questionsList}>
                    <h2>Questions for Week {week}</h2>
                    <ul style={styles.questionList}>
                        {questions.map((question) => (
                            <li key={question._id} onClick={() => handleQuestionSelect(question)} style={styles.questionItem}>
                                <strong>{question.title}</strong>
                                <p>{question.description}</p>
                                <p style={styles.formatText}><strong>Input Format:</strong> {question.inputFormat}</p>
                                <p style={styles.formatText}><strong>Output Format:</strong> {question.outputFormat}</p>
                                <h4 style={styles.testCasesTitle}>Test Cases:</h4>
                                <ul>
                                    {question.testCases.map((testCase, index) => (
                                        <li key={index} style={styles.testCaseItem}>
                                            <strong>Input:</strong> {testCase.input} | 
                                            <strong>Expected Output:</strong> {testCase.expectedOutput}
                                            <button onClick={() => runWithTestCase(testCase)} style={styles.loadButton}>
                                                Run with Test Case
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Language:</label>
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
                    <label style={styles.label}>Code:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="10"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Input:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
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
                {Array.isArray(testResult) && testResult.map((result, index) => (
                    <div key={index} style={result.passed ? styles.testPassed : styles.testFailed}>
                        <p>
                            <strong>Input:</strong> {result.input}<br />
                            <strong>Expected Output:</strong> {result.expectedOutput}<br />
                            <strong>Actual Output:</strong> {result.actualOutput}<br />
                            <strong>Test Case {result.passed ? 'Passed' : 'Failed'}</strong>
                        </p>
                    </div>
                ))}
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
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2.5em',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#343a40',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    select: {
        padding: '10px',
        fontSize: '1.1em',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#ffffff',
    },
    codeEditor: {
        width: '100%',
        padding: '10px',
        fontSize: '1.1em',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '300px',
        backgroundColor: '#ffffff',
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
        transition: 'background-color 0.3s',
    },
    runButtonHover: {
        backgroundColor: '#218838',
    },
    results: {
        marginTop: '20px',
    },
    questionsList: {
        marginBottom: '20px',
    },
    questionList: {
        listStyleType: 'none',
        padding: 0,
    },
    questionItem: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    formatText: {
        fontStyle: 'italic',
        color: '#6c757d',
    },
    testCasesTitle: {
        marginTop: '10px',
        color: '#007bff',
    },
    testCaseItem: {
        marginBottom: '10px',
    },
    loadButton: {
        marginLeft: '10px',
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    testPassed: {
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px',
    },
    testFailed: {
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px',
    },
};

