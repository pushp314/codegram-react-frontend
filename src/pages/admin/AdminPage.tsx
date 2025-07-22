// =============== src/pages/admin/AdminPage.tsx ===============
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Spinner } from '../../components/ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const AdminPage: React.FC = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await apiClient.get('/moderation');
                setReports(data.reports);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleResolve = async (reportId: string, action: string) => {
        // Optimistically update UI
        setReports(prev => prev.filter(r => r.id !== reportId));
        try {
            await apiClient.patch(`/moderation/${reportId}`, { action });
        } catch (error) {
            console.error("Failed to resolve report", error);
            // Re-fetch or show error
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
                            {reports.length > 0 ? reports.map(report => (
                                <div key={report.id} className="border p-4 rounded-lg">
                                    <p><strong>Reason:</strong> {report.reason}</p>
                                    <p className="text-sm text-gray-500"><strong>Details:</strong> {report.details || 'N/A'}</p>
                                    <div className="mt-4 flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleResolve(report.id, 'DISMISS')}>Dismiss</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleResolve(report.id, 'DELETE_CONTENT')}>Delete Content</Button>
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
