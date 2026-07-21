import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Upload, Loader2, Save, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPaymentSettings, updatePaymentSettings } from '../../../store/thunk/paymentThunk';

const PaymentSettingsPage = ({ isComponent = false }) => {

    const dispatch = useDispatch();
    const { settings, loading, error } = useSelector((state) => state.payment);
    const [saving, setSaving] = useState(false);

    const [upiId, setUpiId] = useState('');
    const [currentQr, setCurrentQr] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchPaymentSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setUpiId(settings.upiId || '');
            setCurrentQr(settings.qrCodeImage || '');
            setPreviewUrl(settings.qrCodeImage || '');
        }
    }, [settings]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrFile(file); // Raw file object
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result); // For preview only
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('upiId', upiId);
            
            if (qrFile) {
                formData.append('qrCodeImage', qrFile);
            }

            const resultAction = await dispatch(updatePaymentSettings(formData));
            if (updatePaymentSettings.fulfilled.match(resultAction)) {
                toast.success("Payment settings updated successfully");
                setCurrentQr(resultAction.payload.settings?.qrCodeImage || resultAction.payload.qrCodeImage);
            } else {
                toast.error(resultAction.payload || "Failed to update payment settings");
            }
        } catch (error) {
            toast.error("Failed to update payment settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary size-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!isComponent && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <CreditCard className="text-primary" /> Payment Settings
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage UPI details and QR code for payments.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Settings Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                UPI ID
                            </label>
                            <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="e.g. name@upi"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                QR Code Image
                            </label>
                            <div className="flex flex-col gap-4">
                                <label className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                    <Upload size={20} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {qrFile ? 'Change QR Image' : 'Upload QR Image'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="text-[11px] text-slate-500 text-center">
                                    Recommended: Square PNG or JPG (Max 2MB)
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Live Preview</h3>

                    <div className="size-48 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden p-4">
                        {previewUrl ? (
                            <img src={previewUrl} alt="QR Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center gap-2 text-center">
                                <CreditCard size={48} className="opacity-20" />
                                <p className="text-xs font-medium">No QR Uploaded</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active UPI ID</p>
                        <p className="text-sm font-bold text-primary">{upiId || 'Not set'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSettingsPage;
