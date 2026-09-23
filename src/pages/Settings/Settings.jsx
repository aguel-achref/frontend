import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';

import {
    getSettings,
    updateSettings
} from '../../api/settings.api';

function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const loadSettings = async () => {
        try {
            setLoading(true);

            const response = await getSettings();

            if (response.success) {
                setSettings(response.data);
            }
        } catch (error) {
            console.error(error);

            setToast({
                type: 'error',
                message:
                    error.response?.data?.error ||
                    'Impossible de charger les paramètres.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!settings) {
            return;
        }

        try {
            setSaving(true);

            await updateSettings(settings.id, {
                company_name: settings.company_name,
                address: settings.address,
                city: settings.city,
                postal_code: settings.postal_code,
                customs_code: settings.customs_code,
                rne: settings.rne,
                phone: settings.phone,
                financial_code: settings.financial_code,
                biat_account: settings.biat_account,
                attijari_account: settings.attijari_account,
                next_transfer_number:
                    Number(settings.next_transfer_number) || 1
            });

            setToast({
                type: 'success',
                message:
                    'Paramètres enregistrés avec succès.'
            });

            await loadSettings();
        } catch (error) {
            console.error(error);

            setToast({
                type: 'error',
                message:
                    error.response?.data?.error ||
                    'Impossible d’enregistrer les paramètres.'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <PageHeader
                    title="Paramètres"
                    description="Configuration de l'application."
                />

                <Card>
                    <div className="table-loading">
                        Chargement des paramètres...
                    </div>
                </Card>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="page">
                <PageHeader
                    title="Paramètres"
                    description="Configuration de l'application."
                />

                <Card>
                    <p>
                        Aucun paramètre société n'a encore été
                        configuré.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="page settings-page">
            <PageHeader
                title="Paramètres"
                description="Configurez les informations de votre société et les paramètres des virements."
            />

            <form onSubmit={handleSave}>
                <Card
                    title="Informations de la société"
                    description="Ces informations sont utilisées dans les documents et formulaires."
                >
                    <div className="form-grid-2">
                        <Input
                            label="Raison sociale"
                            name="company_name"
                            value={settings.company_name || ''}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Téléphone"
                            name="phone"
                            value={settings.phone || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Adresse"
                            name="address"
                            value={settings.address || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Ville"
                            name="city"
                            value={settings.city || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code postal"
                            name="postal_code"
                            value={settings.postal_code || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code en douane"
                            name="customs_code"
                            value={settings.customs_code || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="RNE"
                            name="rne"
                            value={settings.rne || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Code financier"
                            name="financial_code"
                            value={settings.financial_code || ''}
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <Card
                    title="Comptes bancaires"
                    description="Comptes utilisés pour les virements."
                    className="settings-card-spacing"
                >
                    <div className="form-grid-2">
                        <Input
                            label="Compte BIAT"
                            name="biat_account"
                            value={settings.biat_account || ''}
                            onChange={handleChange}
                        />

                        <Input
                            label="Compte Attijari"
                            name="attijari_account"
                            value={
                                settings.attijari_account || ''
                            }
                            onChange={handleChange}
                        />
                    </div>
                </Card>

                <Card
                    title="Numérotation des virements"
                    description="Le prochain numéro sera utilisé pour générer automatiquement la référence du virement."
                    className="settings-card-spacing"
                >
                    <div className="settings-numbering">
                        <Input
                            label="Prochain numéro"
                            name="next_transfer_number"
                            type="number"
                            min="1"
                            value={
                                settings.next_transfer_number || 1
                            }
                            onChange={handleChange}
                        />

                        <div className="reference-preview">
                            <span>
                                Prochaine référence
                            </span>

                            <strong>
                                {String(
                                    settings.next_transfer_number ||
                                        1
                                ).padStart(6, '0')}
                            </strong>
                        </div>
                    </div>
                </Card>

                <div className="settings-actions">
                    <Button
                        type="submit"
                        loading={saving}
                    >
                        Enregistrer les paramètres
                    </Button>
                </div>
            </form>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default Settings;