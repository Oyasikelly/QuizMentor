'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/shared/loading-spinner';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from 'docx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// Cloudinary upload helper
async function uploadToCloudinary(file: File): Promise<string | null> {
  const url = 'https://api.cloudinary.com/v1_1/demo/image/upload'; // Replace 'demo' with your cloud name
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Replace with your upload preset
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) return null;
  const data = await res.json();
  return data.secure_url as string;
}

function AccountSecuritySection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  if (!user) return null;

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const currentPassword = (
      form.elements.namedItem('current-password') as HTMLInputElement
    ).value;
    const newPassword = (
      form.elements.namedItem('new-password') as HTMLInputElement
    ).value;
    const confirmPassword = (
      form.elements.namedItem('confirm-password') as HTMLInputElement
    ).value;
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user!.id, currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to change password.');
    } else {
      setSuccess('Password changed successfully.');
      toast.success('Password changed successfully!');
      form.reset();
    }
    setLoading(false);
  }

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This cannot be undone.'
      )
    )
      return;
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    const password = window.prompt('Please enter your password to confirm:');
    if (!password) {
      setDeleteLoading(false);
      return;
    }
    const res = await fetch('/api/auth/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user!.id, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDeleteError(data.error || 'Failed to delete account.');
    } else {
      setDeleteSuccess('Account deleted. Logging out...');
      toast.success('Account deleted. Logging out...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    setDeleteLoading(false);
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account & Security</CardTitle>
        <CardDescription>
          Change your password or manage account security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3 max-w-md"
          onSubmit={handlePasswordChange}
        >
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium mb-1"
            >
              Current Password
            </label>
            <Input
              id="current-password"
              type="password"
              name="current-password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium mb-1"
            >
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              name="new-password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium mb-1"
            >
              Confirm New Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              name="confirm-password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
        <div className="mt-4">
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
          {deleteError && (
            <div className="text-red-500 text-sm mt-2">{deleteError}</div>
          )}
          {deleteSuccess && (
            <div className="text-green-600 text-sm mt-2">{deleteSuccess}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    emailQuizzes: true,
    emailResults: true,
    inappAchievements: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrefs() {
      setLoading(true);
      if (!user?.id) return;
      const res = await fetch(
        `/api/student/notification-preferences?studentId=${user!.id}`
      );
      const data = await res.json();
      if (data.notificationPrefs) setPrefs(data.notificationPrefs);
      setLoading(false);
    }
    fetchPrefs();
  }, [user?.id, user]);

  if (!user) return null;

  async function handleChange(key: string, value: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaving(true);
    if (!user?.id) return;
    await fetch('/api/student/notification-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user!.id,
        notificationPrefs: { ...prefs, [key]: value },
      }),
    });
    setSaveMsg('Saved!');
    setSaving(false);
    setTimeout(() => setSaveMsg(null), 1200);
  }

  if (loading)
    return (
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>Loading...</CardContent>
        </Card>
      </div>
    );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Switch
              id="email-quizzes"
              checked={prefs.emailQuizzes}
              onCheckedChange={(v) => handleChange('emailQuizzes', v)}
              disabled={saving}
            />
            <label htmlFor="email-quizzes" className="text-sm">
              Email me about new quizzes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="email-results"
              checked={prefs.emailResults}
              onCheckedChange={(v) => handleChange('emailResults', v)}
              disabled={saving}
            />
            <label htmlFor="email-results" className="text-sm">
              Email me quiz results
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="inapp-achievements"
              checked={prefs.inappAchievements}
              onCheckedChange={(v) => handleChange('inappAchievements', v)}
              disabled={saving}
            />
            <label htmlFor="inapp-achievements" className="text-sm">
              Show in-app achievement notifications
            </label>
            {saveMsg && (
              <span className="text-green-600 text-xs ml-2">{saveMsg}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonalizationSection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6 bg-blue-50 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>Customize your learning experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Switch id="dark-mode" />
            <label htmlFor="dark-mode" className="text-sm">
              Enable dark mode
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="ai-tone" />
            <label htmlFor="ai-tone" className="text-sm">
              Friendly AI Mentor
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="leaderboard-optin" defaultChecked />
            <label htmlFor="leaderboard-optin" className="text-sm">
              Show me on leaderboards
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacyDataSection() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true); // TODO: Load from backend
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');

  if (!user) return null;

  async function handleDownload() {
    setDownloading(true);
    if (!user?.id) return;
    const res = await fetch(`/api/profile/complete?userId=${user!.id}`);
    const data = await res.json();
    const fileName =
      (data.name ? data.name.replace(/\s+/g, '_') : 'my-data') +
      (format === 'pdf' ? '.pdf' : '.docx');
    if (format === 'pdf') {
      // PDF export
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('User Data Export', 10, 15);
      doc.setFontSize(12);
      let y = 30;
      doc.text('Profile:', 10, y);
      y += 8;
      doc.text(`Name: ${data.name || ''}`, 10, y);
      y += 7;
      doc.text(`Email: ${data.email || ''}`, 10, y);
      y += 7;
      doc.text(`School: ${data.school || ''}`, 10, y);
      y += 7;
      doc.text(`Department: ${data.department || ''}`, 10, y);
      y += 7;
      doc.text(`Year: ${data.year || ''}`, 10, y);
      y += 7;
      doc.text(`Reg No: ${data.regNo || ''}`, 10, y);
      y += 7;
      doc.text(`Phone: ${data.phoneNumber || ''}`, 10, y);
      y += 7;
      doc.text(`Academic Level: ${data.academicLevel || ''}`, 10, y);
      y += 10;
      doc.text('Quiz Attempts:', 10, y);
      y += 8;
      if (data.quizAttempts && data.quizAttempts.length > 0) {
        data.quizAttempts.forEach(
          (
            a: {
              quizTitle?: string;
              subject?: string;
              score?: number;
              totalPoints?: number;
              completedAt?: string;
            },
            i: number
          ) => {
            doc.text(
              `${i + 1}. ${a.quizTitle || ''} (${a.subject || ''}) - Score: ${
                a.score || 0
              }/${a.totalPoints || 0} - Date: ${
                a.completedAt ? new Date(a.completedAt).toLocaleString() : ''
              }`,
              12,
              y
            );
            y += 7;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          }
        );
      } else {
        doc.text('No quiz attempts found.', 12, y);
        y += 7;
      }
      y += 5;
      doc.text('Achievements:', 10, y);
      y += 8;
      if (data.achievements && data.achievements.length > 0) {
        data.achievements.forEach(
          (
            a: { title?: string; name?: string; description?: string },
            i: number
          ) => {
            doc.text(
              `${i + 1}. ${a.title || a.name || ''} - ${a.description || ''}`,
              12,
              y
            );
            y += 7;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          }
        );
      } else {
        doc.text('No achievements found.', 12, y);
        y += 7;
      }
      y += 5;
      doc.text('Badges:', 10, y);
      y += 8;
      if (data.badges && data.badges.length > 0) {
        data.badges.forEach(
          (b: { name?: string; description?: string }, i: number) => {
            doc.text(
              `${i + 1}. ${b.name || ''} - ${b.description || ''}`,
              12,
              y
            );
            y += 7;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          }
        );
      } else {
        doc.text('No badges found.', 12, y);
        y += 7;
      }
      doc.save(fileName);
      toast.success('PDF downloaded!');
    } else {
      // DOCX export
      const profileTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('Field')] }),
              new TableCell({ children: [new Paragraph('Value')] }),
            ],
          }),
          ...[
            ['Name', data.name],
            ['Email', data.email],
            ['School', data.school],
            ['Department', data.department],
            ['Year', data.year],
            ['Reg No', data.regNo],
            ['Phone', data.phoneNumber],
            ['Academic Level', data.academicLevel],
          ].map(
            ([k, v]) =>
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(k)] }),
                  new TableCell({ children: [new Paragraph(v || '')] }),
                ],
              })
          ),
        ],
      });
      const quizRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Quiz Title')] }),
            new TableCell({ children: [new Paragraph('Subject')] }),
            new TableCell({ children: [new Paragraph('Score')] }),
            new TableCell({ children: [new Paragraph('Date')] }),
          ],
        }),
        ...(data.quizAttempts || []).map(
          (a: {
            quizTitle?: string;
            subject?: string;
            score?: number;
            totalPoints?: number;
            completedAt?: string;
          }) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(a.quizTitle || '')] }),
                new TableCell({ children: [new Paragraph(a.subject || '')] }),
                new TableCell({
                  children: [
                    new Paragraph(`${a.score || 0}/${a.totalPoints || 0}`),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph(
                      a.completedAt
                        ? new Date(a.completedAt).toLocaleString()
                        : ''
                    ),
                  ],
                }),
              ],
            })
        ),
      ];
      const achievementsRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Title')] }),
            new TableCell({ children: [new Paragraph('Description')] }),
          ],
        }),
        ...(data.achievements || []).map(
          (a: { title?: string; name?: string; description?: string }) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(a.title || a.name || '')],
                }),
                new TableCell({
                  children: [new Paragraph(a.description || '')],
                }),
              ],
            })
        ),
      ];
      const badgesRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('Name')] }),
            new TableCell({ children: [new Paragraph('Description')] }),
          ],
        }),
        ...(data.badges || []).map(
          (b: { name?: string; description?: string }) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(b.name || '')] }),
                new TableCell({
                  children: [new Paragraph(b.description || '')],
                }),
              ],
            })
        ),
      ];
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ text: 'User Data Export', heading: 'Heading1' }),
              new Paragraph('Profile:'),
              profileTable,
              new Paragraph('Quiz Attempts:'),
              new Table({ rows: quizRows }),
              new Paragraph('Achievements:'),
              new Table({ rows: achievementsRows }),
              new Paragraph('Badges:'),
              new Table({ rows: badgesRows }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('DOCX downloaded!');
    }
    setDownloading(false);
  }

  async function handleAnalyticsConsent(val: boolean) {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setAnalyticsConsent(val);
      setSaveMsg('Saved!');
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 1500);
    }, 800);
  }

  return (
    <Card className="mb-6 bg-green-50 dark:bg-green-900/10">
      <CardHeader>
        <CardTitle>Privacy & Data</CardTitle>
        <CardDescription>
          Manage your data and privacy preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading
                ? 'Downloading...'
                : `Download My Data (${format.toUpperCase()})`}
            </Button>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={format}
              onChange={(e) => setFormat(e.target.value as 'pdf' | 'docx')}
              disabled={downloading}
              aria-label="Select download format"
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="analytics-consent"
              checked={analyticsConsent}
              onCheckedChange={handleAnalyticsConsent}
              disabled={saving}
            />
            <label htmlFor="analytics-consent" className="text-sm">
              Allow personalized analytics
            </label>
            {saveMsg && (
              <span className="text-green-600 text-xs ml-2">{saveMsg}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectedAccountsSection() {
  // TODO: Integrate with backend
  return (
    <Card className="mb-6 bg-purple-50 dark:bg-purple-900/10">
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your linked accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Google</Badge>
            <Button variant="outline" size="sm">
              Unlink
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Microsoft</Badge>
            <Button variant="outline" size="sm">
              Unlink
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportSection() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [issueType, setIssueType] = useState('General');
  const [urgency, setUrgency] = useState('Normal');
  const [sendCopy, setSendCopy] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubject, setReportSubject] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [reportScreenshot, setReportScreenshot] = useState<File | null>(null);
  const [reportSending, setReportSending] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reportTicket, setReportTicket] = useState<string | null>(null);
  const [reportIssueType, setReportIssueType] = useState('Bug');
  const [reportUrgency, setReportUrgency] = useState('Normal');
  const [reportSendCopy, setReportSendCopy] = useState(false);

  const FAQS = [
    {
      q: 'How do I reset my password?',
      a: 'Go to Settings > Account & Security and use the password change form.',
    },
    {
      q: 'How do I contact support?',
      a: 'Use the Contact Support button in this section to send us a message.',
    },
    {
      q: 'How do I download my data?',
      a: 'Go to Settings > Privacy & Data and click Download My Data.',
    },
    {
      q: 'How do I link my Google or Microsoft account?',
      a: 'Go to Settings > Connected Accounts and use the Link/Unlink buttons.',
    },
    {
      q: 'How do I report a bug?',
      a: 'Use the Report a Problem button in this section.',
    },
    {
      q: 'How do I view my achievements?',
      a: 'Go to the Achievements page from the sidebar or dashboard.',
    },
    {
      q: 'How do I take a quiz?',
      a: 'Go to the Quizzes section and select a quiz to start.',
    },
  ];
  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);
    setTicket(null);
    const screenshotUrl = screenshot
      ? (await uploadToCloudinary(screenshot)) || ''
      : '';
    const res = await fetch('/api/student/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user?.name || '',
        email: user?.email || '',
        subject,
        message:
          message + (screenshotUrl ? `\n\nScreenshot: ${screenshotUrl}` : ''),
        screenshotUrl,
        issueType,
        urgency,
        sendCopy,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess('Support request sent!');
      toast.success('Support request sent!');
      setSubject('');
      setMessage('');
      setScreenshot(null);
      setTicket(data.ticket || null);
      setOpen(false);
    } else {
      setError(data.error || 'Failed to send support request.');
      toast.error(data.error || 'Failed to send support request.');
    }
    setSending(false);
  }

  async function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReportSending(true);
    setReportError(null);
    setReportSuccess(null);
    setReportTicket(null);
    if (!reportScreenshot) {
      setReportError('Screenshot is required.');
      setReportSending(false);
      return;
    }
    const screenshotUrl = (await uploadToCloudinary(reportScreenshot)) || '';
    const res = await fetch('/api/student/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: user?.name || '',
        email: user?.email || '',
        subject: `[Bug Report] ${reportSubject}`,
        message:
          reportMessage +
          (screenshotUrl ? `\n\nScreenshot: ${screenshotUrl}` : ''),
        screenshotUrl,
        issueType: reportIssueType,
        urgency: reportUrgency,
        sendCopy: reportSendCopy,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setReportSuccess('Bug report sent!');
      toast.success('Bug report sent!');
      setReportSubject('');
      setReportMessage('');
      setReportScreenshot(null);
      setReportTicket(data.ticket || null);
      setReportOpen(false);
    } else {
      setReportError(data.error || 'Failed to send bug report.');
      toast.error(data.error || 'Failed to send bug report.');
    }
    setReportSending(false);
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Support & Help</CardTitle>
        <CardDescription>
          Contact support or find answers to your questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 max-w-md">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Contact Support</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Support</DialogTitle>
                <DialogDescription>
                  Fill out the form below and our team will get back to you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="text-sm font-medium" htmlFor="support-name">
                  Name
                </label>
                <Input
                  id="support-name"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-100"
                />
                <label className="text-sm font-medium" htmlFor="support-email">
                  Email
                </label>
                <Input
                  id="support-email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
                <label
                  className="text-sm font-medium"
                  htmlFor="support-subject"
                >
                  Subject
                </label>
                <Input
                  id="support-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <label
                  className="text-sm font-medium"
                  htmlFor="support-message"
                >
                  Message
                </label>
                <textarea
                  id="support-message"
                  className="border rounded px-2 py-1 min-h-[80px]"
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <label className="text-sm font-medium">
                  Attach Screenshot (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />
                <label
                  className="text-sm font-medium"
                  htmlFor="support-issue-type"
                >
                  Issue Type
                </label>
                <select
                  id="support-issue-type"
                  className="border rounded px-2 py-1"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  required
                >
                  <option>General</option>
                  <option>Bug</option>
                  <option>Feature Request</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
                <label
                  className="text-sm font-medium"
                  htmlFor="support-urgency"
                >
                  Urgency
                </label>
                <select
                  id="support-urgency"
                  className="border rounded px-2 py-1"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  required
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={sendCopy}
                    onChange={(e) => setSendCopy(e.target.checked)}
                  />
                  Send me a copy
                </label>
                {ticket && (
                  <div className="text-green-700 text-sm mt-2">
                    Your ticket number:{' '}
                    <span className="font-mono">{ticket}</span>
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={sending}>
                    {sending ? 'Sending...' : 'Send'}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 text-sm mt-2">{success}</div>
                )}
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">FAQ / Help Center</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>FAQ / Help Center</DialogTitle>
                <DialogDescription>
                  Search or browse common questions below.
                </DialogDescription>
              </DialogHeader>
              <input
                className="border rounded px-2 py-1 mb-2 w-full"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto space-y-4">
                {filteredFaqs.length === 0 && (
                  <div className="text-muted-foreground text-sm">
                    No results found.
                  </div>
                )}
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="border-b pb-2 mb-2">
                    <div className="font-semibold">Q: {faq.q}</div>
                    <div className="text-muted-foreground">A: {faq.a}</div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Report a Problem</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report a Problem</DialogTitle>
                <DialogDescription>
                  Please describe the issue and attach a screenshot. All fields
                  are required.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleReportSubmit}
                className="flex flex-col gap-3"
              >
                <label className="text-sm font-medium" htmlFor="report-subject">
                  Subject
                </label>
                <Input
                  id="report-subject"
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                  required
                />
                <label className="text-sm font-medium" htmlFor="report-message">
                  Message
                </label>
                <textarea
                  id="report-message"
                  className="border rounded px-2 py-1 min-h-[80px]"
                  placeholder="Describe the problem in detail..."
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  required
                />
                <label
                  className="text-sm font-medium"
                  htmlFor="report-screenshot"
                >
                  Attach Screenshot (required)
                </label>
                <input
                  id="report-screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setReportScreenshot(e.target.files?.[0] || null)
                  }
                  required
                />
                <label
                  className="text-sm font-medium"
                  htmlFor="report-issue-type"
                >
                  Issue Type
                </label>
                <select
                  id="report-issue-type"
                  className="border rounded px-2 py-1"
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  required
                >
                  <option>Bug</option>
                  <option>Feature Request</option>
                  <option>Account Issue</option>
                  <option>Other</option>
                </select>
                <label className="text-sm font-medium" htmlFor="report-urgency">
                  Urgency
                </label>
                <select
                  id="report-urgency"
                  className="border rounded px-2 py-1"
                  value={reportUrgency}
                  onChange={(e) => setReportUrgency(e.target.value)}
                  required
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={reportSendCopy}
                    onChange={(e) => setReportSendCopy(e.target.checked)}
                  />
                  Send me a copy
                </label>
                {reportTicket && (
                  <div className="text-green-700 text-sm mt-2">
                    Your ticket number:{' '}
                    <span className="font-mono">{reportTicket}</span>
                  </div>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={reportSending}>
                    {reportSending ? 'Sending...' : 'Send'}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
                {reportError && (
                  <div className="text-red-600 text-sm mt-2">{reportError}</div>
                )}
                {reportSuccess && (
                  <div className="text-green-600 text-sm mt-2">
                    {reportSuccess}
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentSettingsPage() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner text="Loading your dashboard..." />;
  if (!user) return null;
  return (
    <DashboardLayout pageTitle="Settings">
      <div className="space-y-6 mx-auto">
        <AccountSecuritySection />
        <NotificationPreferences />
        <PersonalizationSection />
        <PrivacyDataSection />
        <ConnectedAccountsSection />
        <SupportSection />
      </div>
    </DashboardLayout>
  );
}
