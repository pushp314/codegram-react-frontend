import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

interface Report {
  id: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  reporter: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  reported: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  snippet?: { id: string; title: string };
  doc?: { id: string; title: string };
  bug?: { id: string; title: string };
  comment?: { id: string; content: string };
}

export const AdminPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            setError(null);
            try {
                // UPDATED: Use the correct API path
                const { data } = await apiClient.get('/api/reports', {
                    params: { status: 'PENDING', limit: 20 }
                });
                setReports(data.reports);
            } catch (err: any) {
                setError('Failed to fetch reports.');
                console.error("Failed to fetch reports", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleResolve = async (reportId: string, status: ReportStatus) => {
        setActionLoading(reportId);
        try {
            // UPDATED: Use the correct API path
            await apiClient.patch(`/api/reports/${reportId}/status`, { status });
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (err: any) {
            setError('Failed to update report status.');
            console.error("Failed to resolve report", err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Moderation Queue</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Reports</CardTitle>
                    <CardDescription>Review and take action on user-submitted reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Spinner /> : (
                        <div className="space-y-4">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            {reports.length > 0 ? reports.map(report => (
                                <div key={report.id} className="border p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img
                                            src={report.reporter.avatar || '/default-avatar.png'}
                                            alt={report.reporter.username}
                                            className="w-7 h-7 rounded-full border"
                                        />
                                        <span className="font-semibold">{report.reporter.name || report.reporter.username}</span>
                                        <span className="text-xs text-gray-400 ml-2">reported</span>
                                        <img
                                            src={report.reported.avatar || '/default-avatar.png'}
                                            alt={report.reported.username}
                                            className="w-7 h-7 rounded-full border"
                                        />
                                        <span className="font-semibold">{report.reported.name || report.reported.username}</span>
                                    </div>
                                    <p><strong>Reason:</strong> {report.reason.replace(/_/g, ' ')}</p>
                                    <p className="text-sm text-gray-500"><strong>Description:</strong> {report.description || 'N/A'}</p>
                                    <div className="text-sm mt-2 text-gray-600">
                                        {report.snippet && <div><strong>Snippet:</strong> {report.snippet.title}</div>}
                                        {report.doc && <div><strong>Doc:</strong> {report.doc.title}</div>}
                                        {report.bug && <div><strong>Bug:</strong> {report.bug.title}</div>}
                                        {report.comment && <div><strong>Comment:</strong> {report.comment.content}</div>}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={actionLoading === report.id}
                                            onClick={() => handleResolve(report.id, 'DISMISSED')}
                                        >
                                            {actionLoading === report.id ? 'Processing...' : 'Dismiss'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={actionLoading === report.id}
                                            onClick={() => handleResolve(report.id, 'RESOLVED')}
                                        >
                                            {actionLoading === report.id ? 'Processing...' : 'Delete Content'}
                                        </Button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500">The moderation queue is empty.</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};