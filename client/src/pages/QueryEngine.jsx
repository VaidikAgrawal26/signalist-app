import React, { useState, useEffect } from 'react';
import { Play, Database, Table, Code, ChevronRight, AlertCircle, Terminal, History, BookOpen } from 'lucide-react';
import { executeQuery, getSchema } from '../utils/api';

const QueryEngine = () => {
    const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users LIMIT 10;");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('results'); // 'results', 'history', 'schema'

    // New Feature States
    const [queryHistory, setQueryHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('queryHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    // Persist history to local storage
    useEffect(() => {
        localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
    }, [queryHistory]);

    // Fetch schema on mount
    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const data = await getSchema();
                setDatabaseSchema(data.schema);
            } catch (err) {
                console.error("Failed to fetch schema:", err);
            }
        };
        fetchSchema();
    }, []);

    const handleExecute = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        setActiveTab('results'); // Switch back to results tab on execution

        try {
            const data = await executeQuery(sqlQuery);
            setResults(data.results);

            // Add to history (avoid duplicates at the top, keep last 15)
            setQueryHistory(prev => {
                const newHistory = [sqlQuery, ...prev.filter(q => q !== sqlQuery)].slice(0, 15);
                return newHistory;
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHistory = (query) => {
        setSqlQuery(query);
    };

    // Table Rendering Helper
    const renderTable = () => {
        if (!results) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <Database size={32} className="mb-4 opacity-50" />
                    <p>Construct a SQL query and click Execute</p>
                </div>
            );
        }

        if (Array.isArray(results) && results.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                    <Database size={32} className="mb-4 opacity-50" />
                    <p>Query executed successfully. 0 rows returned.</p>
                </div>
            );
        }

        // For UPDATE/INSERT/DELETE queries, results might be an object instead of an array
        if (!Array.isArray(results) || !results[0] || typeof results[0] !== 'object') {
            return (
                <div className="p-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </div>
                </div>
            );
        }

        const columns = Object.keys(results[0]);

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            {columns.map(col => (
                                <th key={col} className="p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider sticky top-0 bg-[#161b22] z-10">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                {columns.map(col => (
                                    <td key={col} className="p-3 text-sm text-gray-300 whitespace-nowrap">
                                        {row[col] === null ? (
                                            <span className="text-gray-600 italic">NULL</span>
                                        ) : typeof row[col] === 'object' ? (
                                            JSON.stringify(row[col])
                                        ) : (
                                            String(row[col])
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Terminal className="text-accent" />
                        DBMS Query Engine
                    </h1>
                    <div className="text-gray-400 text-sm ml-4 border border-white/10 px-3 py-1 bg-surface rounded">
                        MySQL Connection Active
                    </div>
                </div>

                <button
                    onClick={handleExecute}
                    disabled={loading || !sqlQuery.trim()}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all shadow-lg ${loading || !sqlQuery.trim()
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/20'
                        }`}
                >
                    {loading ? 'Executing...' : (
                        <>
                            <Play size={18} />
                            Execute Query
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left Panel: Query Construction */}
                <div className="col-span-12 lg:col-span-5 flex flex-col bg-surface border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Code size={18} className="text-primary" />
                            SQL Query
                        </h3>
                        <span className="text-xs text-gray-400">MySQL Syntax</span>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={sqlQuery}
                            onChange={(e) => setSqlQuery(e.target.value)}
                            className="w-full h-full bg-[#0d1117] text-green-400 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-1 focus:ring-accent/50"
                            spellCheck="false"
                            placeholder="Enter your SQL query here..."
                        />
                    </div>
                </div>

                {/* Right Panel: Tabs for Results, History, Schema */}
                <div className="col-span-12 lg:col-span-7 flex flex-col bg-surface border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">

                    {/* Tab Header */}
                    <div className="border-b border-white/10 bg-white/5 flex">
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'results' ? 'text-accent border-b-2 border-accent bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Table size={16} /> Results
                            {activeTab === 'results' && results && (
                                <span className="ml-2 py-0.5 px-2 bg-accent/20 text-accent rounded-full text-xs">
                                    {results.length} rows
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <History size={16} /> History
                            {queryHistory.length > 0 && (
                                <span className="ml-2 py-0.5 px-2 bg-white/10 text-gray-300 rounded-full text-xs">
                                    {queryHistory.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('schema')}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'schema' ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            <BookOpen size={16} /> Schema
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 bg-[#0d1117] overflow-auto relative">

                        {/* Tab: Results */}
                        {activeTab === 'results' && (
                            <div className="h-full">
                                {error ? (
                                    <div className="m-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                        <div className="overflow-x-auto">
                                            <p className="font-bold mb-1">Execution Error</p>
                                            <pre className="text-sm font-mono whitespace-pre-wrap">{error}</pre>
                                        </div>
                                    </div>
                                ) : results ? (
                                    renderTable()
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                                        <Database size={48} className="opacity-20" />
                                        <p>Construct a SQL query and click Execute</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: History */}
                        {activeTab === 'history' && (
                            <div className="p-4">
                                {queryHistory.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        No queries executed yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {queryHistory.map((q, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectHistory(q)}
                                                className="p-3 rounded border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all flex items-start gap-3 group"
                                            >
                                                <ChevronRight size={16} className="mt-1 text-gray-500 group-hover:text-primary shrink-0" />
                                                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-all">{q}</pre>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Schema */}
                        {activeTab === 'schema' && (
                            <div className="p-4">
                                {!databaseSchema ? (
                                    <div className="text-center text-gray-500 mt-8 animate-pulse">
                                        Loading schema...
                                    </div>
                                ) : Object.keys(databaseSchema).length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        No tables found in database.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(databaseSchema).map(([tableName, columns]) => (
                                            <div key={tableName} className="border border-white/10 rounded-lg bg-surface overflow-hidden">
                                                <div className="bg-white/5 px-3 py-2 border-b border-white/10 font-semibold text-purple-300 flex items-center justify-between">
                                                    <span>{tableName}</span>
                                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{columns.length} cols</span>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto p-0">
                                                    <table className="w-full text-left text-xs">
                                                        <tbody className="divide-y divide-white/5">
                                                            {columns.map((col, idx) => (
                                                                <tr key={idx} className="hover:bg-white/5">
                                                                    <td className="px-3 py-2 text-gray-300 font-mono">{col.columnName}</td>
                                                                    <td className="px-3 py-2 text-gray-500 font-mono text-right">{col.dataType}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryEngine;
