// =============== src/components/moderation/ReportContentModal.tsx ===============
import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';

interface ReportContentModalProps {
  contentId: string;
  contentType: 'snippet' | 'doc' | 'bug' | 'comment';
  isOpen: boolean;
  onClose: () => void;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({ contentId, contentType, isOpen, onClose }) => {
    const [reason, setReason] = useState('SPAM');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                reason,
                details,
                [`${contentType}Id`]: contentId,
            };
            await apiClient.post('/moderation', payload);
            setSuccess(true);
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError(null);
        setDetails('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report Content</DialogTitle>
                    <DialogDescription>
                        Let us know why you are reporting this content. Your report is anonymous.
                    </DialogDescription>
                </DialogHeader>
                {success ? (
                    <div className="py-8 text-center">
                        <p className="font-semibold">Thank you for your report!</p>
                        <p className="text-sm text-gray-500">Our moderation team will review it shortly.</p>
                        <Button onClick={handleClose} className="mt-4">Close</Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="reason">Reason</Label>
                            <select
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="SPAM">Spam</option>
                                <option value="HARASSMENT">Harassment or Hate Speech</option>
                                <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                                <option value="COPYRIGHT_VIOLATION">Copyright Violation</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="details">Additional Details (Optional)</Label>
                            <Textarea
                                id="details"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Provide any extra information that might be helpful."
                                className="mt-1"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                )}
                {!success && (
                    <DialogFooter>
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};
